import { useSession } from 'next-auth/react'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import toast from 'react-hot-toast'
import styles from './comment.module.css'

const maxLength = 200

interface Comment {
  eventId: string
  authorId: string
  author: string
  email: string
  _comment: string
}

export default function CommentsForm({ eventId }) {
  const { data: session } = useSession()
  const initialValues: Comment = {
    eventId: eventId,
    authorId: session.user.id,
    author: session.user.name,
    email: session.user.email,
    _comment: '',
  }
  const sendData = async (commentData) => {
    const response = await fetch('/api/events/comments', {
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
      validate={(values: Comment) => {
        let errors: FormikErrors<Comment> = {}
        if (!values._comment) {
          errors._comment = 'Required'
        }
        return errors
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        sendData(values)
        resetForm({
          values: {
            eventId: eventId,
            authorId: session.user.id,
            author: session.user.name,
            email: session.user.email,
            _comment: '',
          },
        })
        setSubmitting(false)
      }}
    >
      {({ values, handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <div className={styles.inputheader}>
            <label htmlFor="_comment">
              <strong>
                Comment: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="_comment">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Field
            autoComplete="off"
            type="text"
            name="_comment"
            placeholder="Show your interest!"
            maxLength={maxLength}
          />
          <div className={styles.formactions}>
            <span className={styles.maxlength}>
              {maxLength - values._comment.length}/{maxLength}
            </span>
            <button
              className={styles.primary}
              type="submit"
              disabled={isSubmitting}
            >
              Post Comment!
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}
