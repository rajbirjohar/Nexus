import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import styles from '@/styles/posts.module.css'

export default function ReviewPostCard({
  reviewee,
  reviewPost,
  reviewProfessor,
  course,
  difficulty,
  timestamp,
  reviewPostId,
}) {
  const { data: session, status } = useSession()

  // Render delete button only if the
  // session user equals the name of the entry
  let match = false
  if (session) {
    if (session.user.name === reviewee) {
      match = true
    }
  }

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
          <strong>Author:</strong> {reviewee} about {timestamp}
        </span>
      </p>
    </div>
  )
}
