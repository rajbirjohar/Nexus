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

export default function RecentReviewPostCard({
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
  return (
    <motion.div variants={listItems} className={cardstyles.reviewcard} layout>
      <motion.div layout="position" className={cardstyles.reviewheader}>
        <h3 className={cardstyles.coursetitle}>{course}</h3>
        <h3 className={cardstyles.difficulty}>{difficulty}</h3>
      </motion.div>
      <motion.div
        layout="position"
        animate={{ opacity: 1, x: 0 }}
        initial={{ opacity: 0, x: -5 }}
        exit={{ opacity: 0, x: 5 }}
        transition={{ duration: 0.15 }}
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
    </motion.div>
  )
}
