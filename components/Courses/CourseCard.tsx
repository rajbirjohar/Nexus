import Link from 'next/link'
import { motion } from 'framer-motion'
import styles from '@/styles/card.module.css'

// Component: CourseCard({courseId, courseName})
// Params: courseId, courseName
// Purpose: Display each course as an individual "card"
// courseId: the ID unique to the course used to
//  parse the courses collection for each course
// courseName: the name of the course displayed
// on each card
// See ListCourses component

const card = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
}

export default function CourseCard({ courseId, courseName }) {
  return (
    // Link is used to route each card to a dynamic page
    // listing all course review posts for that specific
    // course
    <Link href={`/courses/${courseName}`} passHref>
      <motion.div variants={card} id={courseId} className={styles.coursecard}>
        <h3 className={styles.course}>{courseName}</h3>
      </motion.div>
    </Link>
  )
}
