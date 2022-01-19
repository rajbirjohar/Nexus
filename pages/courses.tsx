import React, { useState } from 'react'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import clientPromise from '@/lib/mongodb'
import Layout from '@/components/Layout'
import { LottieWrapper } from '@/components/LottieWrapper'
import CourseCard from '@/components/Courses/CourseCard'
import NotFound from '@/components/notFound'
import { GreenTip } from '@/components/Tips'
import styles from '@/styles/courses.module.css'
import cardstyles from '@/styles/card.module.css'
import formstyles from '@/styles/form.module.css'
import { motion } from 'framer-motion'
import animationData from '@/lotties/studentonbooks.json'
import ListMostRecent from '@/components/Reviews/ListMostRecent'

const list = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

export default function CoursesPage({ courses }) {
  const [searchValue, setSearchValue] = useState('')
  const filteredCourses = Object(courses).filter((course) =>
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
            <div className={styles.text}>
              <h1>Courses</h1>
              <p>
                Each course will come with a list of reviews that other people
                have written from their experiences as a student.
              </p>
              <GreenTip header="Write A Review">
                Your contribution will help thousands of potential students who
                are looking into taking a course you took. Write a review and
                share your experience!
              </GreenTip>
            </div>
            <div className={styles.animationWrapper}>
              <LottieWrapper animationData={animationData} />
            </div>
          </div>
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
        {!searchValue.length && (
          <>
            <h4>Check out the newest reviews.</h4>
            <ListMostRecent />
          </>
        )}
        {!filteredCourses.length && (
          <>
            <NotFound placeholder="class" />
          </>
        )}
        <motion.div
          variants={list}
          initial="hidden"
          animate="show"
          className={cardstyles.gridshort}
        >
          {searchValue.length > 1 &&
            filteredCourses.map((course) => (
              <CourseCard
                key={course._id}
                courseId={course._id}
                courseName={course.subjectCourse}
              />
            ))}
        </motion.div>
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
