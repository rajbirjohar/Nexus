import React, { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import styles from './card.module.css'
import formstyles from '@/styles/form.module.css'
import ReviewEditForm from './ReviewEditForm'
import { AnimatePresence, motion } from 'framer-motion'
import { EditIcon, TrashIcon } from '../Icons'

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
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{course}</h3>
        <h3 className={styles.difficulty}>{difficulty}</h3>
      </div>
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
              {' '}
              {anonymous === true ? <>Anonymous</> : <>{creator}</>} {timestamp}
            </p>
          </div>
        )}
      </AnimatePresence>
      {session && session.user.id === creatorId && (
        <div className={formstyles.actions}>
          <button
            onClick={confirmDelete}
            className={formstyles.delete}
            ref={wrapperRef}
          >
            <TrashIcon />
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
          </button>

          <button
            onClick={() => {
              setIsEdit(!isEdit)
            }}
            className={formstyles.edit}
          >
            <EditIcon />
          </button>
        </div>
      )}
    </div>
  )
}
