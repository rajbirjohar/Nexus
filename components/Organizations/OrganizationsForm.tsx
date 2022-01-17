import React, { useState } from 'react'
import Router from 'next/router'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import styles from '@/styles/form.module.css'

// length of description
const maxLength = 1000
const tagLineLength = 250

interface Organization {
  organizerId: string
  organizer: string
  email: string
  _organizationName: string
  _organizationTagline: string
  _organizationDescription: string
}

// Component: OrganizationPostForm()
// Purpose: To take in user inputted data and submit it to the database

export default function OrganizationsForm() {
  const { data: session } = useSession()

  const initialValues: Organization = {
    organizerId: session.user.id,
    organizer: session.user.name,
    email: session.user.email,
    _organizationName: '',
    _organizationTagline: '',
    _organizationDescription: '',
  }

  const sendData = async (organizationData) => {
    const response = await fetch('/api/organizations/orgcreate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ organizationData: organizationData }),
    })
    const data = await response.json()
    if (response.status === 422) {
      toast.error('This name is taken. Please choose a different one.')
    } else if (response.status === 200) {
      toast.success("You've created your organization!")
      Router.reload()
    } else {
      toast.error(
        'Uh oh. Something happened. Please contact us if this persists.'
      )
    }
    return data.organizationData
  }

  return (
    <>
      <h3>Create Your Organization</h3>
      <Formik
        validateOnBlur={false}
        initialValues={initialValues}
        validate={(values: Organization) => {
          let errors: FormikErrors<Organization> = {}
          if (!values._organizationName) {
            errors._organizationName = 'Required'
          }
          if (!values._organizationTagline) {
            errors._organizationTagline = 'Required'
          }
          if (!values._organizationDescription) {
            errors._organizationDescription = 'Required'
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
              <label htmlFor="_organizationName">
                <strong>Organization Name:</strong>
              </label>
              <ErrorMessage name="_organizationName">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              type="text"
              name="_organizationName"
              placeholder="Scotty's Club"
            />
            <div className={styles.inputheader}>
              <label htmlFor="_organizationTagline">
                <strong>Organization Tagline:</strong>
              </label>
              <ErrorMessage name="_organizationTagline">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              type="text"
              name="_organizationTagline"
              placeholder="A memorable tagline"
              maxLength={tagLineLength}
            />
            <span className={styles.maxlength}>
              {tagLineLength - values._organizationTagline.length}/
              {tagLineLength}
            </span>
            <div className={styles.inputheader}>
              <label htmlFor="_organizationDescription">
                <strong>Organization Description:</strong>
              </label>
              <ErrorMessage name="_organizationDescription">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              component="textarea"
              name="_organizationDescription"
              placeholder="A very cool description"
              maxLength={maxLength}
            />
            <span className={styles.commentactions}>
              <span className={styles.maxlength}>
                {maxLength - values._organizationDescription.length}/{maxLength}
              </span>
              <button
                className={styles.primary}
                type="submit"
                disabled={isSubmitting}
              >
                Create{' '}
                {!values._organizationName
                  ? 'Organization'
                  : values._organizationName}
                !
              </button>
            </span>
          </Form>
        )}
      </Formik>
    </>
  )
}
