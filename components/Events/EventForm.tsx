import React from 'react'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import ImageDropzone from '../Dropzone/Dropzone'
import toast from 'react-hot-toast'
import styles from '@/styles/form.module.css'
import Tiptap from '../Tiptap/Tiptap'
import Tags from '../Tags/Tags'

export default function EventForm({ org, orgId }: OrgEvent) {
  const initialValues: OrgEvent = {
    org: org,
    orgId: orgId,
    name: '',
    details: '',
    startDate: new Date(),
    endDate: new Date(),
    image: '',
    commentlock: false,
    tags: [{ id: '', text: '' }],
  }

  const sendData = async (eventData: OrgEvent) => {
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ eventData: eventData }),
    })
    const data = await response.json()
    if (response.status === 200) {
      toast.success('Your event has been posted!')
    } else if (response.status === 413) {
      toast.error('Image is too big or wrong format.')
    } else {
      toast.error(
        'Uh oh. Something happened. Please contact us if this persists'
      )
    }
    return data.eventData
  }
  return (
    <Formik
      validateOnBlur={false}
      initialValues={initialValues}
      validate={(values: OrgEvent) => {
        let errors: FormikErrors<OrgEvent> = {}
        if (!values.name) {
          errors.name = 'Required'
        }
        if (!values.details) {
          errors.details = 'Required'
        }
        if (!values.startDate) {
          errors.startDate = 'Required'
        }
        if (!values.endDate) {
          errors.endDate = 'Required'
        } else if (new Date(values.endDate) < new Date(values.startDate)) {
          errors.endDate = 'End date is before start date'
        } else if (new Date(values.endDate) < new Date()) {
          errors.endDate = 'End date has passed'
        }
        if (values.tags.length > 10) {
          errors.tags = 'Too many tags'
        } else if (
          values.tags.filter((tags) => !/^[a-z0-9]+$/i.test(tags.text)).length >
          0
        ) {
          errors.tags = 'Alphanumeric characters only'
        }
        return errors
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        sendData(values)
        resetForm({
          values: {
            org: org,
            orgId: orgId,
            name: '',
            details: '',
            startDate: new Date(),
            endDate: new Date(),
            image: '',
            commentlock: false,
            tags: [{ id: '', text: '' }],
          },
        })
        setSubmitting(false)
      }}
    >
      {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
        <Form onSubmit={handleSubmit}>
          <div className={styles.inputheader}>
            <label htmlFor="eventImage">
              <strong>
                Event Banner:
                <br />
                <span className={styles.subtitle}>
                  For highest quality, use a rectangular photo
                </span>
              </strong>
            </label>
            <ErrorMessage name="eventImage">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <ImageDropzone setFieldValue={setFieldValue} name="eventImage" />
          <div className={styles.inputheader}>
            <label htmlFor="name">
              <strong>
                Event Name: <span>*</span>
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
            placeholder="Scotty's Birthday"
          />
          <div className={styles.inputheader}>
            <label htmlFor="details">
              <strong>
                Event Details: <span>*</span>
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
                <label htmlFor="startDate">
                  <strong>
                    Event Start Date: <span>*</span>
                  </strong>
                </label>
                <ErrorMessage name="startDate">
                  {(message) => <span className={styles.error}>{message}</span>}
                </ErrorMessage>
              </div>
              <Field
                autoComplete="off"
                type="datetime-local"
                name="startDate"
              />
            </div>
            <div className={styles.dateinput}>
              <div className={styles.inputheader}>
                <label htmlFor="endDate">
                  <strong>
                    Event End Date: <span>*</span>
                  </strong>
                </label>
                <ErrorMessage name="endDate">
                  {(message) => <span className={styles.error}>{message}</span>}
                </ErrorMessage>
              </div>
              <Field autoComplete="off" type="datetime-local" name="endDate" />
            </div>
          </div>
          <label className={styles.check}>
            <Field autoComplete="off" type="checkbox" name="commentlock" />
            <strong>Lock Comments?</strong>
          </label>
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
              Post Event!
            </button>
          </span>
        </Form>
      )}
    </Formik>
  )
}
