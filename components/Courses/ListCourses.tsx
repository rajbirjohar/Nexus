import React, { useState } from 'react'
import useSWR from 'swr'
import Fetcher from '@/lib/fetcher'
import CourseCard from './CourseCard'
import Loader from '@/components/Skeleton'
import styles from '@/styles/courses.module.css'

export default function ListCourses() {
  const [searchValue, setSearchValue] = useState('')
  const { data, error } = useSWR('/api/courses/coursefetch', Fetcher)
  if (error) {
    return (
      <p>
        Oops. Looks like the courses are not being fetched right now. If this
        persists, please let us know.
      </p>
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
    course.name.toLowerCase().includes(searchValue.toLowerCase())
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
        <p>
          What!? That&#39;s crazy. It seems this class does not yet exist.
          Contact us if you would like to see this class added.
        </p>
      )}
      <div className={styles.courseGrid}>
        {/* {data.courses.map((course) => (
          <CourseCard
            key={course._id}
            courseId={course._id}
            courseName={course.name}
          />
        ))} */}
        {filteredCourses.map((course) => (
          <CourseCard
            key={course._id}
            courseId={course._id}
            courseName={course.name}
          />
        ))}
      </div>
    </>
  )
}
