import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import toast from 'react-hot-toast'
import styles from '@/styles/form.module.css'

interface Agreement {
  origCreatorId: string
  confirmEmail?: string
}

export default function TransferOwnerForm({
  orgId,
  origCreatorId,
}: Relation & Agreement) {
  const initialValues: Relation & Agreement = {
    orgId: orgId,
    origCreatorId: origCreatorId,
    email: '',
    confirmEmail: '',
  }
  const sendData = async (adminData: Relation & Agreement) => {
    const response = await fetch('/api/organizations/transferowner', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ adminData: adminData }),
    })
    const data = await response.json()
    if (response.status === 404) {
      toast.error('User does not exist or email is wrong. Please try again.')
    } else if (response.status === 405) {
      toast.error('User must be an admin.')
    } else if (response.status === 403) {
      toast.error('User is already the owner of this org or another one.')
    } else if (response.status === 200) {
      toast.success('Successfully transferred ownership!')
    } else {
      toast.error(
        'Uh oh. Something happened. Please contact us if this persists.'
      )
    }
    return data.adminData
  }
  return (
    <div>
      <h3>Transfer Owner</h3>
      <p>
        This action is irreversible unless the new owner transfer the
        organization back to you. Please ensure this is what you want to do.
      </p>
      <Formik
        validateOnBlur={false}
        initialValues={initialValues}
        validate={(values: Relation & Agreement) => {
          let errors: FormikErrors<Relation & Agreement> = {}
          if (!values.email) {
            errors.email = 'Required'
          } else if (!/^[A-Z0-9._%+-]+@ucr.edu$/i.test(values.email)) {
            errors.email = 'Wrong email format'
          }
          if (!values.confirmEmail) {
            errors.confirmEmail = 'Required'
          } else if (!/^[A-Z0-9._%+-]+@ucr.edu$/i.test(values.confirmEmail)) {
            errors.confirmEmail = 'Wrong email format'
          }
          if (values.email !== values.confirmEmail) {
            errors.email = 'Emails do not match'
            errors.confirmEmail = 'Emails do not match'
          }
          return errors
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          sendData(values)
          resetForm({
            values: {
              orgId: orgId,
              origCreatorId: origCreatorId,
              email: '',
              confirmEmail: '',
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
            <div className={styles.inputheader}>
              <label htmlFor="confirmEmail">
                <strong>Confirm Email:</strong>
              </label>
              <ErrorMessage name="confirmEmail">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              type="email"
              name="confirmEmail"
              placeholder="scotty001@ucr.edu"
              maxLength={20}
            />
            <span className={styles.actions}>
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.deletefull}
              >
                Transfer Owner
              </button>
            </span>
          </Form>
        )}
      </Formik>
    </div>
  )
}
