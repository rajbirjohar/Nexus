import React, { useState } from 'react'
import Router from 'next/router'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import styles from '@/styles/form.module.css'

interface Agreement {
  userId: string
  _orgRole: string
}

export default function CreatorRoleForm({ userId }) {
  const initialValues: Agreement = {
    userId: userId,
    _orgRole: '',
  }
  const sendData = async (orgRoleData) => {
    const response = await fetch('/api/users/setcreatorrole', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orgRoleData: orgRoleData }),
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
    <Formik
      validateOnBlur={false}
      initialValues={initialValues}
      validate={(values: Agreement) => {
        let errors: FormikErrors<Agreement> = {}
        if (!values._orgRole) {
          errors._orgRole = 'Required'
        } else if (values._orgRole !== 'Admin') {
          errors._orgRole = 'Wrong answer'
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
            <ErrorMessage name="_orgRole">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Field
            autocomplete="off"
            type="text"
            name="_orgRole"
            placeholder="Show your interest!"
            maxLength={10}
          />
          <span className={styles.actions}>
            <button
              className={styles.primary}
              type="submit"
              disabled={isSubmitting}
            >
              I Understand!
            </button>
          </span>
        </Form>
      )}
    </Formik>
  )
}
