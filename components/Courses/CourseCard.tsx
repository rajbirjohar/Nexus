import Link from 'next/link'
import styles from '@/styles/courses.module.css'

// Component: CourseCard({courseId, courseName})
// Params: courseId, courseName
// Purpose: Display each course as an individual "card"
// courseId: the ID unique to the course used to
//  parse the courses collection for each course
// courseName: the name of the course displayed 
// on each card
// See ListCourses component

export default function CourseCard({ courseId, courseName }) {
  return (
    // Link is used to route each card to a dynamic page
    // listing all course review posts for that specific
    // course
    <Link href={`/courses/${courseName}`} passHref>
      <div id={courseId} className={styles.card}>
        <p className={styles.course}>{courseName}</p>
      </div>
    </Link>
  )
}