import React, { useState } from 'react'
import toast from 'react-hot-toast'
import useSlider from './Slider'
import styles from '@/styles/form.module.css'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'

// Max length for review
const maxLength = 750

// Component: ReviewPostForm({name, email, course})
// Params: name, email, course
// Purpose: To take in user inputted data and submit it to the database

export default function ReviewEditForm({
  reviewPostId,
  oldReviewPost,
  oldReviewProfessor,
  oldTaken,
  oldDifficulty,
  oldAnonymous,
  onHandleChange,
}) {
  // useSlider hook
  const [slideValue, Slider, setSlide] = useSlider(
    1,
    10,
    oldDifficulty,
    'Difficulty:',
    'difficulty'
  )

  // default values for reviewPost Object
  const { data: session } = useSession()
  const [reviewPost, setReviewPost] = useState({
    creatorId: session.user.id,
    reviewPostId: reviewPostId,
    _newReviewPost: oldReviewPost,
    _newReviewProfessor: oldReviewProfessor,
    _newTaken: oldTaken,
    _difficulty: oldDifficulty,
    _newAnonymous: oldAnonymous,
  })
  // State for anonymous checkbox
  const [checked, setChecked] = useState(oldAnonymous)

  const handleSubmit = async (event) => {
    // don't roseirect the page
    event.preventDefault()
    // Check if ALL old values have not changed
    if (
      reviewPost._newReviewPost === oldReviewPost &&
      reviewPost._newReviewProfessor === oldReviewProfessor &&
      reviewPost._newTaken === oldTaken &&
      reviewPost._difficulty === oldDifficulty &&
      reviewPost._newAnonymous === oldAnonymous
    ) {
      toast.error('No updates made.')
      // check if any text fields are empty
    } else if (
      reviewPost._newReviewPost === '' ||
      reviewPost._newReviewProfessor === '' ||
      reviewPost._newTaken === ''
    ) {
      toast.error('Please fill out the missing fields.')
    } else {
      // calls sendData() to send our state data to our API
      sendData(reviewPost)
      // Hide edit form
      !onHandleChange()
    }
  }

  const handleChange = (event) => {
    if (event.target.id === 'difficulty') {
      setSlide(event.target.value)
    }
    setReviewPost({
      ...reviewPost,
      _difficulty: slideValue,
      [event.target.name]: event.target.value,
    })
  }

  const handleCheckChange = () => {
    setChecked(!checked)

    setReviewPost({
      ...reviewPost,
      _newAnonymous: !checked,
    })
  }

  const sendData = async (newReviewPostData) => {
    const response = await fetch(`/api/reviewposts/reviewedit`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newReviewPostData: newReviewPostData }),
    })
    const data = await response.json()
    if (response.status === 200) {
      toast.success('Your review has been posted!')
    } else {
      toast.error(
        'Uh oh. Something happened. Please contact us if this persists.'
      )
    }
    return data.reviewPostData
  }
  return (
    <motion.form
      layout
      animate={{ opacity: 1, x: 0 }}
      initial={{ opacity: 0, x: -5 }}
      exit={{ opacity: 0, x: 5 }}
      transition={{ duration: 0.15 }}
      onSubmit={handleSubmit}
      className={styles.form}
    >
      <label htmlFor="_reviewPost">
        <strong>Review:</strong>
      </label>
      <textarea
        aria-label="Review Post Input"
        name="_newReviewPost"
        value={reviewPost._newReviewPost}
        onChange={handleChange}
        placeholder='"I love this class!"'
        className={styles.input}
        maxLength={maxLength}
      />
      <span className={styles.maxlength}>
        {maxLength - reviewPost._newReviewPost.length}/{maxLength}
      </span>
      <label htmlFor="_reviewProfessor">
        <strong>Professor:</strong>
      </label>
      <input
        autoComplete="off"
        aria-label="Review Professor Input"
        name="_newReviewProfessor"
        value={reviewPost._newReviewProfessor}
        onChange={handleChange}
        type="text"
        placeholder='"Professor Scotty"'
        className={styles.input}
      />
      <label htmlFor="_taken">
        <strong>Taken:</strong>
      </label>
      <input
        autoComplete="off"
        aria-label="Taken Input"
        name="_newTaken"
        value={reviewPost._newTaken}
        onChange={handleChange}
        type="text"
        placeholder='"Fall 2021"'
        className={styles.input}
      />
      {/* Pass handleChange() into Slider component */}
      <Slider onHandleChange={handleChange} />
      <span className={styles.checkedWrapper}>
        <label htmlFor="anonymous">
          <strong>Anonymous?</strong>
        </label>
        <input
          autoComplete="off"
          type="checkbox"
          id="anonymous"
          name="_newAnonymous"
          checked={checked}
          onChange={handleCheckChange}
        />
        <span className={styles.checkmark}></span>
      </span>
      <div className={styles.actions}>
        <button className={styles.primary} type="submit">
          Edit Review!
        </button>
      </div>
    </motion.form>
  )
}
