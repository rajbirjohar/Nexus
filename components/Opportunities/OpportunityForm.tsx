import React from 'react'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import { useSession } from 'next-auth/react'
import Router, { useRouter } from 'next/router'
import ImageDropzone from '../Dropzone/Dropzone'
import toast from 'react-hot-toast'
import styles from '@/styles/form.module.css'
import Tiptap from '../Tiptap/Tiptap'
import Tags from '../Tags/Tags'

export default function OpportunityForm({ authorId, author, email }) {
  const { data: session } = useSession()
  const router = useRouter()
  const initialValues: Opportunity = {
    authorId: session.user.id,
    author: session.user.name,
    email: session.user.email,
    name: '',
    details: '',
    // _opportunityStartDate: new Date(),
    endDate: new Date(),
    tags: [{ id: '', text: '' }],
  }

  const sendData = async (opportunityData) => {
    const response = await fetch('/api/opportunities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ opportunityData: opportunityData }),
    })
    const data = await response.json()
    if (response.status === 200) {
      toast.success('Your opportunity has been posted!')
    } else {
      toast.error(
        'Uh oh. Something happened. Please contact us if this persists.'
      )
    }
    return data.opportunityData
  }
  return (
    <Formik
      validateOnBlur={false}
      initialValues={initialValues}
      validate={(values: Opportunity) => {
        let errors: FormikErrors<Opportunity> = {}
        if (!values.name) {
          errors.name = 'Required'
        }
        if (!values.details) {
          errors.details = 'Required'
        }
        if (!values.endDate) {
          errors.endDate = 'Required'
        } else if (new Date(values.endDate) < new Date()) {
          errors.endDate = 'End date has passed'
        }
        if (values.tags.length > 10) {
          errors.tags = 'Too many tags'
        } else if (
          values.tags.filter((tags) => !/^[a-z0-9]+$/i.test(tags.text))
            .length > 0
        ) {
          errors.tags = 'Alphanumeric characters only'
        }
        return errors
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        sendData(values)
        //console.log(values)
        resetForm({
          values: {
            authorId: authorId,
            author: author,
            email: email,
            name: '',
            details: '',
            endDate: new Date(),
            tags: [{ id: '', text: '' }],
          },
        })
        setSubmitting(false)
      }}
    >
      {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
        <Form onSubmit={handleSubmit}>
          <div className={styles.inputheader}>
            <label htmlFor="name">
              <strong>
                Opportunity Name: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="name">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Field
            autoComplete="off"
            name="name"
            type="text"
            placeholder="Scotty's Internship"
          />
          <div className={styles.inputheader}>
            <label htmlFor="details">
              <strong>
                Opportunity Details: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="details">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Tiptap setFieldValue={setFieldValue} name="details" />
          <div className={styles.datewrapper}>
            <div className={styles.dateinput}>
              <div className={styles.inputheader}>
                <label htmlFor="endDate">
                  <strong>
                    Application Deadline: <span>*</span>
                  </strong>
                </label>
                <ErrorMessage name="endDate">
                  {(message) => <span className={styles.error}>{message}</span>}
                </ErrorMessage>
              </div>
              <Field autoComplete="off" type="datetime-local" name="endDate" />
            </div>
          </div>
          <div className={styles.inputheader}>
            <label htmlFor="tags">
              <strong>Tags:</strong>
            </label>
            <ErrorMessage name="tags">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Tags setFieldValue={setFieldValue} name="tags" />
          <span className={styles.actions}>
            <button
              className={styles.primary}
              type="submit"
              disabled={isSubmitting}
            >
              Post Opportunity!
            </button>
          </span>
        </Form>
      )}
    </Formik>
  )
}
