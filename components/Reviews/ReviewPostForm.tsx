import React, { useEffect, useRef, useState } from 'react'
import toast, { resolveValue } from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import useSlider from './Slider'
import styles from '@/styles/posts.module.css'

const maxLength = 500

export default function ReviewPostForm(props) {
  const { data: session } = useSession()
  const [slideValue, Slider, setSlide] = useSlider(
    1,
    10,
    5,
    'Difficulty:',
    'difficulty'
  )
  const [reviewPost, setReviewPost] = useState({
    reviewee: session.user.name,
    email: session.user.email,
    _reviewPost: '',
    _reviewProfessor: '',
    _course: '',
    _difficulty: 5,
    _anonymous: true,
  })
  // State for anonymous checkbox
  const [checked, setChecked] = useState(false)

  const handleSubmit = async (event) => {
    // don't redirect the page
    event.preventDefault()
    // check if any text fields are empty
    if (
      reviewPost._reviewPost === '' ||
      reviewPost._reviewProfessor === '' ||
      reviewPost._course === ''
    ) {
      toast.error('Please fill out the missing fields.')
    } else {
      // calls sendData() to send our state data to our API
      sendData(reviewPost)
      // clears our inputs after submitting
      setReviewPost({
        ...reviewPost,
        _reviewPost: '',
        _reviewProfessor: '',
        _course: '',
        _difficulty: 5,
        _anonymous: true,
      })
    }
  }

  const handleChange = (event) => {
    console.log(`handleChange val: ${slideValue}`)
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
      _anonymous: checked,
    })
  }

  const sendData = async (reviewPostData) => {
    console.log(reviewPostData)
    const response = await fetch('/api/reviewposts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reviewPostData: reviewPostData }),
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
    <form onSubmit={handleSubmit} className={styles.inputWrapper}>
      <label htmlFor="_course">
        <strong>Course:</strong>
      </label>
      <input
        aria-label="Course Input"
        name="_course"
        value={reviewPost._course}
        onChange={handleChange}
        type="text"
        placeholder="What course is this?"
        className={styles.input}
      />
      <label htmlFor="_reviewPost">
        <strong>Review:</strong>
      </label>
      <textarea
        aria-label="Review Post Input"
        name="_reviewPost"
        value={reviewPost._reviewPost}
        onChange={handleChange}
        placeholder="What is your review?"
        className={styles.input}
        maxLength={maxLength}
      />
      <div>
        {maxLength - reviewPost._reviewPost.length}/{maxLength}
      </div>
      <label htmlFor="_reviewProfessor">
        <strong>Professor:</strong>
      </label>
      <input
        aria-label="Review Professor Input"
        name="_reviewProfessor"
        value={reviewPost._reviewProfessor}
        onChange={handleChange}
        type="text"
        placeholder="Who taught this course?"
        className={styles.input}
      />
      {/* Pass handleChange() into Slider component */}
      <Slider onHandleChange={handleChange} />
      <span className={styles.checkedWrapper}>
        <label htmlFor="anonymous">
          <strong>Anonymous?</strong>
        </label>
        <input
          type="checkbox"
          id="anonymous"
          name="_anonymous"
          checked={!checked}
          onChange={handleCheckChange}
        />
        <span className={styles.checkmark}></span>
      </span>
      <button className={styles.signbutton} type="submit">
        Post Review!
      </button>
    </form>
  )
}
