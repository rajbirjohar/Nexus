import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import toast from 'react-hot-toast'
import styles from '@/styles/form.module.css'


export default function AddAdminForm({ orgId, org }: Relation) {
  const initialValues: Relation = {
    orgId: orgId,
    org: org,
    email: '',
    role: 'admin',
  }

  const sendData = async (adminData) => {
    const response = await fetch('/api/organizations/admins', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ adminData: adminData }),
    })
    const data = await response.json()
    if (response.status === 404) {
      toast.error('User does not exist or email is wrong. Please try again.')
    } else if (response.status === 403) {
      toast.error('User is already an admin or owner.')
    } else if (response.status === 201) {
      toast.success('Member has been updated to Admin!')
    } else if (response.status === 200) {
      toast.success('Successfully added this Admin!')
    } else {
      toast.error(
        'Uh oh. Something happened. Please contact us if this persists.'
      )
    }
    return data.adminData
  }

  return (
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
            org: org,
            email: '',
            role: 'admin',
          },
        })
        setSubmitting(false)
      }}
    >
      {({ values, handleSubmit, isSubmitting }) => (
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
              disabled={isSubmitting}
              className={styles.primary}
            >
              Add Admin
            </button>
          </span>
        </Form>
      )}
    </Formik>
  )
}
