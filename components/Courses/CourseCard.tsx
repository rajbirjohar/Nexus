import Link from 'next/link'
import styles from '@/styles/courses.module.css'

export default function CourseCard({ courseId, courseName }) {
  return (
    <Link href={`/courses/${courseName}`} passHref>
      <div id={courseId} className={styles.card}>
        <p className={styles.course}>{courseName}</p>
      </div>
    </Link>
  )
}
