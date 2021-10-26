import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import styles from '@/styles/reviewposts.module.css'

export default function ReviewPostCard({
  reviewee,
  reviewPost,
  reviewProfessor,
  course,
  difficulty,
  timestamp,
  anonymous,
  reviewPostId,
}) {
  const { data: session, status } = useSession()

  return (
    <div>
      <p>
        <strong>Course: {course}</strong>
        <br />
        <strong>Review:</strong> {reviewPost}
        <br />
        <strong>Professor:</strong> {reviewProfessor}
        <br />
        <strong>Difficulty: {difficulty}</strong>
        <br />
        <span className={styles.author}>
          <strong>Author: </strong>
          {anonymous === true ? <>Anonymous</> : <>{reviewee}</>} about{' '}
          {timestamp}
        </span>
        <br />
        {session && session.user.name === reviewee && (
          <>
            <button className={styles.modify}>Modify</button>
            <button className={styles.delete}>Delete</button>
          </>
        )}
      </p>
    </div>
  )
}
