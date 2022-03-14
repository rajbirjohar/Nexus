import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import styles from './comment.module.css'
import CommentEditForm from './CommentEditForm'
import { EditIcon, TrashIcon } from '../../Icons'
import Dropdown from '@/components/Layout/Dropdown'
import { format } from 'date-fns'

const Comment = ({
  eventId,
  commentId,
  comment,
  authorId,
  author,
  date,
  isAdmin,
}) => {
  const { data: session } = useSession()
  const [isEdit, setIsEdit] = useState(false)

  const deleteComment = { commentId, eventId }
  const handleSubmit = (event) => {
    event.preventDefault()
    sendData(deleteComment)
  }
  const sendData = async (commentData) => {
    const response = await fetch(`/api/events/${eventId}/comments`, {
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
        <span>
          <span className={styles.author}>{author}</span>{' '}
          <time className={styles.date}>
            {format(new Date(date), "'at' h:mm bbb")}
          </time>
        </span>
        {((session && isAdmin) ||
          (session && session.user.id === authorId)) && (
          <Dropdown>
            <>
              {session && session.user.id === authorId && (
                <button
                  onClick={() => {
                    setIsEdit(!isEdit)
                  }}
                  className={styles.edit}
                >
                  <EditIcon /> Edit
                </button>
              )}
              {((session && isAdmin) ||
                (session && session.user.id === authorId)) && (
                <button onClick={handleSubmit} className={styles.delete}>
                  <TrashIcon /> Delete
                </button>
              )}
            </>
          </Dropdown>
        )}
      </p>

      {isEdit ? (
        <CommentEditForm
          eventId={eventId}
          comment={comment}
          authorId={authorId}
          setIsEdit={setIsEdit}
          isEdit={isEdit}
          commentId={commentId}
        />
      ) : (
        <p className={styles.content}>{comment}</p>
      )}
    </div>
  )
}

export default Comment
