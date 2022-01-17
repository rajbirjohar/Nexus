import React from 'react'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import ImageDropzone from './ImageDropzone'
import toast from 'react-hot-toast'
import styles from '@/styles/form.module.css'

const maxLength = 750

interface Event {
  creator: string
  email: string
  organizationName: string
  organizationId: string
  _eventName: string
  _eventDetails: string
  _eventStartDate: string
  _eventEndDate: string
  _eventImage: string
}

export default function EventForm({
  creator,
  email,
  organizationName,
  organizationId,
}) {
  const initialValues: Event = {
    creator: creator,
    email: email,
    organizationName: organizationName,
    organizationId: organizationId,
    _eventName: '',
    _eventDetails: '',
    _eventStartDate: '',
    _eventEndDate: '',
    _eventImage: '',
  }

  const sendData = async (newEventData) => {
    const response = await fetch('/api/events/eventcreate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newEventData: newEventData }),
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
    return data.newEventData
  }
  return (
    <>
      <p>
        You can create new events using the form below. The date input requires
        a 12 hour time as well. Once you submit this form, your event will show
        up on the Events page and will automatically hide once the end date has
        been reached.
      </p>
      <Formik
        validateOnBlur={false}
        initialValues={initialValues}
        validate={(values: Event) => {
          let errors: FormikErrors<Event> = {}
          if (!values._eventName) {
            errors._eventName = 'Required'
          }
          if (!values._eventDetails) {
            errors._eventDetails = 'Required'
          }
          if (!values._eventStartDate) {
            errors._eventStartDate = 'Required'
          }
          if (!values._eventEndDate) {
            errors._eventEndDate = 'Required'
          } else if (
            new Date(values._eventEndDate) < new Date(values._eventStartDate)
          ) {
            errors._eventEndDate = 'End date is before start date'
          } else if (new Date(values._eventEndDate) < new Date()) {
            errors._eventEndDate = 'End date has passed'
          }
          if (!values._eventImage) {
            errors._eventImage = 'Required'
          }
          return errors
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          console.log(values._eventImage)
          sendData(values)
          resetForm({
            values: {
              creator: creator,
              email: email,
              organizationName: organizationName,
              organizationId: organizationId,
              _eventName: '',
              _eventDetails: '',
              _eventStartDate: '',
              _eventEndDate: '',
              _eventImage: '',
            },
          })
          setSubmitting(false)
        }}
      >
        {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <div className={styles.inputheader}>
              <label htmlFor="_eventName">
                <strong>Event Name:</strong>
              </label>
              <ErrorMessage name="_eventName">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              name="_eventName"
              type="text"
              placeholder="Scotty's Birthday"
            />
            <div className={styles.inputheader}>
              <label htmlFor="_eventDetails">
                <strong>Event Details:</strong>
              </label>
              <ErrorMessage name="_eventDetails">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              name="_eventDetails"
              component="textarea"
              rows="3"
              placeholder="Scotty's Birthday Details"
              maxLength={maxLength}
            />
            <span className={styles.maxlength}>
              {maxLength - values._eventDetails.length}/{maxLength}
            </span>
            <div className={styles.inputheader}>
              <label htmlFor="_eventStartDate">
                <strong>Event Start Date:</strong>
              </label>
              <ErrorMessage name="_eventStartDate">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              type="datetime-local"
              name="_eventStartDate"
            />
            <div className={styles.inputheader}>
              <label htmlFor="_eventEndDate">
                <strong>Event End Date:</strong>
              </label>
              <ErrorMessage name="_eventEndDate">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              type="datetime-local"
              name="_eventEndDate"
            />
            <div className={styles.inputheader}>
              <label htmlFor="_eventImage">
                <strong>Event Banner:</strong>
              </label>
              <ErrorMessage name="_eventImage">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <ImageDropzone setFieldValue={setFieldValue} name="_eventImage" />
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
    </>
  )
}
