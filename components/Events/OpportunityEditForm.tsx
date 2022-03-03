import React from 'react'
import toast from 'react-hot-toast'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import formstyles from '@/styles/form.module.css'
import styles from '@/styles/events.module.css'
import Tiptap from '../Tiptap/Tiptap'
import Tags from '../Tags/Tags'
import { useRouter } from 'next/router'
import { zonedTimeToUtc } from 'date-fns-tz'

interface Opportunity {
    authorId: string
    author: string
    email: string
    _newName: string
    _newDetails: string
    _newEndDate: Date
    _newTags: [{ id: string; text: string }]
  }

export default function OpportunityEditForm({
  authorId,
  author,
  email,
  _oldName,
  _oldDetails,
  _oldEndDate,
  _oldTags,
  onHandleChange,
}) {
  const router = useRouter()
  const initialValues: Opportunity = {
    authorId: authorId,
    author: author,
    email: email,
    _newName: _oldName,
    _newDetails: _oldDetails,
    _newEndDate: zonedTimeToUtc(_oldEndDate, 'UTC'),
    _newTags: _oldTags,
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
        if (!values._newName) {
          errors._newName = 'Required'
        }
        if (!values._newDetails) {
          errors._newDetails = 'Required'
        }
        if (!values._newEndDate) {
          errors._newEndDate = 'Required'
        } 
        else if (new Date(values._newEndDate) < new Date()) {
          errors._newEndDate = 'End date has passed'
        }
        if (
          values._newName === _oldName &&
          values._newDetails === _oldDetails &&
          values._newEndDate === _oldEndDate
        ) {
          errors._newName = 'You made no changes'
          errors._newDetails = 'You made no changes'
          errors._newEndDate = 'You made no changes'
        }
        if (values._newTags.length > 10) {
          errors._newTags = 'Too many tags'
        } else if (
          values._newTags.filter((tags) => !/^[a-z0-9]+$/i.test(tags.text))
            .length > 0
        ) {
          errors._newTags = 'Alphanumeric characters only'
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
          <div className={formstyles.inputheader}>
            <label htmlFor="_newName">
              <strong>
                Opportunity Name: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="_newName">
              {(message) => <span className={formstyles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Field
            autoComplete="off"
            name="_newName"
            type="text"
            placeholder="Scotty's Internship"
            maxLength={100}
          />
          <div className={formstyles.inputheader}>
            <label htmlFor="_newDetails">
              <strong>
                Opportunity Details: <span>*</span>
              </strong>
            </label>
            <ErrorMessage name="_newDetails">
              {(message) => <span className={formstyles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Tiptap
            setFieldValue={setFieldValue}
            isSubmitting={isSubmitting}
            name="_newDetails"
            // Initially, we set it to the old details in initialValues
            oldContent={_oldDetails}
          />
          <div className={formstyles.datewrapper}>
            <div className={formstyles.dateinput}>
              <div className={formstyles.inputheader}>
                <label htmlFor="_newEndDate">
                  <strong>
                    Event End Date: <span>*</span>
                  </strong>
                </label>
                <ErrorMessage name="_newEndDate">
                  {(message) => (
                    <span className={formstyles.error}>{message}</span>
                  )}
                </ErrorMessage>
              </div>
              <Field
                autoComplete="off"
                type="datetime-local"
                name="_newEndDate"
              />
            </div>
          </div>
          <div className={formstyles.inputheader}>
            <label htmlFor="_newTags">
              <strong>Tags:</strong>
            </label>
            <ErrorMessage name="_newTags">
              {(message) => <span className={formstyles.error}>{message}</span>}
            </ErrorMessage>
          </div>
          <Tags
            setFieldValue={setFieldValue}
            name="_newTags"
            oldTags={_oldTags}
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
