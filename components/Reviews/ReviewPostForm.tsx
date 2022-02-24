import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import useSlider from './Slider'
import formstyles from '@/styles/form.module.css'
import { useSession } from 'next-auth/react'
import Tiptap from '../Tiptap/Tiptap'

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
  const [slideValue, Slider] = useSlider(1, 10, 5)
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
      {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
        <Form onSubmit={handleSubmit}>
          <div className={formstyles.inputheader}>
            <label htmlFor="_reviewPost">
              <strong>
                Review: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="_reviewPost">
              {(message) => <span className={formstyles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Tiptap
            setFieldValue={setFieldValue}
            isSubmitting={isSubmitting}
            name="_reviewPost"
            // Initially, we set it to the old details in initialValues
            oldEventDetails={values._reviewPost}
          />
          <div className={formstyles.inputheader}>
            <label htmlFor="_reviewProfessor">
              <strong>
                Professor: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="_reviewProfessor">
              {(message) => <span className={formstyles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Field
            autoComplete="off"
            type="text"
            name="_reviewProfessor"
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
