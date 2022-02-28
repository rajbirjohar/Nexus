import React from 'react'
import toast from 'react-hot-toast'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import useSlider from './Slider'
import styles from '@/styles/form.module.css'
import { useSession } from 'next-auth/react'
import Tiptap from '../Tiptap/Tiptap'

interface NewReview {
  reviewId: string
  authorId: string
  _review: string
  _professor: string
  _taken: string
  _difficulty: number
  _anonymous: boolean
}

export default function ReviewEditForm({
  reviewId,
  review,
  professor,
  taken,
  difficulty,
  anonymous,
  onHandleChange,
}) {
  // useSlider hook
  const [slideValue, Slider, setSlide] = useSlider(1, 10, difficulty)

  // default values for review Object
  const { data: session } = useSession()
  const initialValues: NewReview = {
    authorId: session.user.id,
    reviewId: reviewId,
    _review: review,
    _professor: professor,
    _taken: taken,
    _difficulty: anonymous,
    _anonymous: anonymous,
  }

  const sendData = async (reviewData) => {
    const response = await fetch('/api/reviews', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reviewData: reviewData }),
    })
    const data = await response.json()
    if (response.status === 200) {
      toast.success('Your review has been edited!')
    } else {
      toast.error(
        'Uh oh. Something happened. Please contact us if this persists.'
      )
    }
    return data._reviewData
  }
  return (
    <Formik
      validateOnBlur={false}
      initialValues={initialValues}
      validate={(values: NewReview) => {
        let errors: FormikErrors<NewReview> = {}
        if (!values._review) {
          errors._review = 'Required'
        }
        if (!values._professor) {
          errors._professor = 'Required'
        }
        if (!values._taken) {
          errors._taken = 'Required'
        }
        if (
          values._review === review &&
          values._professor === professor &&
          values._taken === taken &&
          values._anonymous === anonymous &&
          values._difficulty === difficulty
        ) {
          errors._review = 'You made no changes'
          errors._professor = 'You made no changes'
          errors._taken = 'You made no changes'
          errors._anonymous = 'You made no changes'
          errors._difficulty = 'You made no changes'
        }
        return errors
      }}
      onSubmit={(values, { setSubmitting }) => {
        sendData(values)
        !onHandleChange()
        setSubmitting(false)
      }}
    >
      {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
        <Form onSubmit={handleSubmit}>
          <div className={styles.inputheader}>
            <label htmlFor="_review">
              <strong>
                Review: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="_review">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Tiptap
            setFieldValue={setFieldValue}
            name="_review"
            oldContent={values._review}
          />
          <div className={styles.inputheader}>
            <label htmlFor="_professor">
              <strong>
                Professor: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="_professor">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Field
            autoComplete="off"
            type="text"
            name="_professor"
            placeholder='"Professor Scotty"'
          />
          <div className={styles.inputheader}>
            <label htmlFor="_taken">
              <strong>
                Taken: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="_taken">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Field
            autoComplete="off"
            type="text"
            name="_taken"
            placeholder='"Winter 1907"'
          />
          <div className={styles.inputheader}>
            <label className={styles.check}>
              <Field autoComplete="off" type="checkbox" name="_anonymous" />
              <strong>Anonymous?</strong>
            </label>
            <ErrorMessage name="_anonymous">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <div className={styles.inputheader}>
            <label htmlFor="_difficulty">
              <strong>Difficulty: {values._difficulty}</strong>
            </label>
            <ErrorMessage name="_taken">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Slider />
          <span className={styles.actions}>
            <button
              className={styles.secondary}
              type="submit"
              disabled={isSubmitting}
            >
              Edit Review!
            </button>
          </span>
        </Form>
      )}
    </Formik>
  )
}
