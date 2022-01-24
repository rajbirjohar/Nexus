import React, { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import cardstyles from '@/styles/card.module.css'
import formstyles from '@/styles/form.module.css'
import { motion, AnimatePresence } from 'framer-motion'
import ReviewEditForm from './ReviewEditForm'

const listItems = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
}

const deleteTextWrapper = {
  closed: {
    width: '0',
    transition: {
      when: 'afterChildren',
    },
  },
  open: {
    width: 'auto',
  },
}

const deleteText = {
  closed: {
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
  open: {
    opacity: 1,
    transition: {
      delay: 0.15,
    },
  },
}

export default function ReviewPostCard({
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
  const { data: session } = useSession()
  const [isEdit, setIsEdit] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const wrapperRef = useRef(null)
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false)
    return () => {
      document.removeEventListener('click', handleClickOutside, false)
    }
  }, [])
  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setIsDelete(false)
    }
  }
  const confirmDelete = (event) => {
    if (isDelete === true) {
      deleteReviewPost()
    } else {
      setIsDelete(true)
    }
  }
  async function deleteReviewPost() {
    const response = await fetch(`/api/reviewposts/reviewdelete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reviewPostData: courseId, reviewPostId }),
    })
    await response.json()
    if (response.status === 200) {
      toast.success('Deleted review.')
    } else {
      toast.error(
        'Uh oh. Something went wrong. If this persists, please let us know.'
      )
    }
  }

  return (
    <motion.div variants={listItems} className={cardstyles.reviewcard} layout>
      <motion.div layout="position" className={cardstyles.reviewheader}>
        <h3 className={cardstyles.coursetitle}>{course}</h3>
        <h3 className={cardstyles.difficulty}>{difficulty}</h3>
      </motion.div>
      <AnimatePresence exitBeforeEnter>
        {isEdit ? (
          <ReviewEditForm
            reviewPostId={reviewPostId}
            oldReviewPost={reviewPost}
            oldReviewProfessor={reviewProfessor}
            oldTaken={taken}
            oldDifficulty={difficulty}
            oldAnonymous={anonymous}
            onHandleChange={setIsEdit}
          />
        ) : (
          <motion.div
            layout="position"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, type: 'tween' }}
          >
            <p>
              <strong>Review:</strong> <br />
              <i>&quot;{reviewPost}&quot;</i>
            </p>
            <p>
              <strong>Professor:</strong> {reviewProfessor}
            </p>
            <p>
              <strong>Taken:</strong> {taken}
            </p>
            <p className={cardstyles.author}>
              <strong>Author: </strong>
              {anonymous === true ? <>Anonymous</> : <>{creator}</>} about{' '}
              {timestamp}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      {session && session.user.id === creatorId && (
        <motion.span layout className={formstyles.actions}>
          <motion.button
            onClick={confirmDelete}
            className={formstyles.deleteicon}
            ref={wrapperRef}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <AnimatePresence exitBeforeEnter>
              {isDelete && (
                <motion.span
                  variants={deleteTextWrapper}
                  animate={isDelete ? 'open' : 'closed'}
                  initial="closed"
                  exit="closed"
                >
                  <motion.span variants={deleteText}>Confirm</motion.span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <button
            onClick={() => {
              setIsEdit(!isEdit)
            }}
            className={formstyles.editicon}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        </motion.span>
      )}
    </motion.div>
  )
}
