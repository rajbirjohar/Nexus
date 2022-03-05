import React from 'react'
import toast from 'react-hot-toast'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
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

export default function OpportunityEditForm({
  opId,
  authorId,
  author,
  email,
  name,
  details,
  endDate,
  tags,
  setIsEdit,
  isEdit,
}: Opportunity & Edit) {
  const router = useRouter()
  const initialValues: Opportunity = {
    opId: opId,
    authorId: authorId,
    author: author,
    email: email,
    name: name,
    details: details,
    endDate: zonedTimeToUtc(endDate, 'UTC').toISOString().substring(0,16),
    tags: tags,
  }

  const sendData = async (newOpportunityData) => {
      console.log('start sendData\n')
    const response = await fetch(`/api/opportunities`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newOpportunityData: newOpportunityData }),
    })
    const data = await response.json()
    if (response.status === 200) {
      toast.success('Your opportunity has been edited!')
    } else {
      toast.error(
        'Uh oh. Something happened. Please contact us if this persists.'
      )
    }
    
    console.log('end sendData\n')
    return data.newOpportunityData
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
        } 
        else if (new Date(values.endDate) < new Date()) {
          errors.endDate = 'End date has passed'
        }
        if (
          values.name === name &&
          values.details === details &&
          values.endDate === endDate
        ) {
          errors.name = 'You made no changes'
          errors.details = 'You made no changes'
          errors.endDate = 'You made no changes'
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
      onSubmit={(values, { setSubmitting }) => {
        sendData(values)
        setIsEdit(!isEdit)
        setSubmitting(false)
      }}
    >
      {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
        <Form onSubmit={handleSubmit}>
          <div className={formstyles.inputheader}>
            <label htmlFor="name">
              <strong>
                Opportunity Name: <span>*</span>
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
            placeholder="Scotty's Internship"
            maxLength={100}
          />
          <div className={formstyles.inputheader}>
            <label htmlFor="details">
              <strong>
                Opportunity Details: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="details">
              {(message) => <span className={formstyles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Tiptap
            setFieldValue={setFieldValue}
            isSubmitting={isSubmitting}
            name="details"
            // Initially, we set it to the old details in initialValues
            oldContent={details}
          />
          <div className={formstyles.datewrapper}>
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
              <Field
                autoComplete="off"
                type="datetime-local"
                name="endDate"
              />
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
          <Tags
            setFieldValue={setFieldValue}
            name="tags"
            oldTags={tags}
          />
          <span className={styles.actions}>
            <button
              className={formstyles.secondary}
              type="submit"
              disabled={isSubmitting}
            >
              Edit Opportunity!
            </button>
          </span>
        </Form>
      )}
    </Formik>
  )
}
