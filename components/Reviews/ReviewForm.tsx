import toast from 'react-hot-toast'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import useSlider from './Slider'
import formstyles from '@/styles/form.module.css'
import { useSession } from 'next-auth/react'
import Tiptap from '../Tiptap/Tiptap'

export default function ReviewForm({ course, courseId }: Course) {
  const [slideValue, Slider] = useSlider(1, 10, 5)
  const { data: session } = useSession()
  const initialValues: Review = {
    authorId: session.user.id,
    author: session.user.firstname,
    review: '',
    professor: '',
    course: course,
    courseId: courseId,
    taken: '',
    difficulty: slideValue,
    anonymous: true,
  }

  const sendData = async (reviewData: Review) => {
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
        if (!values.review) {
          errors.review = 'Required'
        }
        if (!values.professor) {
          errors.professor = 'Required'
        }
        if (!values.taken) {
          errors.taken = 'Required'
        }
        return errors
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        sendData(values)
        resetForm({
          values: {
            authorId: session.user.id,
            author: session.user.firstname,
            review: '',
            professor: '',
            course: course,
            courseId: courseId,
            taken: '',
            difficulty: slideValue,
            anonymous: true,
          },
        })
        setSubmitting(false)
      }}
    >
      {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
        <Form onSubmit={handleSubmit}>
          <div className={formstyles.inputheader}>
            <label htmlFor="review">
              <strong>
                Review: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="review">
              {(message) => <span className={formstyles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Tiptap setFieldValue={setFieldValue} name="review" />
          <div className={formstyles.inputheader}>
            <label htmlFor="professor">
              <strong>
                Professor: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="professor">
              {(message) => <span className={formstyles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Field
            autoComplete="off"
            type="text"
            name="professor"
            placeholder='"Professor Scotty"'
          />
          <div className={formstyles.inputheader}>
            <label htmlFor="taken">
              <strong>
                Taken: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="taken">
              {(message) => <span className={formstyles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Field
            autoComplete="off"
            type="text"
            name="taken"
            placeholder='"Winter 1907"'
          />
          <label className={formstyles.check}>
            <Field autoComplete="off" type="checkbox" name="anonymous" />
            <strong>Anonymous?</strong>
          </label>
          <label htmlFor="difficulty">
            <br />
            <strong>Difficulty: {values.difficulty}</strong>
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
