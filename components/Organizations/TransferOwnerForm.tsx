import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import toast from 'react-hot-toast'
import styles from '@/styles/form.module.css'

interface NewOwner {
  organizationId: string
  _email: string
  _confirmEmail: string
}

export default function TransferOwnerForm({ organizationId }) {
  const initialValues: NewOwner = {
    organizationId: organizationId,
    _email: '',
    _confirmEmail: '',
  }
  const sendData = async (adminData) => {
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
      toast.success('Successfully transferrose ownership!')
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
        organization back to you. Please ensure this is what you want to do 🤔.
      </p>
      <Formik
        validateOnBlur={false}
        initialValues={initialValues}
        validate={(values: NewOwner) => {
          let errors: FormikErrors<NewOwner> = {}
          if (!values._email) {
            errors._email = 'Required'
          } else if (!/^[A-Z0-9._%+-]+@ucr.edu$/i.test(values._email)) {
            errors._email = 'Wrong email format'
          }
          if (!values._confirmEmail) {
            errors._confirmEmail = 'Required'
          } else if (!/^[A-Z0-9._%+-]+@ucr.edu$/i.test(values._confirmEmail)) {
            errors._confirmEmail = 'Wrong email format'
          }
          if (values._email !== values._confirmEmail) {
            errors._email = 'Emails do not match'
            errors._confirmEmail = 'Emails do not match'
          }
          return errors
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          sendData(values)
          resetForm({
            values: {
              organizationId: organizationId,
              _email: '',
              _confirmEmail: '',
            },
          })
          setSubmitting(false)
        }}
      >
        {({ values, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <div className={styles.inputheader}>
              <label htmlFor="_email">
                <strong>Email:</strong>
              </label>
              <ErrorMessage name="_email">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autocomplete="off"
              type="email"
              name="_email"
              placeholder="scotty001@ucr.edu"
              maxLength={20}
            />
            <div className={styles.inputheader}>
              <label htmlFor="_confirmEmail">
                <strong>Confirm Email:</strong>
              </label>
              <ErrorMessage name="_confirmEmail">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autocomplete="off"
              type="email"
              name="_confirmEmail"
              placeholder="scotty001@ucr.edu"
              maxLength={20}
            />
            <span className={styles.actions}>
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.primary}
              >
                Transfer Owner
              </button>
            </span>
          </Form>
        )}
      </Formik>
      {/* <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="_email">
          <strong>Email:</strong>
        </label>
        <input
          autoComplete="off"
          aria-label="Admin Email Input"
          name="_email"
          value={admin._email}
          onChange={handleChange}
          type="text"
          placeholder="scotty@ucr.edu"
          className={styles.input}
        />
        <label htmlFor="_emailConfirm">
          <strong>Confirm Email:</strong>
        </label>
        <input
          autoComplete="off"
          aria-label="Admin Email Input"
          name="_emailConfirm"
          value={admin._emailConfirm}
          onChange={handleChange}
          type="text"
          placeholder="scotty@ucr.edu"
          className={styles.input}
        />
        <span className={styles.actions}>
          <button type="submit" className={styles.delete}>
            Transfer Owner
          </button>
        </span>
      </form> */}
    </div>
  )
}
