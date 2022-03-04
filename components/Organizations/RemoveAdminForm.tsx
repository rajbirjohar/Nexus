import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import toast from 'react-hot-toast'
import styles from '@/styles/form.module.css'

export default function RemoveAdminForm({ orgId }: Relation) {
  const initialValues: Relation = {
    orgId: orgId,
    email: '',
  }
  const sendData = async (adminData: Relation) => {
    const response = await fetch('/api/organizations/admins', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ adminData: adminData }),
    })
    const data = await response.json()
    if (response.status === 404) {
      toast.error('User does not exist or email is wrong. Please try again.')
    } else if (response.status === 403) {
      toast.error('You cannot remove yourself until you transfer ownership.')
    } else if (response.status === 200) {
      toast.success('Successfully removed this Admin.')
    } else {
      toast.error(
        'Uh oh. Something happened. Please contact us if this persists.'
      )
    }
    return data.adminData
  }
  return (
    <div>
      <h3>Remove an Admin</h3>
      <p>
        This person will no longer have access to admin roles for this
        organization. You or another admin will have to re-add them if you
        change your mind.
      </p>
      <Formik
        validateOnBlur={false}
        initialValues={initialValues}
        validate={(values: Relation) => {
          let errors: FormikErrors<Relation> = {}
          if (!values.email) {
            errors.email = 'Required'
          } else if (!/^[A-Z0-9._%+-]+@ucr.edu$/i.test(values.email)) {
            errors.email = 'Wrong email format'
          }
          return errors
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          sendData(values)
          resetForm({
            values: {
              orgId: orgId,
              email: '',
            },
          })
          setSubmitting(false)
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <div className={styles.inputheader}>
              <label htmlFor="email">
                <strong>Email:</strong>
              </label>
              <ErrorMessage name="email">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              type="email"
              name="email"
              placeholder="scotty001@ucr.edu"
              maxLength={20}
            />
            <span className={styles.actions}>
              <button
                type="submit"
                className={styles.deletefull}
                disabled={isSubmitting}
              >
                Remove Admin
              </button>
            </span>
          </Form>
        )}
      </Formik>
    </div>
  )
}
