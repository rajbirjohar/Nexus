import React from 'react'
import toast from 'react-hot-toast'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import ImageDropzone from '../Dropzone/Dropzone'
import formstyles from '@/styles/form.module.css'
import styles from '@/styles/events.module.css'
import Tiptap from '../Tiptap/Tiptap'
import Tags from '../Tags/Tags'
import { useRouter } from 'next/router'
import { format, formatISO } from 'date-fns'

interface Event {
  eventId: string
  _newEventName: string
  _newEventDetails: string
  _newEventStartDate: string
  _newEventEndDate: string
  _newEventImage: string | null
  _oldEventImage: string
  _oldImagePublicId: string
  _newEventTags: [{ id: string; text: string }]
}

export default function EventEditForm({
  eventId,
  _oldEventName,
  _oldEventDetails,
  _oldEventStartDate,
  _oldEventEndDate,
  _oldEventImage,
  _oldImagePublicId,
  _oldEventTags,
  onHandleChange,
}) {
  const router = useRouter()
  const initialValues: Event = {
    eventId: eventId,
    _newEventName: _oldEventName,
    _newEventDetails: _oldEventDetails,
    // Time = :(
    _newEventStartDate: formatISO(new Date(_oldEventStartDate)).substring(
      0,
      16
    ),
    _newEventEndDate: formatISO(new Date(_oldEventEndDate)).substring(0, 16),
    _newEventImage: null,
    _oldEventImage: _oldEventImage,
    _oldImagePublicId: _oldImagePublicId,
    _newEventTags: _oldEventTags,
  }

  console.log(formatISO(new Date(_oldEventStartDate)))

  // // I control time
  // // Convert UTC time to ISO time but corrected for
  // // local timezone offset
  // function toIsoString(date) {
  //   const tzo = -date.getTimezoneOffset(),
  //     dif = tzo >= 0 ? '+' : '-',
  //     pad = function (num) {
  //       return (num < 10 ? '0' : '') + num
  //     }

  //   return (
  //     date.getFullYear() +
  //     '-' +
  //     pad(date.getMonth() + 1) +
  //     '-' +
  //     pad(date.getDate()) +
  //     'T' +
  //     pad(date.getHours()) +
  //     ':' +
  //     pad(date.getMinutes()) +
  //     ':' +
  //     pad(date.getSeconds()) +
  //     dif +
  //     pad(Math.floor(Math.abs(tzo) / 60)) +
  //     ':' +
  //     pad(Math.abs(tzo) % 60)
  //   )
  // }

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
        if (
          values._newEventName === _oldEventName &&
          values._newEventDetails === _oldEventDetails &&
          values._newEventStartDate === _oldEventStartDate &&
          values._newEventEndDate === _oldEventEndDate
        ) {
          errors._newEventName = 'You made no changes'
          errors._newEventDetails = 'You made no changes'
          errors._newEventStartDate = 'You made no changes'
          errors._newEventEndDate = 'You made no changes'
        }
        if (values._newEventTags.length > 10) {
          errors._newEventTags = 'Too many tags'
        } else if (
          values._newEventTags.filter((tags) => !/^[a-z0-9]+$/i.test(tags.text))
            .length > 0
        ) {
          errors._newEventTags = 'Alphanumeric characters only'
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
          <label htmlFor="_newEventImage">
            <strong>
              Event Banner:
              <br />
              <span className={formstyles.subtitle}>
                For highest quality, use a rectangular photo
              </span>
            </strong>
          </label>
          <ImageDropzone setFieldValue={setFieldValue} name="_newEventImage" />
          <div className={formstyles.inputheader}>
            <label htmlFor="_newEventName">
              <strong>
                Event Name: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="_newEventName">
              {(message) => <span className={formstyles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Field
            autoComplete="off"
            name="_newEventName"
            type="text"
            placeholder="Scotty's Birthday"
          />
          <div className={formstyles.inputheader}>
            <label htmlFor="_newEventDetails">
              <strong>
                Event Details: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="_newEventDetails">
              {(message) => <span className={formstyles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Tiptap
            setFieldValue={setFieldValue}
            isSubmitting={isSubmitting}
            name="_newEventDetails"
            // Initially, we set it to the old details in initialValues
            oldEventDetails={values._newEventDetails}
          />
          <div className={formstyles.datewrapper}>
            <div className={formstyles.dateinput}>
              <div className={formstyles.inputheader}>
                <label htmlFor="_newEventStartDate">
                  <strong>
                    Event Start Date: <span>*</span>
                  </strong>
                </label>
                <ErrorMessage name="_newEventStartDate">
                  {(message) => (
                    <span className={formstyles.error}>{message}</span>
                  )}
                </ErrorMessage>
              </div>
              <Field
                autoComplete="off"
                type="datetime-local"
                name="_newEventStartDate"
              />
            </div>
            <div className={formstyles.dateinput}>
              <div className={formstyles.inputheader}>
                <label htmlFor="_newEventEndDate">
                  <strong>
                    Event End Date: <span>*</span>
                  </strong>
                </label>
                <ErrorMessage name="_newEventEndDate">
                  {(message) => (
                    <span className={formstyles.error}>{message}</span>
                  )}
                </ErrorMessage>
              </div>
              <Field
                autoComplete="off"
                type="datetime-local"
                name="_newEventEndDate"
              />
            </div>
          </div>
          <div className={formstyles.inputheader}>
            <label htmlFor="_newEventTags">
              <strong>Tags:</strong>
            </label>
            <ErrorMessage name="_newEventTags">
              {(message) => <span className={formstyles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Tags
            setFieldValue={setFieldValue}
            name="_newEventTags"
            oldEventTags={_oldEventTags}
          />
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
