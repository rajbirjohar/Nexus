import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import useSlider from './Slider'
import formstyles from '@/styles/form.module.css'
import { useSession } from 'next-auth/react'
import Tiptap from '../Tiptap/Tiptap'

interface Review {
  authorId: string
  author: string
  _review: string
  _professor: string
  _course: string
  _courseId: string
  _taken: string
  _difficulty: number
  _anonymous: boolean
}

export default function ReviewForm({ course, courseId }) {
  // useSlider hook
  const [slideValue, Slider] = useSlider(1, 10, 5)
  const { data: session } = useSession()
  const initialValues: Review = {
    authorId: session.user.id,
    author: session.user.name,
    _review: '',
    _professor: '',
    _course: course,
    _courseId: courseId,
    _taken: '',
    _difficulty: slideValue,
    _anonymous: true,
  }

  const sendData = async (reviewData) => {
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reviewData: reviewData }),
    })
    const data = await response.json()
    if (response.status === 200) {
      toast.success('Your review has been posted!')
    } else {
      toast.error(
        'Uh oh. Something happened. Please contact us if this persists.'
      )
    }
    return data.reviews
  }
  return (
    <Formik
      validateOnBlur={false}
      initialValues={initialValues}
      validate={(values: Review) => {
        let errors: FormikErrors<Review> = {}
        if (!values._review) {
          errors._review = 'Required'
        }
        if (!values._professor) {
          errors._professor = 'Required'
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
            authorId: session.user.id,
            author: session.user.name,
            _review: '',
            _professor: '',
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
      {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
        <Form onSubmit={handleSubmit}>
          <div className={formstyles.inputheader}>
            <label htmlFor="_review">
              <strong>
                Review: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="_review">
              {(message) => <span className={formstyles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Tiptap setFieldValue={setFieldValue} name="_review" />
          <div className={formstyles.inputheader}>
            <label htmlFor="_professor">
              <strong>
                Professor: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="_professor">
              {(message) => <span className={formstyles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Field
            autoComplete="off"
            type="text"
            name="_professor"
            placeholder='"Professor Scotty"'
          />
          <div className={formstyles.inputheader}>
            <label htmlFor="_taken">
              <strong>
                Taken: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="_taken">
              {(message) => <span className={formstyles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Field
            autoComplete="off"
            type="text"
            name="_taken"
            placeholder='"Winter 1907"'
          />
          <label className={formstyles.check}>
            <Field autoComplete="off" type="checkbox" name="_anonymous" />
            <strong>Anonymous?</strong>
          </label>
          <label htmlFor="_difficulty">
            <br />
            <strong>Difficulty: {values._difficulty}</strong>
          </label>
          <Slider />
          <span className={formstyles.actions}>
            <button
              className={formstyles.primary}
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
