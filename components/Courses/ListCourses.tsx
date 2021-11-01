import Link from 'next/link'
import useSWR from 'swr'
import Fetcher from '@/lib/fetcher'
import styles from '@/styles/courses.module.css'
import CourseCard from './CourseCard'

const Skeleton = () => {
  return (
    <div className={styles.card}>
      <p className={styles.dummydescription}></p>
      <p className={styles.dummydescription}></p>
      <p className={styles.dummydescription}></p>
      <span className={styles.dummyauthor}>
        <p className={styles.dummytitle}></p>
      </span>
    </div>
  )
}

export default function ListCourses() {
  const { data, error } = useSWR('/api/courses/coursefetch', Fetcher)
  if (error) {
    return (
      <p>
        Oops. Looks like the courses collection is not being fetched right now.
        If this persists, please let me know.
      </p>
    )
  }
  if (!data) {
    return (
      <>
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </>
    )
  }
  return (
    <div className={styles.courseGrid}>
      {data.courses.map((course) => (
        <CourseCard
          key={course._id}
          courseId={course._id}
          courseName={course.name}
        />
      ))}
    </div>
  )
}
