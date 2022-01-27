import React from 'react'
import toast from 'react-hot-toast'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import styles from '@/styles/form.module.css'
import { useSession } from 'next-auth/react'

// Max length for review
const maxLength = 200

interface Comment {
  eventId: string
  authorId: string
  _newComment: string
  commentId: string
}

export default function CommentEditForm({
  eventId,
  oldComment,
  onHandleChange,
  commentId,
  authorId,
}) {
  // default values for comment Object
  const { data: session } = useSession()
  const initialValues: Comment = {
    authorId: session.user.id,
    eventId: eventId,
    _newComment: oldComment,
    commentId: commentId,
  }

  const sendData = async (newCommentData) => {
    const response = await fetch(`/api/events/comments/commentedit`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newCommentData: newCommentData }),
    })
    const data = await response.json()
    if (response.status === 200) {
      toast.success('Your comment has been edited!')
    } else {
      toast.error(
        'Uh oh. Something happened. Please contact us if this persists.'
      )
    }
    return data.newCommentData
  }
  return (
    <Formik
      validateOnBlur={false}
      initialValues={initialValues}
      validate={(values: Comment) => {
        let errors: FormikErrors<Comment> = {}
        if (!values._newComment) {
          errors._newComment = 'Required'
        }
        if (values._newComment === oldComment) {
          errors._newComment = 'You made no changes'
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
            <label htmlFor="_newComment">
              <strong>Comment:</strong>
            </label>
            <ErrorMessage name="_newComment">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Field
            autoComplete="off"
            name="_newComment"
            placeholder='"Show your interest!"'
            rows="3"
            maxLength={maxLength}
          />
          <div className={styles.commentactions}>
            <span className={styles.maxlength}>
              {maxLength - values._newComment.length}/{maxLength}
            </span>
            <button
              className={styles.secondary}
              type="submit"
              disabled={isSubmitting}
            >
              Edit Comment!
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}
