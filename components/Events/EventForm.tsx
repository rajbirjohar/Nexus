import React from 'react'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import ImageDropzone from '../Dropzone/Dropzone'
import toast from 'react-hot-toast'
import styles from '@/styles/form.module.css'
import Tiptap from '../Tiptap/Tiptap'
import Tags from '../Tags/Tags'

interface Event {
  orgName: string
  orgId: string
  _name: string
  _details: string
  _startDate: Date
  _endDate: Date
  _image: string
  _tags: [{ id: string; text: string }]
}

export default function EventForm({ orgName, orgId }) {
  const initialValues: Event = {
    orgName: orgName,
    orgId: orgId,
    _name: '',
    _details: '',
    _startDate: new Date(),
    _endDate: new Date(),
    _image: '',
    _tags: [{ id: '', text: '' }],
  }

  const sendData = async (eventData) => {
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
      validate={(values: Event) => {
        let errors: FormikErrors<Event> = {}
        if (!values._name) {
          errors._name = 'Required'
        }
        if (!values._details) {
          errors._details = 'Required'
        }
        if (!values._startDate) {
          errors._startDate = 'Required'
        }
        if (!values._endDate) {
          errors._endDate = 'Required'
        } else if (new Date(values._endDate) < new Date(values._startDate)) {
          errors._endDate = 'End date is before start date'
        } else if (new Date(values._endDate) < new Date()) {
          errors._endDate = 'End date has passed'
        }
        if (values._tags.length > 10) {
          errors._tags = 'Too many tags'
        } else if (
          values._tags.filter((tags) => !/^[a-z0-9]+$/i.test(tags.text))
            .length > 0
        ) {
          errors._tags = 'Alphanumeric characters only'
        }
        return errors
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        sendData(values)
        resetForm({
          values: {
            orgName: orgName,
            orgId: orgId,
            _name: '',
            _details: '',
            _startDate: new Date(),
            _endDate: new Date(),
            _image: '',
            _tags: [{ id: '', text: '' }],
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
                Event Banner:
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
            <label htmlFor="_name">
              <strong>
                Event Name: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="_name">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Field
            autoComplete="off"
            name="_name"
            type="text"
            placeholder="Scotty's Birthday"
          />
          <div className={styles.inputheader}>
            <label htmlFor="_details">
              <strong>
                Event Details: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="_details">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Tiptap setFieldValue={setFieldValue} name="_details" />
          <div className={styles.datewrapper}>
            <div className={styles.dateinput}>
              <div className={styles.inputheader}>
                <label htmlFor="_startDate">
                  <strong>
                    Event Start Date: <span>*</span>
                  </strong>
                </label>
                <ErrorMessage name="_startDate">
                  {(message) => <span className={styles.error}>{message}</span>}
                </ErrorMessage>
              </div>
              <Field
                autoComplete="off"
                type="datetime-local"
                name="_startDate"
              />
            </div>
            <div className={styles.dateinput}>
              <div className={styles.inputheader}>
                <label htmlFor="_endDate">
                  <strong>
                    Event End Date: <span>*</span>
                  </strong>
                </label>
                <ErrorMessage name="_endDate">
                  {(message) => <span className={styles.error}>{message}</span>}
                </ErrorMessage>
              </div>
              <Field autoComplete="off" type="datetime-local" name="_endDate" />
            </div>
          </div>
          <div className={styles.inputheader}>
            <label htmlFor="_tags">
              <strong>Tags:</strong>
            </label>
            <ErrorMessage name="_tags">
              {(message) => <span className={styles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Tags setFieldValue={setFieldValue} name="_tags" />
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
