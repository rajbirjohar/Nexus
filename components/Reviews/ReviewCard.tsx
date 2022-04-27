import React, { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import styles from './card.module.css'
import formstyles from '@/styles/form.module.css'
import ReviewEditForm from './ReviewEditForm'
import { AnimatePresence, motion } from 'framer-motion'
import { EditIcon, TrashIcon } from '../Icons'
import { format } from 'date-fns'

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

export default function ReviewCard({
  author,
  authorId,
  review,
  professor,
  course,
  taken,
  difficulty,
  timestamp,
  anonymous,
  reviewId,
}: Review) {
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
      deleteReview()
    } else {
      setIsDelete(true)
    }
  }
  async function deleteReview() {
    const response = await fetch('/api/reviews', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reviewData: reviewId }),
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
            reviewId={reviewId}
            review={review}
            professor={professor}
            taken={taken}
            difficulty={difficulty}
            anonymous={anonymous}
            setIsEdit={setIsEdit}
            isEdit={isEdit}
          />
        ) : (
          <div className={styles.review}>
            <strong>Review:</strong> <br />
            <div dangerouslySetInnerHTML={{ __html: `${review}` }} />
            {professor && (
              <p>
                <strong>Professor:</strong> {professor}
              </p>
            )}
            {taken && (
              <p>
                <strong>Taken:</strong> {taken}
              </p>
            )}
            <p className={styles.author}>
              {' '}
              {anonymous === true ? <>Anonymous</> : <>{author}</>}
              <br />
              {format(new Date(timestamp), 'MM/dd/yyyy h:mm bbb')}{' '}
            </p>
          </div>
        )}
      </AnimatePresence>
      {session && session.user.id === authorId && (
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
