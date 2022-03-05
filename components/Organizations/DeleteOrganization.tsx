import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import toast from 'react-hot-toast'
import styles from '@/styles/form.module.css'

interface Agreement {
  confirmOrg: string
}

export default function DeleteOrganization({ orgId, name, imagePublicId }: Organization) {
  const router = useRouter()
  const initialValues: Organization & Agreement = {
    orgId: orgId,
    name: '',
    confirmOrg: '',
    imagePublicId: imagePublicId,
  }

  const sendData = async (orgData) => {
    const res = await fetch('/api/organizations', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orgData: orgData }),
    })
    await res.json()
    if (res.status === 200) {
      router.push('/organizations')
      toast.success('Deleted organization.')
    } else {
      toast.error(
        'Uh oh. Something went wrong. If this persists, please let us know.'
      )
    }
  }
  return (
    <section>
      <h3>Delete Organization</h3>
      <p>
        <strong>
          You understand that deleting this organization will delete all posts,
          members, and admins from Nexus never to be seen again. Proceed with
          caution.
        </strong>
      </p>
      <p>
        <strong>
          If you are completely sure and aware of the consequences, please fill
          out the form below.
        </strong>
      </p>
      <p>
        Please enter <strong>&#34;{name}&#34;</strong> to delete this
        organization.
      </p>
      <Formik
        validateOnBlur={false}
        initialValues={initialValues}
        validate={(values: Organization & Agreement) => {
          let errors: FormikErrors<Organization & Agreement> = {}
          if (!values.name) {
            errors.name = 'Required'
          } else if (values.name !== name) {
            errors.name = 'Incorrect Organization name'
          }
          if (!values.confirmOrg) {
            errors.confirmOrg = 'Required'
          } else if (values.confirmOrg !== name) {
            errors.confirmOrg = 'Incorrect Organization name'
          }
          if (values.name !== values.confirmOrg) {
            errors.name = 'Organizations do not match'
            errors.confirmOrg = 'Organizations do not match'
          }
          return errors
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          sendData(values)
          resetForm({
            values: {
              orgId: orgId,
              name: '',
              confirmOrg: '',
              imagePublicId: '',
            },
          })
          setSubmitting(false)
        }}
      >
        {({ values, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <div className={styles.inputheader}>
              <label htmlFor="email">
                <strong>Organization:</strong>
              </label>
              <ErrorMessage name="name">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              type="text"
              name="name"
              placeholder="Organization Name"
              maxLength={20}
            />
            <div className={styles.inputheader}>
              <label htmlFor="confirmOrg">
                <strong>Confirm Organization:</strong>
              </label>
              <ErrorMessage name="confirmOrg">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              type="text"
              name="confirmOrg"
              placeholder="Organization Name"
              maxLength={20}
            />
            <span className={styles.actions}>
              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.deletefull}
              >
                Delete Organization
              </button>
            </span>
          </Form>
        )}
      </Formik>
    </section>
  )
}
