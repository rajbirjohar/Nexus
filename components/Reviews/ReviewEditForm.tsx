import React from 'react'
import toast from 'react-hot-toast'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import useSlider from './Slider'
import styles from '@/styles/form.module.css'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'

// Max length for review
const maxLength = 750

interface ReviewPost {
  reviewPostId: string
  creatorId: string
  _newReviewPost: string
  _newReviewProfessor: string
  _newTaken: string
  _difficulty: number
  _newAnonymous: boolean
}

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
  const [slideValue, Slider, setSlide] = useSlider(1, 10, oldDifficulty)

  // default values for reviewPost Object
  const { data: session } = useSession()
  const initialValues: ReviewPost = {
    creatorId: session.user.id,
    reviewPostId: reviewPostId,
    _newReviewPost: oldReviewPost,
    _newReviewProfessor: oldReviewProfessor,
    _newTaken: oldTaken,
    _difficulty: oldDifficulty,
    _newAnonymous: oldAnonymous,
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
      toast.success('Your review has been edited!')
    } else {
      toast.error(
        'Uh oh. Something happened. Please contact us if this persists.'
      )
    }
    return data.newReviewPostData
  }
  return (
    <motion.div
      layout="position"
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, type: 'tween' }}
    >
      <Formik
        validateOnBlur={false}
        initialValues={initialValues}
        validate={(values: ReviewPost) => {
          let errors: FormikErrors<ReviewPost> = {}
          if (!values._newReviewPost) {
            errors._newReviewPost = 'Required'
          }
          if (!values._newReviewProfessor) {
            errors._newReviewProfessor = 'Required'
          }
          if (!values._newTaken) {
            errors._newTaken = 'Required'
          }
          if (
            values._newReviewPost === oldReviewPost &&
            values._newReviewProfessor === oldReviewProfessor &&
            values._newTaken === oldTaken &&
            values._newAnonymous === oldAnonymous &&
            values._difficulty === oldDifficulty
          ) {
            errors._newReviewPost = 'You made no changes'
            errors._newReviewProfessor = 'You made no changes'
            errors._newTaken = 'You made no changes'
            errors._newAnonymous = 'You made no changes'
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
        {({ values, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <div className={styles.inputheader}>
              <label htmlFor="_reviewPost">
                <strong>Review:</strong>
              </label>
              <ErrorMessage name="_newReviewPost">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              component="textarea"
              name="_newReviewPost"
              placeholder='"I love this class!"'
              rows="3"
              maxLength={maxLength}
            />
            <span className={styles.maxlength}>
              {maxLength - values._newReviewPost.length}/{maxLength}
            </span>
            <div className={styles.inputheader}>
              <label htmlFor="_newReviewProfessor">
                <strong>Professor:</strong>
              </label>
              <ErrorMessage name="_newReviewProfessor">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              type="text"
              name="_newReviewProfessor"
              placeholder='"Professor Scotty"'
            />
            <div className={styles.inputheader}>
              <label htmlFor="_newTaken">
                <strong>Taken:</strong>
              </label>
              <ErrorMessage name="_newTaken">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              type="text"
              name="_newTaken"
              placeholder='"Winter 1907"'
            />
            <div className={styles.inputheader}>
              <label className={styles.checkedWrapper}>
                <Field
                  autoComplete="off"
                  type="checkbox"
                  name="_newAnonymous"
                />
                <strong>Anonymous?</strong>
              </label>
              <ErrorMessage name="_newAnonymous">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <div className={styles.inputheader}>
              <label htmlFor="_difficulty">
                <strong>Difficulty: {values._difficulty}</strong>
              </label>
              <ErrorMessage name="_newTaken">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Slider />
            <span className={styles.actions}>
              <button
                className={styles.primary}
                type="submit"
                disabled={isSubmitting}
              >
                Edit Review!
              </button>
            </span>
          </Form>
        )}
      </Formik>
    </motion.div>
  )
}
