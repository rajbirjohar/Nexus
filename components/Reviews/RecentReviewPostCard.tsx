import Link from 'next/link'
import styles from './card.module.css'

export default function RecentReviewPostCard({
  creator,
  creatorEmail,
  creatorId,
  reviewPost,
  reviewProfessor,
  course,
  courseId,
  taken,
  difficulty,
  timestamp,
  anonymous,
  reviewPostId,
}) {
  return (
    <div className={styles.card}>
      <span className={styles.header}>
        <h3 className={styles.title}>{course}</h3>

        <h3 className={styles.difficulty}>{difficulty}</h3>
      </span>
      <div className={styles.review}>
        <strong>Review:</strong> <br />
        <div dangerouslySetInnerHTML={{ __html: `${reviewPost}` }} />
        <p>
          <strong>Professor:</strong> {reviewProfessor}
        </p>
        <p>
          <strong>Taken:</strong> {taken}
        </p>
        <p className={styles.author}>
          {anonymous === true ? <>Anonymous</> : <>{creator}</>} {timestamp}{' '}
        </p>
      </div>
    </div>
  )
}
