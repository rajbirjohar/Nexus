import Router from 'next/router'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import toast from 'react-hot-toast'
import styles from '@/styles/form.module.css'

interface Role {
  userId: string
  role: string
}

export default function SetRoleForm({ userId }) {
  const initialValues: Role = {
    userId: userId,
    role: '',
  }
  const sendData = async (roleData) => {
    const response = await fetch('/api/users/setrole', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roleData: roleData }),
    })
    const data = await response.json()

    if (response.status === 200) {
      toast.success("You've set your role!")
      Router.reload()
    } else {
      toast.error(
        'Uh oh. Something happened. Please contact us if this persists.'
      )
    }
  }
  return (
    <div>
      <h3>Student or Professor?</h3>
      <p>
        <strong>
          Please tell us what your position is at UCR.
          <br />
          You won&#39;t be able to change this after you submit.
        </strong>
      </p>
      <Formik
        validateOnBlur={false}
        initialValues={initialValues}
        validate={(values: Role) => {
          let errors: FormikErrors<Role> = {}
          if (!values.role) {
            errors.role = 'Required'
          } else if (
            values.role !== 'student' &&
            values.role !== 'professor'
          ) {
            errors.role = 'Incorrect answer'
          }
          return errors
        }}
        onSubmit={(values, { setSubmitting }) => {
          sendData(values)
          setSubmitting(false)
        }}
      >
        {({ values, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <div className={styles.inputheader}>
              <label htmlFor="role">
                <strong>Role:</strong>
              </label>
              <ErrorMessage name="role">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field as="select" name="role" className={styles.dropdown}>
              <option value="none">Select a role</option>
              <option value="student">Student</option>
              <option value="professor">Professor</option>
            </Field>
            <span className={styles.actions}>
              <button
                className={styles.primary}
                type="submit"
                disabled={isSubmitting}
              >
                Set Role!
              </button>
            </span>
          </Form>
        )}
      </Formik>
    </div>
  )
}
