import React from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import styles from '@/styles/reviewposts.module.css'

// Component: ReviewPostCard({
// reviewee,
// reviewPost,
// reviewProfessor,
// course,
// taken,
// difficulty,
// timestamp,
// anonymous,
// reviewPostId,
// })
// Purpose: To display all data within a single review as a card

export default function ReviewPostCard({
  reviewee,
  reviewPost,
  reviewProfessor,
  course,
  taken,
  difficulty,
  timestamp,
  anonymous,
  reviewPostId,
}) {
  const { data: session } = useSession()

  const deleteReviewPost = async (event) => {
    if (session) {
      const res = await fetch('/api/reviewposts/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewPostData: course, reviewPostId }),
      })
      await res.json()
      if (res.status === 200) {
        toast.success('Deleted review.')
      } else {
        toast.error('Uh oh. Something went wrong.')
      }
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.title}>
        <p className={styles.course}>{course}</p>
        <p className={styles.difficulty}>{difficulty}</p>
      </div>
      <h4 className={styles.review}>Review:</h4>
      <i className={styles.reviewPost}>&quot;{reviewPost}&quot;</i>
      <h4 className={styles.professor}>Professor: {reviewProfessor}</h4>
      <span className={styles.taken}>
        <strong>Taken: {taken}</strong>
      </span>
      <br />
      <span className={styles.author}>
        <strong>Author: </strong>
        {anonymous === true ? <>Anonymous</> : <>{reviewee}</>} about{' '}
        {timestamp}
      </span>
      <br />
      {session && session.user.name === reviewee && (
        <>
          {/* <button className={styles.modify}>Modify</button> */}
          <button onClick={deleteReviewPost} className={styles.delete}>
            Delete
          </button>
        </>
      )}
    </div>
  )
}
