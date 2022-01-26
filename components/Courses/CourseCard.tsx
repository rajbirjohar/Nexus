import Link from 'next/link'
import cardstyles from '@/styles/card.module.css'

export default function CourseCard({ courseId, courseName }) {
  return (
    <Link href={`/courses/${courseName}`} passHref>
      <div className={cardstyles.coursecard}>
        <h3 className={cardstyles.course}>{courseName}</h3>
      </div>
    </Link>
  )
}
