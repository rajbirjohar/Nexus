import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import useSlider from './Slider'
import styles from '@/styles/form.module.css'
import { useSession } from 'next-auth/react'

// Max length for review
const maxLength = 750

interface ReviewPost {
  creatorId: string
  creator: string
  creatorEmail: string
  _reviewPost: string
  _reviewProfessor: string
  _course: string
  _courseId: string
  _taken: string
  _difficulty: number
  _anonymous: boolean
}

export default function ReviewPostForm({ course, courseId }) {
  // useSlider hook
  const [slideValue, Slider, setSlide] = useSlider(1, 10, 5)
  const { data: session } = useSession()
  const initialValues: ReviewPost = {
    creatorId: session.user.id,
    creator: session.user.name,
    creatorEmail: session.user.email,
    _reviewPost: '',
    _reviewProfessor: '',
    _course: course,
    _courseId: courseId,
    _taken: '',
    _difficulty: slideValue,
    _anonymous: true,
  }

  const sendData = async (reviewPostData) => {
    const response = await fetch(`/api/reviewposts/reviewcreate`, {
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
    <Formik
      validateOnBlur={false}
      initialValues={initialValues}
      validate={(values: ReviewPost) => {
        let errors: FormikErrors<ReviewPost> = {}
        if (!values._reviewPost) {
          errors._reviewPost = 'Required'
        }
        if (!values._reviewProfessor) {
          errors._reviewProfessor = 'Required'
        }
        if (!values._taken) {
          errors._taken = 'Required'
        }
        return errors
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        sendData(values)
        resetForm({
          values: {
            creatorId: session.user.id,
            creator: session.user.name,
            creatorEmail: session.user.email,
            _reviewPost: '',
            _reviewProfessor: '',
            _course: course,
            _courseId: courseId,
            _taken: '',
            _difficulty: slideValue,
            _anonymous: true,
          },
        })
        setSubmitting(false)
      }}
    >
      {({ values, handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <div className={styles.inputheader}>
            <label htmlFor="_reviewPost">
              <strong>Review:</strong>
            </label>
            <ErrorMessage name="_reviewPost">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Field
            autocomplete="off"
            component="textarea"
            name="_reviewPost"
            placeholder='"I love this class!"'
            rows="3"
            maxLength={maxLength}
          />
          <span className={styles.maxlength}>
            {maxLength - values._reviewPost.length}/{maxLength}
          </span>
          <div className={styles.inputheader}>
            <label htmlFor="_reviewProfessor">
              <strong>Professor:</strong>
            </label>
            <ErrorMessage name="_reviewProfessor">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Field
            autocomplete="off"
            type="text"
            name="_reviewProfessor"
            placeholder='"Professor Scotty"'
          />
          <div className={styles.inputheader}>
            <label htmlFor="_taken">
              <strong>Taken:</strong>
            </label>
            <ErrorMessage name="_taken">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Field
            autocomplete="off"
            type="text"
            name="_taken"
            placeholder='"Winter 1907"'
          />
          <label className={styles.checkedWrapper}>
            <Field autocomplete="off" type="checkbox" name="_anonymous" />
            <strong>Anonymous?</strong>
          </label>
          <label htmlFor="_difficulty">
            <br />
            <strong>Difficulty: {values._difficulty}</strong>
          </label>
          <Slider />
          <span className={styles.actions}>
            <button
              className={styles.primary}
              type="submit"
              disabled={isSubmitting}
            >
              Post Review!
            </button>
          </span>
        </Form>
      )}
    </Formik>
  )
}
