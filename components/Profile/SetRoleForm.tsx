import Router from 'next/router'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import toast from 'react-hot-toast'
import styles from '@/styles/form.module.css'

interface Role {
  userId: string
  _role: string
}

export default function SetRoleForm({ userId }) {
  const initialValues: Role = {
    userId: userId,
    _role: '',
  }
  const sendData = async (userRoleData) => {
    const response = await fetch('/api/users/setrole', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userRoleData: userRoleData }),
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
          if (!values._role) {
            errors._role = 'Required'
          } else if (
            values._role !== 'student' &&
            values._role !== 'professor'
          ) {
            errors._role = 'Incorrect answer'
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
              <label htmlFor="_comment">
                <strong>Role:</strong>
              </label>
              <ErrorMessage name="_role">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field as="select" name="_role">
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
