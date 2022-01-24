import { useSession } from 'next-auth/react'
import React, { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import cardstyles from '@/styles/card.module.css'
import formstyles from '@/styles/form.module.css'
import CommentEditForm from './CommentEditForm'
import { motion, AnimatePresence } from 'framer-motion'

const listItems = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
}

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
      <div>
        {isEdit ? (
          <CommentEditForm
            eventId={eventId}
            oldComment={comment}
            onHandleChange={setIsEdit}
            commentId={commentId}
            authorId={authorId}
          />
        ) : (
          <motion.p
            layout="position"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {comment}
          </motion.p>
        )}
        <span className={cardstyles.author}>
          {author} {date}
        </span>{' '}
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
      </div>
    </div>
  )
}

export default Comment
