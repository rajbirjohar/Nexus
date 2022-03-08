import { useSession } from 'next-auth/react'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import toast from 'react-hot-toast'
import styles from './comment.module.css'

const maxLength = 280

export default function CommentsForm({
  eventId,
  orgId,
  author,
  authorId,
  email,
}: EventComment) {
  const initialValues: EventComment = {
    eventId: eventId,
    orgId: orgId,
    authorId: authorId,
    author: author,
    email: email,
    comment: '',
  }
  const sendData = async (commentData: EventComment) => {
    const response = await fetch(`/api/events/${eventId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ commentData: commentData }),
    })
    const data = await response.json()
    if (response.status === 200) {
      toast.success('Your comment has been posted!')
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
        return errors
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        sendData(values)
        resetForm({
          values: {
            eventId: eventId,
            orgId: orgId,
            authorId: authorId,
            author: author,
            email: email,
            comment: '',
          },
        })
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
            type="text"
            name="comment"
            placeholder="Show your interest!"
            maxLength={maxLength}
          />
          <div className={styles.formactions}>
            <span className={styles.maxlength}>
              {maxLength - values.comment.length}/{maxLength}
            </span>
            <button
              className={styles.primary}
              type="submit"
              disabled={isSubmitting}
            >
              Comment!
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}
