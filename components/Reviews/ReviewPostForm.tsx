import React, { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import Fetcher from '@/lib/fetcher'
import toast, { resolveValue } from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import useSlider from './Slider'
import styles from '@/styles/reviewposts.module.css'

const maxLength = 750

export default function ReviewPostForm({ name, email, course }) {
  const [slideValue, Slider, setSlide] = useSlider(
    1,
    10,
    5,
    'Difficulty:',
    'difficulty'
  )
  const [reviewPost, setReviewPost] = useState({
    reviewee: name,
    email: email,
    _reviewPost: '',
    _reviewProfessor: '',
    _course: course,
    _taken: '',
    _difficulty: 5,
    _anonymous: true,
  })
  // State for anonymous checkbox
  const [checked, setChecked] = useState(false)

  const handleSubmit = async (event) => {
    // don't redirect the page
    event.preventDefault()
    // check if any text fields are empty
    if (reviewPost._reviewPost === '' || reviewPost._reviewProfessor === '') {
      toast.error('Please fill out the missing fields.')
    } else {
      // calls sendData() to send our state data to our API
      sendData(reviewPost)
      // clears our inputs after submitting
      setReviewPost({
        ...reviewPost,
        _reviewPost: '',
        _reviewProfessor: '',
        _taken: '',
        _difficulty: 5,
        _anonymous: true,
      })
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
      {/* <label htmlFor="_course">
        <strong>Course:</strong>
      </label>
      <select
        aria-label="Course Select"
        name="_course"
        value={reviewPost._course}
        onChange={handleChange}
        placeholder="NXS100"
        className={styles.select}
      >
        {data && (
          <>
            {data.courses.map((course) => (
              <option id={course.id} value={course.name}>
                {course.name}
              </option>
            ))}
          </>
        )}
      </select> */}
      <label htmlFor="_reviewPost">
        <strong>Review:</strong>
      </label>
      <textarea
        aria-label="Review Post Input"
        name="_reviewPost"
        value={reviewPost._reviewPost}
        onChange={handleChange}
        placeholder='"I love this class!"'
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
        placeholder="Professor Johnny Appleseed"
        className={styles.input}
      />
      <label htmlFor="_taken">
        <strong>Taken:</strong>
      </label>
      <input
        aria-label="Taken Input"
        name="_taken"
        value={reviewPost._taken}
        onChange={handleChange}
        type="text"
        placeholder="Fall 2021"
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
