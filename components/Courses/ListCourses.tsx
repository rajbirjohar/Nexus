import React, { useState } from 'react'
import Image from 'next/image'
import useSWR from 'swr'
import { motion } from 'framer-motion'
import Fetcher from '@/lib/fetcher'
import CourseCard from './CourseCard'
import Loader from '@/components/Skeleton'
import styles from '@/styles/courses.module.css'
import cardstyles from '@/styles/card.module.css'

// Component: ListCourses()
// Params: None
// Purpose: Display all CourseCard({courseId, courseName})
// components via mapping from useSWR hook at coursefetch api

const cardlist = {
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      delay: 0,

      ease: 'easeInOut',
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      when: 'afterChildren',
    },
  },
}

export default function ListCourses() {
  const [searchValue, setSearchValue] = useState('')
  const { data, error } = useSWR('/api/courses/coursefetch', Fetcher)
  if (error) {
    return (
      <div className={styles.serverdown}>
        <p>
          Oops. Looks like the courses are not being fetched right now. If this
          persists, please let us know.
        </p>
        <Image
          src={'/assets/server.svg'}
          height={500}
          width={500}
          alt="Server Down Image"
        />
      </div>
    )
  }
  if (!data) {
    return <Loader />
  }
  // Order matters here because it has to go through
  // Checking for errors in fetching the data then
  // if the data is loading then finally loading the data
  // into the array filteredCourses where we do a local search/sort
  const filteredCourses = Object(data.courses).filter((course) =>
    course.subjectCourse.toLowerCase().includes(searchValue.toLowerCase())
  )
  return (
    <>
      <div className={styles.searchWrapper}>
        <input
          aria-label="Enabled Searchbar"
          type="text"
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search courses"
          className={styles.search}
        />
        {/* <svg className={styles.searchIcon}>
          <SearchIcon />
        </svg> */}
      </div>
      {!filteredCourses.length && (
        <div className={styles.notFound}>
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
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardlist}
        className={cardstyles.courseGrid}
      >
        {filteredCourses.map((course) => (
          <CourseCard
            key={course._id}
            courseId={course._id}
            courseName={course.subjectCourse}
          />
        ))}
      </motion.div>
    </>
  )
}
