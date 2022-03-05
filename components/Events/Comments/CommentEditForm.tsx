import React from 'react'
import toast from 'react-hot-toast'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import styles from './comment.module.css'
import { useSession } from 'next-auth/react'

// Max length for comment
const maxLength = 280

interface Edit {
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>
  isEdit: boolean
}

export default function CommentEditForm({
  eventId,
  comment,
  authorId,
  setIsEdit,
  isEdit,
  commentId,
}: EventComment & Edit) {
  const initialValues: EventComment = {
    authorId: authorId,
    eventId: eventId,
    comment: comment,
    commentId: commentId,
  }

  const sendData = async (commentData) => {
    const response = await fetch(`/api/events/${eventId}/comments`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ commentData: commentData }),
    })
    const data = await response.json()
    if (response.status === 200) {
      toast.success('Your comment has been edited!')
    } else {
      toast.error(
        'Uh oh. Something happened. Please contact us if this persists.'
      )
    }
    return data.commentData
  }
  return (
    <Formik
      validateOnBlur={false}
      initialValues={initialValues}
      validate={(values: EventComment) => {
        let errors: FormikErrors<EventComment> = {}
        if (!values.comment) {
          errors.comment = 'Required'
        }
        if (values.comment === comment) {
          errors.comment = 'You made no changes'
        }
        return errors
      }}
      onSubmit={(values, { setSubmitting }) => {
        sendData(values)
        setIsEdit(!isEdit)
        setSubmitting(false)
      }}
    >
      {({ values, handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <div className={styles.inputheader}>
            <label htmlFor="comment">
              <strong>
                Comment: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="comment">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Field
            autoComplete="off"
            name="comment"
            placeholder='"Show your interest!"'
            rows="3"
            maxLength={maxLength}
          />
          <div className={styles.formactions}>
            <span className={styles.maxlength}>
              {maxLength - values.comment.length}/{maxLength}
            </span>
            <button
              className={styles.secondary}
              type="submit"
              disabled={isSubmitting}
            >
              Edit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}
