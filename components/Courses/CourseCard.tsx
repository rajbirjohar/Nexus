import Link from 'next/link'
import cardstyles from '@/styles/card.module.css'
import { AnimatePresence, motion } from 'framer-motion'

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
      <motion.div
        id={courseId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          ease: 'easeOut',
          duration: 0.25,
        }}
        className={cardstyles.card}
        layout
      >
        <h3 className={cardstyles.course}>{courseName}</h3>
      </motion.div>
    </Link>
  )
}
