import React from 'react'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import { useSession } from 'next-auth/react'
import Router, { useRouter } from 'next/router'
import ImageDropzone from '../Dropzone/Dropzone'
import toast from 'react-hot-toast'
import styles from '@/styles/form.module.css'
import Tiptap from '../Tiptap/Tiptap'
import Tags from '../Tags/Tags'

interface Opportunity {
    creator: any
    email: string
    _opportunityName: string
    _opportunityDetails: string
    // _opportunityStartDate: Date
    _opportunityEndDate: Date
    _opportunityTags: [{ id: string; text: string }]
}

export default function OpportunityForm({
    creator,
    email,
}) {
    const { data: session } = useSession()
    const router = useRouter()
    const initialValues: Opportunity = {
        creator: session.user.id,
        email: session.user.email,
        _opportunityName: '',
        _opportunityDetails: '',
        // _opportunityStartDate: new Date(),
        _opportunityEndDate: new Date(),
        _opportunityTags: [{ id: '', text: '' }],
    }

    const sendData = async (newOpportunityData) => {
        const response = await fetch('pages/api/opportunities/index.ts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newOpportunityData: newOpportunityData }),
        })
        const data = await response.json()
        if (response.status === 200) {
          toast.success('Your opportunity has been posted!')
        } else if (response.status === 413) {
          toast.error('Image is too big or wrong format.')
        } else {
          toast.error(
            'Uh oh. Something happened. Please contact us if this persists'
          )
        }
        return data.newOpportunityData
      }
      return (
        <Formik
          validateOnBlur={false}
          initialValues={initialValues}
          validate={(values: Opportunity) => {
            let errors: FormikErrors<Opportunity> = {}
            if (!values._opportunityName) {
              errors._opportunityName = 'Required'
            }
            if (!values._opportunityDetails) {
              errors._opportunityDetails = 'Required'
            }
            // if (!values._opportunityStartDate) {
            //   errors._opportunityStartDate = 'Required'
            // }
            if (!values._opportunityEndDate) {
              errors._opportunityEndDate = 'Required'
            // } else if (
            //   new Date(values._opportunityEndDate) < new Date(values._opportunityStartDate)
            // ) {
            //   errors._opportunityEndDate = 'End date is before start date'
            // 
            } else if (new Date(values._opportunityEndDate) < new Date()) {
              errors._opportunityEndDate = 'End date has passed'
            }
            if (values._opportunityTags.length > 10) {
              errors._opportunityTags = 'Too many tags'
            } else if (
              values._opportunityTags.filter((tags) => !/^[a-z0-9]+$/i.test(tags.text))
                .length > 0
            ) {
              errors._opportunityTags = 'Alphanumeric characters only'
            }
            return errors
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            sendData(values)
            resetForm({
              values: {
                creator: creator,
                email: email,
                _opportunityName: '',
                _opportunityDetails: '',
                // _opportunityStartDate: new Date(),
                _opportunityEndDate: new Date(),
                _opportunityTags: [{ id: '', text: '' }],
              },
            })
            setSubmitting(false)
          }}
        >
          {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              <div className={styles.inputheader}>
                <label htmlFor="_opportunityName">
                  <strong>
                    Opportunity Name: <span>*</span>
                  </strong>
                </label>
                <ErrorMessage name="_opportunityName">
                  {(message) => <span className={styles.error}>{message}</span>}
                </ErrorMessage>
              </div>
              <Field
                autoComplete="off"
                name="_opportunityName"
                type="text"
                placeholder="Scotty's Internship"
              />
              <div className={styles.inputheader}>
                <label htmlFor="_opportunityDetails">
                  <strong>
                    Opportunity Details: <span>*</span>
                  </strong>
                </label>
                <ErrorMessage name="_opportunityDetails">
                  {(message) => <span className={styles.error}>{message}</span>}
                </ErrorMessage>
              </div>
              <Tiptap setFieldValue={setFieldValue} name="_opportunityDetails" />
              <div className={styles.datewrapper}>
                {/* <div className={styles.dateinput}>
                  <div className={styles.inputheader}>
                    <label htmlFor="_opportunityStartDate">
                      <strong>
                        Opportunity Start Date: <span>*</span>
                      </strong>
                    </label>
                    <ErrorMessage name="_opportunityStartDate">
                      {(message) => <span className={styles.error}>{message}</span>}
                    </ErrorMessage>
                  </div>
                  <Field
                    autoComplete="off"
                    type="datetime-local"
                    name="_opportunityStartDate"
                  />
                </div> */}
                <div className={styles.dateinput}>
                  <div className={styles.inputheader}>
                    <label htmlFor="_opportunityEndDate">
                      <strong>
                        Application Deadline: <span>*</span>
                      </strong>
                    </label>
                    <ErrorMessage name="_opportunityEndDate">
                      {(message) => <span className={styles.error}>{message}</span>}
                    </ErrorMessage>
                  </div>
                  <Field
                    autoComplete="off"
                    type="datetime-local"
                    name="_opportunityEndDate"
                  />
                </div>
              </div>
              <div className={styles.inputheader}>
                <label htmlFor="_opportunityTags">
                  <strong>Tags:</strong>
                </label>
                <ErrorMessage name="_opportunityTags">
                  {(message) => <span className={styles.error}>{message}</span>}
                </ErrorMessage>
              </div>
              <Tags
                setFieldValue={setFieldValue}
                isSubmitting={isSubmitting}
                name="_opportunityTags"
              />
              <span className={styles.actions}>
                <button
                  className={styles.primary}
                  type="submit"
                  disabled={isSubmitting}
                >
                  Post Opportunity!
                </button>
              </span>
            </Form>
          )}
        </Formik>
      )
}