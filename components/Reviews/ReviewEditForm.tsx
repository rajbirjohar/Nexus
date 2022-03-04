import React, { Dispatch } from 'react'
import toast from 'react-hot-toast'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import useSlider from './Slider'
import styles from '@/styles/form.module.css'
import { useSession } from 'next-auth/react'
import Tiptap from '../Tiptap/Tiptap'

interface Edit {
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>
  isEdit: boolean
}

export default function ReviewEditForm({
  reviewId,
  review,
  professor,
  taken,
  difficulty,
  anonymous,
  setIsEdit,
  isEdit,
}: Review & Edit) {
  // useSlider hook
  const [slideValue, Slider, setSlide] = useSlider(1, 10, difficulty)

  // default values for review Object
  const { data: session } = useSession()
  const initialValues: Review = {
    authorId: session.user.id,
    reviewId: reviewId,
    review: review,
    professor: professor,
    taken: taken,
    difficulty: difficulty,
    anonymous: anonymous,
  }

  const sendData = async (reviewData: Review) => {
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
    return data.reviewData
  }
  return (
    <Formik
      validateOnBlur={false}
      initialValues={initialValues}
      validate={(values: Review) => {
        let errors: FormikErrors<Review> = {}
        if (!values.review) {
          errors.review = 'Required'
        }
        if (!values.professor) {
          errors.professor = 'Required'
        }
        if (!values.taken) {
          errors.taken = 'Required'
        }
        if (
          values.review === review &&
          values.professor === professor &&
          values.taken === taken &&
          values.anonymous === anonymous &&
          values.difficulty === difficulty
        ) {
          errors.review = 'You made no changes'
          errors.professor = 'You made no changes'
          errors.taken = 'You made no changes'
          errors.anonymous = 'You made no changes'
          errors.difficulty = 'You made no changes'
        }
        return errors
      }}
      onSubmit={(values, { setSubmitting }) => {
        sendData(values)
        setIsEdit(!isEdit)
        setSubmitting(false)
      }}
    >
      {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
        <Form onSubmit={handleSubmit}>
          <div className={styles.inputheader}>
            <label htmlFor="review">
              <strong>
                Review: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="review">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Tiptap
            setFieldValue={setFieldValue}
            name="review"
            oldContent={values.review}
          />
          <div className={styles.inputheader}>
            <label htmlFor="professor">
              <strong>
                Professor: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="professor">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Field
            autoComplete="off"
            type="text"
            name="professor"
            placeholder='"Professor Scotty"'
          />
          <div className={styles.inputheader}>
            <label htmlFor="taken">
              <strong>
                Taken: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="taken">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Field
            autoComplete="off"
            type="text"
            name="taken"
            placeholder='"Winter 1907"'
          />
          <div className={styles.inputheader}>
            <label className={styles.check}>
              <Field autoComplete="off" type="checkbox" name="anonymous" />
              <strong>Anonymous?</strong>
            </label>
            <ErrorMessage name="anonymous">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <div className={styles.inputheader}>
            <label htmlFor="difficulty">
              <strong>Difficulty: {values.difficulty}</strong>
            </label>
            <ErrorMessage name="taken">
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
