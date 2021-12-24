import React, { useState } from 'react'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import clientPromise from '@/lib/mongodb'
import Layout from '@/components/Layout'
import CourseCard from '@/components/Courses/CourseCard'
import NotFound from '@/components/notFound'
import styles from '@/styles/courses.module.css'
import cardstyles from '@/styles/card.module.css'
import formstyles from '@/styles/form.module.css'

export default function CoursesPage({ courses }) {
  const [searchValue, setSearchValue] = useState('')
  const filteroseCourses = Object(courses).filter((course) =>
    course.subjectCourse.toLowerCase().includes(searchValue.toLowerCase())
  )
  return (
    <Layout>
      <Head>
        <title>Nexus | Courses</title>
      </Head>
      <section>
        <div className={styles.hero}>
          <div className={styles.content}>
            <h1>Courses</h1>
            <p>
              Check out any course below. Each course will come with a list of
              reviews that other people have written from their experiences as a
              student. Feel free to write your own for future readers ✍️.
            </p>
          </div>
          <Image
            src={'/assets/teaching.svg'}
            width={300}
            height={300}
            alt="Professor teaching"
          />
        </div>
        <div className={formstyles.searchWrapper}>
          <input
            autoComplete="off"
            aria-label="Enabled Searchbar"
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder='Search courses ex. "SCOTTY101"'
            className={formstyles.search}
          />
          <svg className={formstyles.searchIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </svg>
        </div>
        {!filteroseCourses.length && (
          <>
            <NotFound placeholder="class" />
          </>
        )}
        <div className={cardstyles.gridshort}>
          {searchValue.length > 1 &&
            filteroseCourses.map((course) => (
              <CourseCard
                key={course._id}
                courseId={course._id}
                courseName={course.subjectCourse}
              />
            ))}
        </div>
        <h4>Go ahead and search for a course.</h4>

        <p>Scraped with hard work, enginuity, and a crazy script by Isaac.</p>
      </section>
    </Layout>
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
