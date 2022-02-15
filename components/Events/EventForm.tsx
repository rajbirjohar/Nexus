import React from 'react'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import ImageDropzone from '../ImageDropzone'
import toast from 'react-hot-toast'
import styles from '@/styles/form.module.css'
import Tiptap from '../Tiptap'
import Tags from '../Tags'

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
  _eventTags: [{ id: string; text: string }]
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
    _eventTags: [{ id: '', text: '' }],
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
        if (values._eventTags.length > 10) {
          errors._eventTags = 'Too many tags'
        } else if (
          values._eventTags.filter((tags) => !/^[a-z0-9]+$/i.test(tags.text))
            .length > 0
        ) {
          errors._eventTags = 'Alphanumeric characters only'
        }
        return errors
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
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
            _eventTags: [{ id: '', text: '' }],
          },
        })
        setSubmitting(false)
      }}
    >
      {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
        <Form onSubmit={handleSubmit}>
          <div className={styles.inputheader}>
            <label htmlFor="_eventImage">
              <strong>
                Event Banner:{' '}
                <span className={styles.subtitle}>(Optional)</span>
                <br />
                <span className={styles.subtitle}>
                  For highest quality, use a rectangular photo
                </span>
              </strong>
            </label>
            <ErrorMessage name="_eventImage">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <ImageDropzone setFieldValue={setFieldValue} name="_eventImage" />
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
          <Tiptap
            setFieldValue={setFieldValue}
            isSubmitting={isSubmitting}
            name="_eventDetails"
          />
          <div className={styles.datewrapper}>
            <div className={styles.dateinput}>
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
            </div>
            <div className={styles.dateinput}>
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
            </div>
          </div>
          <div className={styles.inputheader}>
            <label htmlFor="_eventTags">
              <strong>Tags:</strong>
            </label>
            <ErrorMessage name="_eventTags">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Tags
            setFieldValue={setFieldValue}
            isSubmitting={isSubmitting}
            name="_eventTags"
          />
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
