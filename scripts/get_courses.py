# Version 2 of this script so now it collects all unique courses over the previous 5 terms
# Currently it collects 3000+ courses so next version will work on filtering out grad courses and only those with 4+ unit count
# Also need to be able to get courseTitle again

import requests
import json

termsURL = 'https://registrationssb.ucr.edu/StudentRegistrationSsb/ssb/classSearch/getTerms?searchTerm=&offset=1&max=5'
termsJSON = requests.get(termsURL).json()

termCodes = []
for termObj in termsJSON:
    termCodes.append(termObj['code'])

uniqueCourses = set()
filteredData = []

for term in termCodes:
    print('Term: ', term)
    coursesURL = 'https://registrationssb.ucr.edu/StudentRegistrationSsb/ssb/classSearch/get_subjectcoursecombo?searchTerm=&term=' + term + '&offset=1&max=9999'
    coursesJSON = requests.get(coursesURL).json()

    for course in coursesJSON:
        subjectCourse = course['code']
        if subjectCourse not in uniqueCourses:
            uniqueCourses.add(subjectCourse)
            # Get course desc and removes first word which is the course code (i.e. subjectCourse)
            courseDesc = course['description'].split(' ', 1)[1]
            filteredData.append({"subjectCourse": subjectCourse, "courseDesc": courseDesc, "reviews": []})

# Sorts the courses alphabetically by subjectCourse value
filteredData.sort(key=lambda json: json['subjectCourse'])

# Writes filteredData to json file
with open('newScriptCourses.json', 'w') as outfile:
    json.dump(filteredData, outfile)

print(len(uniqueCourses))
