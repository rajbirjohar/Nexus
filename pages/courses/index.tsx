import React, { useState } from 'react'
import { GetStaticProps } from 'next'
import clientPromise from '@/lib/mongodb'
import Page from '@/components/Layout/Page'
import { LottieWrapper } from '@/components/LottieWrapper'
import CourseCard from '@/components/Courses/Card'
import NotFound from '@/components/notFound'
import { GreenTip } from '@/components/Layout/Tips'
import styles from '@/styles/courses.module.css'
import cardstyles from '@/styles/card.module.css'
import formstyles from '@/styles/form.module.css'
import animationData from '@/lotties/studentonbooks.json'
import ListRecentReviews from '@/components/Reviews/ListRecentReviews'
import { SearchIcon } from '@/components/Icons'

export default function CoursesPage({ courses }) {
  const [searchValue, setSearchValue] = useState('')
  const filteredCourses = Object(courses).filter((course) =>
    course.subjectCourse.toLowerCase().includes(searchValue.toLowerCase())
  )
  return (
    <Page
      title="Courses"
      tip={
        <GreenTip header="Write A Review">
          Your contribution will help thousands of potential students who are
          looking into taking a course you took. Write a review and share your
          experience!
        </GreenTip>
      }
    >
      <div className={styles.hero}>
        <div className={styles.content}>
          <div className={styles.text}>
            <h1>Courses</h1>
            <p>
              Each course will come with a list of reviews that other people
              have written from their experiences as a student.
            </p>
          </div>
          <div className={styles.animationWrapper}>
            <LottieWrapper animationData={animationData} />
          </div>
        </div>
      </div>
      <div className={formstyles.searchwrapper}>
        <input
          autoComplete="off"
          aria-label="Enabled Searchbar"
          type="text"
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder='Search courses ex. "SCOTTY101"'
          className={formstyles.search}
        />
        <SearchIcon />
      </div>
      {!searchValue.length && (
        <>
          <h4>Check out the newest reviews.</h4>
          <ListRecentReviews />
        </>
      )}
      {!filteredCourses.length && (
        <>
          <NotFound placeholder="class" />
        </>
      )}
      <div className={cardstyles.gridshort}>
        {searchValue.length > 1 &&
          filteredCourses.map((course) => (
            <CourseCard key={course._id} courseName={course.subjectCourse} />
          ))}
      </div>
      <h4>Go ahead and search for a course.</h4>
      <p>Scraped with hard work, enginuity, and a crazy script by Isaac.</p>
    </Page>
  )
}
// We use getStaticProps here so we are able to generate all the data
// before build time and serve it to the client instantaneously
// which is then cached by the server
export const getStaticProps: GetStaticProps = async (context) => {
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)

  const courses = await db
    .collection('allCourses')
    .find({})
    .sort({ subjectCourse: 1 })
    .toArray()

  return {
    props: {
      courses: JSON.parse(JSON.stringify(courses)),
    },
  }
}
