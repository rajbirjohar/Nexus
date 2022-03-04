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

interface Edit {
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>
  isEdit: boolean
}

interface NewImage {
  newImage: string
}

export default function EventEditForm({
  eventId,
  name,
  details,
  startDate,
  endDate,
  image,
  imagePublicId,
  commentlock,
  tags,
  setIsEdit,
  isEdit,
}: OrgEvent & Edit) {
  const router = useRouter()
  const initialValues: OrgEvent & NewImage = {
    eventId: eventId,
    name: name,
    details: details,
    // Need to convert so it displays properly in the input
    startDate: zonedTimeToUtc(startDate, 'UTC').toISOString().substring(0, 16),
    endDate: zonedTimeToUtc(endDate, 'UTC').toISOString().substring(0, 16),
    newImage: null,
    commentlock: commentlock,
    tags: tags,
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
        if (
          values.name === name &&
          values.details === details &&
          values.startDate === startDate &&
          values.endDate === endDate
        ) {
          errors.name = 'You made no changes'
          errors.details = 'You made no changes'
          errors.startDate = 'You made no changes'
          errors.endDate = 'You made no changes'
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
      onSubmit={(values, { setSubmitting }) => {
        sendData(values)
        setIsEdit(!isEdit)
        setSubmitting(false)
      }}
    >
      {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
        <Form onSubmit={handleSubmit}>
          <label htmlFor="newImage">
            <strong>
              Event Banner:
              <br />
              <span className={formstyles.subtitle}>
                For highest quality, use a rectangular photo
              </span>
            </strong>
          </label>
          <ImageDropzone setFieldValue={setFieldValue} name="newImage" />
          <div className={formstyles.inputheader}>
            <label htmlFor="name">
              <strong>
                Event Name: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="name">
              {(message) => <span className={formstyles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Field
            autoComplete="off"
            name="name"
            type="text"
            placeholder="Scotty's Birthday"
          />
          <div className={formstyles.inputheader}>
            <label htmlFor="details">
              <strong>
                Event Details: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="details">
              {(message) => <span className={formstyles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Tiptap
            setFieldValue={setFieldValue}
            name="details"
            oldContent={values.details}
          />
          <div className={formstyles.datewrapper}>
            <div className={formstyles.dateinput}>
              <div className={formstyles.inputheader}>
                <label htmlFor="startDate">
                  <strong>
                    Event Start Date: <span>*</span>
                  </strong>
                </label>
                <ErrorMessage name="startDate">
                  {(message) => (
                    <span className={formstyles.error}>{message}</span>
                  )}
                </ErrorMessage>
              </div>
              <Field
                autoComplete="off"
                type="datetime-local"
                name="startDate"
              />
            </div>
            <div className={formstyles.dateinput}>
              <div className={formstyles.inputheader}>
                <label htmlFor="endDate">
                  <strong>
                    Event End Date: <span>*</span>
                  </strong>
                </label>
                <ErrorMessage name="endDate">
                  {(message) => (
                    <span className={formstyles.error}>{message}</span>
                  )}
                </ErrorMessage>
              </div>
              <Field autoComplete="off" type="datetime-local" name="endDate" />
            </div>
          </div>
          <label className={formstyles.check}>
            <Field autoComplete="off" type="checkbox" name="commentlock" />
            <strong>Lock Comments?</strong>
          </label>
          <div className={formstyles.inputheader}>
            <label htmlFor="tags">
              <strong>Tags:</strong>
            </label>
            <ErrorMessage name="tags">
              {(message) => <span className={formstyles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Tags setFieldValue={setFieldValue} name="tags" oldTags={tags} />
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
