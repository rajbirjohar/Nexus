import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import toast from 'react-hot-toast'
import styles from '@/styles/form.module.css'

interface Organization {
  organizationId: string
  _organization: string
  _confirmOrganization: string
  imagePublicId: string
}

export default function DeleteOrganization({
  organizationId,
  organizationName,
  imagePublicId,
}) {
  const router = useRouter()
  const initialValues: Organization = {
    organizationId: organizationId,
    _organization: '',
    _confirmOrganization: '',
    imagePublicId: imagePublicId,
  }

  const sendData = async (organizationData) => {
    const res = await fetch('/api/organizations/orgdelete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ organizationData: organizationData }),
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
        Please enter <strong>&#34;{organizationName}&#34;</strong> to delete
        this organization.
      </p>
      <Formik
        validateOnBlur={false}
        initialValues={initialValues}
        validate={(values: Organization) => {
          let errors: FormikErrors<Organization> = {}
          if (!values._organization) {
            errors._organization = 'Required'
          } else if (values._organization !== organizationName) {
            errors._organization = 'Incorrect Organization name'
          }
          if (!values._confirmOrganization) {
            errors._confirmOrganization = 'Required'
          } else if (values._confirmOrganization !== organizationName) {
            errors._confirmOrganization = 'Incorrect Organization name'
          }
          if (values._organization !== values._confirmOrganization) {
            errors._organization = 'Organizations do not match'
            errors._confirmOrganization = 'Organizations do not match'
          }
          return errors
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          sendData(values)
          resetForm({
            values: {
              organizationId: organizationId,
              _organization: '',
              _confirmOrganization: '',
              imagePublicId: '',
            },
          })
          setSubmitting(false)
        }}
      >
        {({ values, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <div className={styles.inputheader}>
              <label htmlFor="_email">
                <strong>Organization:</strong>
              </label>
              <ErrorMessage name="_organization">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              type="text"
              name="_organization"
              placeholder="Organization Name"
              maxLength={20}
            />
            <div className={styles.inputheader}>
              <label htmlFor="_confirmOrganization">
                <strong>Confirm Organization:</strong>
              </label>
              <ErrorMessage name="_confirmOrganization">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              type="text"
              name="_confirmOrganization"
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
