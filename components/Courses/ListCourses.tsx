import useSWR from 'swr'
import Fetcher from '@/lib/fetcher'
import CourseCard from './CourseCard'
import Loader from '@/components/Skeleton'
import styles from '@/styles/courses.module.css'

export default function ListCourses() {
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
