import Link from 'next/link'
import styles from '@/styles/courses.module.css'
import { motion } from 'framer-motion'

const item = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
}

export default function CourseCard({ courseId, courseName }) {
  return (
    <Link href={`/courses/${courseName}`} passHref>
      <motion.div variants={item} id={courseId} className={styles.card}>
        <p className={styles.course}>{courseName}</p>
      </motion.div>
    </Link>
  )
}
