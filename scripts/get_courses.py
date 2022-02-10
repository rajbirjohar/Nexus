# For some reason the requests we were submitting no longer worked (returned null data) but it worked if you visted the URL in the browser
# Reason being that you "create" a session by visting the link and then selecting a search term
# In order to get the correct response we first had to submit a GET request to the term selection/search page making sure to use a session object because
# a session object allows us to persist parameters across requests. We then submit our original GET request to get the course data we are after

import requests
import json

def main():
    # Get the 5 most recent term codes for use in requests later
    termsURL = 'https://registrationssb.ucr.edu/StudentRegistrationSsb/ssb/classSearch/getTerms?searchTerm=&offset=1&max=5'
    termsJSON = requests.get(termsURL).json()

    termCodes = []
    for termObj in termsJSON:
        termCodes.append(termObj['code'])

    # Used to ensure we don't collect duplicate courses across terms
    uniqueCourses = set()

    # Stores just the data we need (subjectCourse, subjectTitle) after parsing the original response
    filteredData = []

    # Establish session for cookies and such I believe
    s = requests.Session()

    for term in termCodes:
        # This is the url we have to submit a request to before requesting the course data
        # Gonna be honest idk how I got this url. I could not figure out which url was submitting the request after selecting a term
        # So out of desperation I started manaully changing the params and this worked...so yeah 
        s.get('https://registrationssb.ucr.edu/StudentRegistrationSsb/ssb/term/search?mode=search&term=' + term)
        print('Term: ', term)
        
        pageOffset = 0
        coursesURL = 'https://registrationssb.ucr.edu/StudentRegistrationSsb/ssb/searchResults/searchResults?txt_course_number_range=0&txt_course_number_range_to=199&txt_term=' + term + '&pageOffset=' + str(pageOffset) + '&pageMaxSize=999&sortColumn=subjectDescription&sortDirection=asc'
        print(coursesURL)
        coursesJSON = s.get(coursesURL).json()
        courseData = coursesJSON['data']

        while courseData:
            print('pageOffset: ', pageOffset)
            for course in courseData:
                subjectCourse = course['subjectCourse']
                sequenceNumber = course['sequenceNumber']   # Sequence number so we don't collect discussion or lab sections
                if subjectCourse not in uniqueCourses and sequenceNumber == '001':
                    uniqueCourses.add(subjectCourse)
                    filteredData.append({'subjectCourse': subjectCourse, 'courseTitle': course['courseTitle'], 'reviews': []})
            pageOffset += 500   # Plus 500 because that's how many items are displayed per page/request
            coursesURL = 'https://registrationssb.ucr.edu/StudentRegistrationSsb/ssb/searchResults/searchResults?txt_course_number_range=0&txt_course_number_range_to=199&txt_term=' + term + '&pageOffset=' + str(pageOffset) + '&pageMaxSize=999&sortColumn=subjectDescription&sortDirection=asc'
            coursesJSON = s.get(coursesURL).json()
            courseData = coursesJSON['data']

    # # Sorts the courses alphabetically by subjectCourse value
    # filteredData.sort(key=lambda json: json['subjectCourse'])

    # Writes filteredData to json file
    with open('newCourses.json', 'w') as outfile:
        json.dump(filteredData, outfile)

if __name__ == "__main__":
    main()