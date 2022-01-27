import { useSession } from 'next-auth/react'
import React, { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import cardstyles from '@/styles/card.module.css'
import formstyles from '@/styles/form.module.css'
import CommentEditForm from './CommentEditForm'
import { AnimatePresence, motion } from 'framer-motion'

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
    <div className={cardstyles.comment}>
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
      <span className={cardstyles.author}>
        {author} {date}
        {session && session.user.id === authorId && (
          <>
            {' '}
            /{' '}
            <span
              onClick={() => {
                setIsEdit(!isEdit)
              }}
              className={formstyles.editcomment}
            >
              Edit
            </span>{' '}
          </>
        )}
        {((session && isAdmin) ||
          (session && session.user.id === authorId)) && (
          <>
            {' '}
            /{' '}
            <span onClick={handleSubmit} className={formstyles.deletecomment}>
              Delete
            </span>
          </>
        )}
      </span>
    </div>
  )
}

export default Comment
