import React, { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import cardstyles from '@/styles/card.module.css'
import formstyles from '@/styles/form.module.css'
import ReviewEditForm from './ReviewEditForm'
import { AnimatePresence, motion } from 'framer-motion'
import { EditIcon, TrashIcon } from '../Icons'

const cardAnim = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
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
    <div className={cardstyles.reviewcard}>
      <div className={cardstyles.reviewheader}>
        <h3 className={cardstyles.coursetitle}>{course}</h3>
        <h3 className={cardstyles.difficulty}>{difficulty}</h3>
      </div>
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
        <div>
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
        </div>
      )}
      {session && session.user.id === creatorId && (
        <span className={formstyles.actions}>
          <button
            onClick={confirmDelete}
            className={formstyles.deleteicon}
            ref={wrapperRef}
          >
            <TrashIcon />
            {isDelete && <span>Confirm</span>}
          </button>

          <button
            onClick={() => {
              setIsEdit(!isEdit)
            }}
            className={formstyles.editicon}
          >
            <EditIcon />
          </button>
        </span>
      )}
    </div>
  )
}
