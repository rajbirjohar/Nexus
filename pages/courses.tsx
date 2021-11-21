import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import clientPromise from '@/lib/mongodb'
import Layout from '@/components/Layout'
import styles from '@/styles/courses.module.css'
import cardstyles from '@/styles/card.module.css'
import { GetStaticProps } from 'next'
import CourseCard from '@/components/Courses/CourseCard'

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
            <h1>Courses</h1>
            <p>
              Check out any course below. Each course will come with a list of
              reviews that other people have written from their experiences as a
              student. Feel free to write your own for future readers.
            </p>
          </div>
          <Image
            src={'/assets/teaching.svg'}
            width={300}
            height={300}
            alt="Professor teaching"
          />
        </div>
        <div className={styles.searchWrapper}>
          <input
            aria-label="Enabled Searchbar"
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search courses"
            className={styles.search}
          />
          <svg className={styles.searchIcon}>
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
        {!filteredCourses.length && (
          <div className={styles.notFound}>
            <h3>Woah There.</h3>
            <p>
              What!? That&#39;s crazy. It seems this class does not yet exist.
              Contact us if you would like to see this class added.
            </p>
            <Image
              src={'/assets/void.svg'}
              width={300}
              height={300}
              alt="Nothing Found Image"
            />
          </div>
        )}
        <div className={cardstyles.courseGrid}>
          {filteredCourses.map((course) => (
            <CourseCard
              key={course._id}
              courseId={course._id}
              courseName={course.subjectCourse}
            />
          ))}
        </div>
        <h4>You reached the end.</h4>
        <p>
          Seems like these are all the classes we have so far. Scraped with hard
          work and enginuity by Isaac.
        </p>
      </section>
    </Layout>
  )
}

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
