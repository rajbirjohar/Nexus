import { useSession } from 'next-auth/react'
import React, { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import styles from './comment.module.css'
import CommentEditForm from './CommentEditForm'
import { EditIcon, TrashIcon } from '../../Icons'

const Comment = ({
  organizationId,
  eventId,
  commentId,
  comment,
  authorId,
  author,
  date,
}) => {
  const { data: session } = useSession()
  const [isEdit, setIsEdit] = useState(false)
  const isCreator =
    session &&
    session.user.creatorOfOrg &&
    session.user.creatorOfOrg.includes(organizationId)
  const isAdmin =
    isCreator ||
    (session &&
      session.user.adminOfOrg &&
      session.user.adminOfOrg.includes(organizationId))
  const deleteComment = { commentId, eventId }
  const handleSubmit = (event) => {
    event.preventDefault()
    sendData(deleteComment)
  }
  const sendData = async (commentData) => {
    const response = await fetch('/api/events/comments/commentdelete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ commentData: commentData }),
    })
    await response.json
    if (response.status === 200) {
      toast.success('Deleted comment.')
    } else {
      toast.error(
        'Uh oh, something went wrong. If this persists, please let us know.'
      )
    }
  }
  return (
    <div className={styles.comment}>
      <p className={styles.header}>
        <span className={styles.author}>{author}</span>{' '}
        <span className={styles.date}>{date}</span>
      </p>

      {isEdit ? (
        <CommentEditForm
          eventId={eventId}
          oldComment={comment}
          onHandleChange={setIsEdit}
          commentId={commentId}
          authorId={authorId}
        />
      ) : (
        <p>{comment}</p>
      )}
      <div className={styles.actions}>
        {((session && isAdmin) ||
          (session && session.user.id === authorId)) && (
          <button onClick={handleSubmit} className={styles.delete}>
            <TrashIcon />
          </button>
        )}
        {session && session.user.id === authorId && (
          <button
            onClick={() => {
              setIsEdit(!isEdit)
            }}
            className={styles.edit}
          >
            <EditIcon />
          </button>
        )}
      </div>
    </div>
  )
}

export default Comment
