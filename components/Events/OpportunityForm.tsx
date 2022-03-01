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
    authorId: any
    authorName: any
    email: string
    _name: string
    _details: string
    // _opportunityStartDate: Date
    _endDate: Date
    _tags: [{ id: string; text: string }]
}

export default function OpportunityForm({
    authorId,
    authorName,
    email,
}) {
    const { data: session } = useSession()
    const router = useRouter()
    const initialValues: Opportunity = {
        authorId: session.user.id,
        authorName: session.user.name,
        email: session.user.email,
        _name: '',
        _details: '',
        // _opportunityStartDate: new Date(),
        _endDate: new Date(),
        _tags: [{ id: '', text: '' }],
    }

      const sendData = async (newOpportunityData) => {
        console.log('start sendData\n')
        const response = await fetch('/api/opportunities', {
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
        console.log('returning newOpportunityData\n')
        return data.newOpportunityData
      }
      return (
        <Formik
          validateOnBlur={false}
          initialValues={initialValues}
          validate={(values: Opportunity) => {
            let errors: FormikErrors<Opportunity> = {}
            if (!values._name) {
              errors._name = 'Required'
            }
            if (!values._details) {
              errors._details = 'Required'
            }
            // if (!values._opportunityStartDate) {
            //   errors._opportunityStartDate = 'Required'
            // }
            if (!values._endDate) {
              errors._endDate = 'Required'
            // } else if (
            //   new Date(values._opportunityEndDate) < new Date(values._opportunityStartDate)
            // ) {
            //   errors._opportunityEndDate = 'End date is before start date'
            // 
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
            // sendData(values)
            console.log(values)
            resetForm({
              values: {
                authorId: authorId,
                authorName: authorName,
                email: email,
                _name: '',
                _details: '',
                // _opportunityStartDate: new Date(),
                _endDate: new Date(),
                _tags: [{ id: '', text: '' }],
              },
            })
            setSubmitting(false)
          }}
        >
          {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              <div className={styles.inputheader}>
                <label htmlFor="_name">
                  <strong>
                    Opportunity Name: <span>*</span>
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
                placeholder="Scotty's Internship"
              />
              <div className={styles.inputheader}>
                <label htmlFor="_details">
                  <strong>
                    Opportunity Details: <span>*</span>
                  </strong>
                </label>
                <ErrorMessage name="_details">
                  {(message) => <span className={styles.error}>{message}</span>}
                </ErrorMessage>
              </div>
              <Tiptap setFieldValue={setFieldValue} name="_details" />
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
                    <label htmlFor="_endDate">
                      <strong>
                        Application Deadline: <span>*</span>
                      </strong>
                    </label>
                    <ErrorMessage name="_endDate">
                      {(message) => <span className={styles.error}>{message}</span>}
                    </ErrorMessage>
                  </div>
                  <Field
                    autoComplete="off"
                    type="datetime-local"
                    name="_endDate"
                  />
                </div>
              </div>
              {/* <span className={styles.error}>{values._endDate}</span> */}
              {/* <p>{values._endDate} </p> */}
              <div className={styles.inputheader}>
                <label htmlFor="_tags">
                  <strong>Tags:</strong>
                </label>
                <ErrorMessage name="_tags">
                  {(message) => <span className={styles.error}>{message}</span>}
                </ErrorMessage>
              </div>
              <Tags
                setFieldValue={setFieldValue}
                isSubmitting={isSubmitting}
                name="_tags"
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