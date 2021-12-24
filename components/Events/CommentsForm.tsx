import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import styles from '@/styles/form.module.css'

export default function CommentsForm({ eventId }) {
  const { data: session } = useSession()
  const [comment, setComment] = useState({
    eventId: eventId,
    authorId: session.user.id,
    author: session.user.name,
    email: session.user.email,
    _comment: '',
  })
  const handleSubmit = async (event) => {
    event.preventDefault()
    if (comment._comment === '') {
      toast.error('Please fill out the missing field')
    } else {
      sendData(comment)
      setComment({
        ...comment,
        _comment: '',
      })
    }
  }
  const handleChange = (event) => {
    setComment({
      ...comment,
      [event.target.name]: event.target.value,
    })
  }
  const sendData = async (commentData) => {
    const response = await fetch('/api/events/comments/commentcreate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ commentData: commentData }),
    })
    const data = await response.json()
    if (response.status === 200) {
      toast.success('Your comment has been posted!')
    } else {
      toast.error(
        'Uh oh. Something happened. Please contact us if this persists.'
      )
    }
    return data.commentData
  }
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label htmlFor="_comment">
        <strong>Comment:</strong>
      </label>
      <input
        autoComplete="off"
        aria-label="Comment Input"
        name="_comment"
        value={comment._comment}
        onChange={handleChange}
        type="text"
        placeholder="Show your interest!"
        className={styles.input}
      />
      <span className={styles.actions}>
        <button type="submit" className={styles.primary}>
          Post Comment!
        </button>
      </span>
    </form>
  )
}
