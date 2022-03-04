import React from 'react'
import toast from 'react-hot-toast'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import ImageDropzone from '../Dropzone/Dropzone'
import formstyles from '@/styles/form.module.css'
import styles from '@/styles/events.module.css'
import Tiptap from '../Tiptap/Tiptap'
import Tags from '../Tags/Tags'
import { useRouter } from 'next/router'
import { zonedTimeToUtc } from 'date-fns-tz'

interface Event {
  eventId: string
  _name: string
  _details: string
  _startDate: string
  _endDate: string
  _newImage: string | null
  _tags: [{ id: string; text: string }]
  image: string
  imagePublicId: string
}

export default function EventEditForm({
  eventId,
  name,
  details,
  startDate,
  endDate,
  image,
  imagePublicId,
  tags,
  onHandleChange,
}) {
  const router = useRouter()
  const initialValues: Event = {
    eventId: eventId,
    _name: name,
    _details: details,
    // Time = :(
    _startDate: zonedTimeToUtc(startDate, 'UTC').toISOString().substring(0, 16),
    _endDate: zonedTimeToUtc(endDate, 'UTC').toISOString().substring(0, 16),
    _newImage: null,
    _tags: tags,
    image: image,
    imagePublicId: imagePublicId,
  }

  const sendData = async (eventData) => {
    const response = await fetch(`/api/events`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ eventData: eventData }),
    })
    const data = await response.json()
    if (response.status === 200) {
      toast.success('Your event has been edited!')
      router.replace(router.asPath)
    } else {
      toast.error(
        'Uh oh. Something happened. Please contact us if this persists.'
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
        if (
          values._name === name &&
          values._details === details &&
          values._startDate === startDate &&
          values._endDate === endDate
        ) {
          errors._name = 'You made no changes'
          errors._details = 'You made no changes'
          errors._startDate = 'You made no changes'
          errors._endDate = 'You made no changes'
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
      onSubmit={(values, { setSubmitting }) => {
        sendData(values)
        !onHandleChange()
        setSubmitting(false)
      }}
    >
      {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
        <Form onSubmit={handleSubmit}>
          <label htmlFor="_newImage">
            <strong>
              Event Banner:
              <br />
              <span className={formstyles.subtitle}>
                For highest quality, use a rectangular photo
              </span>
            </strong>
          </label>
          <ImageDropzone setFieldValue={setFieldValue} name="_newImage" />
          <div className={formstyles.inputheader}>
            <label htmlFor="_name">
              <strong>
                Event Name: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="_name">
              {(message) => <span className={formstyles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Field
            autoComplete="off"
            name="_name"
            type="text"
            placeholder="Scotty's Birthday"
          />
          <div className={formstyles.inputheader}>
            <label htmlFor="_details">
              <strong>
                Event Details: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="_details">
              {(message) => <span className={formstyles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Tiptap
            setFieldValue={setFieldValue}
            name="_details"
            oldContent={values._details}
          />
          <div className={formstyles.datewrapper}>
            <div className={formstyles.dateinput}>
              <div className={formstyles.inputheader}>
                <label htmlFor="_startDate">
                  <strong>
                    Event Start Date: <span>*</span>
                  </strong>
                </label>
                <ErrorMessage name="_startDate">
                  {(message) => (
                    <span className={formstyles.error}>{message}</span>
                  )}
                </ErrorMessage>
              </div>
              <Field
                autoComplete="off"
                type="datetime-local"
                name="_startDate"
              />
            </div>
            <div className={formstyles.dateinput}>
              <div className={formstyles.inputheader}>
                <label htmlFor="_endDate">
                  <strong>
                    Event End Date: <span>*</span>
                  </strong>
                </label>
                <ErrorMessage name="_endDate">
                  {(message) => (
                    <span className={formstyles.error}>{message}</span>
                  )}
                </ErrorMessage>
              </div>
              <Field autoComplete="off" type="datetime-local" name="_endDate" />
            </div>
          </div>
          <div className={formstyles.inputheader}>
            <label htmlFor="tags">
              <strong>Tags:</strong>
            </label>
            <ErrorMessage name="tags">
              {(message) => <span className={formstyles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Tags setFieldValue={setFieldValue} name="_tags" oldTags={tags} />
          <span className={styles.actions}>
            <button
              className={formstyles.secondary}
              type="submit"
              disabled={isSubmitting}
            >
              Edit Event!
            </button>
          </span>
        </Form>
      )}
    </Formik>
  )
}
