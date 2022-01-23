import React from 'react'
import toast from 'react-hot-toast'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import ImageDropzone from './ImageDropzone'
import styles from '@/styles/form.module.css'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'

const maxLength = 750

interface Event {
  eventId: string
  _newEventName: string
  _newEventDetails: string
  _newEventStartDate: string
  _newEventEndDate: string
  _newEventImage: string
}

export default function EventEditForm({
  eventId,
  _oldEventName,
  _oldEventDetails,
  _oldEventStartDate,
  _oldEventEndDate,
  _oldEventImage,
  onHandleChange,
}) {
  const { data: session } = useSession()
  const initialValues: Event = {
    eventId: eventId,
    _newEventName: _oldEventName,
    _newEventDetails: _oldEventDetails,
    _newEventStartDate: _oldEventStartDate,
    _newEventEndDate: _oldEventEndDate,
    _newEventImage: _oldEventImage,
  }

  const sendData = async (newEventData) => {
    const response = await fetch(`/api/events/eventedit`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newEventData: newEventData }),
    })
    const data = await response.json()
    if (response.status === 200) {
      toast.success('Your event has been edited!')
    } else {
      toast.error(
        'Uh oh. Something happened. Please contact us if this persists.'
      )
    }
    return data.eventData
  }
  return (
    <motion.div
      layout="position"
      animate={{ opacity: 1, x: 0 }}
      initial={{ opacity: 0, x: -5 }}
      exit={{ opacity: 0, x: 5 }}
      transition={{ duration: 0.15 }}
    >
      <Formik
        validateOnBlur={false}
        initialValues={initialValues}
        validate={(values: Event) => {
          let errors: FormikErrors<Event> = {}
          if (!values._newEventName) {
            errors._newEventName = 'Required'
          }
          if (!values._newEventDetails) {
            errors._newEventDetails = 'Required'
          }
          if (!values._newEventStartDate) {
            errors._newEventStartDate = 'Required'
          }
          if (!values._newEventEndDate) {
            errors._newEventEndDate = 'Required'
          } else if (
            new Date(values._newEventEndDate) <
            new Date(values._newEventStartDate)
          ) {
            errors._newEventEndDate = 'End date is before start date'
          } else if (new Date(values._newEventEndDate) < new Date()) {
            errors._newEventEndDate = 'End date has passed'
          }
          if (!values._newEventImage) {
            errors._newEventImage = 'Required'
          }
          if (
            values._newEventName === _oldEventName &&
            values._newEventDetails === _oldEventDetails &&
            values._newEventStartDate === _oldEventStartDate &&
            values._newEventEndDate === _oldEventEndDate &&
            values._newEventImage === _oldEventImage
          ) {
            errors._newEventName = 'You made no changes'
            errors._newEventDetails = 'You made no changes'
            errors._newEventStartDate = 'You made no changes'
            errors._newEventEndDate = 'You made no changes'
            errors._newEventImage = 'You made no changes'
          }
          return errors
        }}
        onSubmit={(values, { setSubmitting }) => {
          sendData(values)
          !onHandleChange()
          setSubmitting(false)
        }}
      >
        {/* NOTE: No animation for edit form */}
        {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <div className={styles.inputheader}>
              <label htmlFor="_newEventName">
                <strong>Event Name:</strong>
              </label>
              <ErrorMessage name="_newEventName">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              name="_newEventName"
              type="text"
              placeholder="Scotty's Birthday"
            />
            <div className={styles.inputheader}>
              <label htmlFor="_newEventDetails">
                <strong>Event Details:</strong>
              </label>
              <ErrorMessage name="_newEventDetails">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              name="_newEventDetails"
              component="textarea"
              rows="3"
              placeholder="Scotty's Birthday Details"
              maxLength={maxLength}
            />
            <span className={styles.maxlength}>
              {maxLength - values._newEventDetails.length}/{maxLength}
            </span>
            <div className={styles.inputheader}>
              <label htmlFor="_newEventStartDate">
                <strong>Event Start Date:</strong>
              </label>
              <ErrorMessage name="_newEventStartDate">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              type="datetime-local"
              name="_newEventStartDate"
            />
            <div className={styles.inputheader}>
              <label htmlFor="_newEventEndDate">
                <strong>Event End Date:</strong>
              </label>
              <ErrorMessage name="_newEventEndDate">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              type="datetime-local"
              name="_newEventEndDate"
            />
            <div className={styles.inputheader}>
              <label htmlFor="_newEventImage">
                <strong>Event Banner:</strong>
              </label>
              <ErrorMessage name="_newEventImage">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <ImageDropzone
              setFieldValue={setFieldValue}
              name="_newEventImage"
            />
            <span className={styles.actions}>
              <button
                className={styles.primary}
                type="submit"
                disabled={isSubmitting}
              >
                Edit Event!
              </button>
            </span>
          </Form>
        )}
      </Formik>
    </motion.div>
  )
}
