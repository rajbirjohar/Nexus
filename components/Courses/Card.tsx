import Link from 'next/link'
import styles from './card.module.css'

export default function CourseCard({ courseName }) {
  return (
    <Link href={`/courses/${courseName}`} passHref>
      <div className={styles.card}>
        <h3 className={styles.title}>{courseName}</h3>
      </div>
    </Link>
  )
}
