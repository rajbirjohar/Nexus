import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import styles from '@/styles/form.module.css'
import ImageDropzone from '../Dropzone/Dropzone'
import Router, { useRouter } from 'next/router'
import Tiptap from '../Tiptap/Tiptap'

// length of description
const tagLineLength = 250

interface Organization {
  organizerId: string
  organizer: string
  email: string
  _organizationName: string
  _organizationTagline: string
  _organizationDescription: string
  _organizationImage: string
  _organizationWebsite: string
  _organizationInstagram: string
  _organizationFacebook: string
  _organizationTwitter: string
  _organizationSlack: string
  _organizationDiscord: string
}

export default function OrganizationsForm() {
  const { data: session } = useSession()
  const router = useRouter()
  const initialValues: Organization = {
    organizerId: session.user.id,
    organizer: session.user.name,
    email: session.user.email,
    _organizationName: '',
    _organizationTagline: '',
    _organizationDescription: '',
    _organizationImage: '',
    _organizationWebsite: '',
    _organizationInstagram: '',
    _organizationFacebook: '',
    _organizationTwitter: '',
    _organizationSlack: '',
    _organizationDiscord: '',
  }

  const sendData = async (organizationData) => {
    const response = await fetch('/api/organizations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ organizationData: organizationData }),
    })
    const data = await response.json()
    if (response.status === 422) {
      toast.error('This name is taken. Please choose a different one.')
    } else if (response.status === 200) {
      toast.success("You've created your organization!")
      Router.push('/organizations')
    } else if (response.status === 413) {
      toast.error('Image is too big or wrong format.')
    } else {
      toast.error(
        'Uh oh. Something happened. Please contact us if this persists.'
      )
    }
    return data.organizationData
  }

  return (
    <>
      <h3>Create Your Organization</h3>
      <Formik
        validateOnBlur={false}
        initialValues={initialValues}
        validate={(values: Organization) => {
          let errors: FormikErrors<Organization> = {}
          if (!values._organizationName) {
            errors._organizationName = 'Required'
          }
          if (!values._organizationTagline) {
            errors._organizationTagline = 'Required'
          }
          if (!values._organizationDescription) {
            errors._organizationDescription = 'Required'
          }
          if (!values._organizationImage) {
            errors._organizationImage = 'Required'
          }
          return errors
        }}
        onSubmit={(values, { setSubmitting }) => {
          sendData(values)
          setSubmitting(false)
        }}
      >
        {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <div className={styles.inputheader}>
              <label htmlFor="_organizationImage">
                <strong>
                  Profile Thumbnail: <br />
                  <span className={styles.subtitle}>
                    For highest quality, use a square photo
                  </span>
                </strong>
              </label>
              <ErrorMessage name="_organizationImage">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <ImageDropzone
              setFieldValue={setFieldValue}
              name="_organizationImage"
            />
            <div className={styles.inputheader}>
              <label htmlFor="_organizationName">
                <strong>
                  Organization Name: <span>*</span>
                </strong>
              </label>
              <ErrorMessage name="_organizationName">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              type="text"
              name="_organizationName"
              placeholder="Scotty's Club"
            />
            <div className={styles.inputheader}>
              <label htmlFor="_organizationTagline">
                <strong>
                  Organization Tagline: <span>*</span>
                </strong>
              </label>
              <ErrorMessage name="_organizationTagline">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              type="text"
              name="_organizationTagline"
              placeholder="A memorable tagline"
              maxLength={tagLineLength}
            />
            <span className={styles.maxlength}>
              {tagLineLength - values._organizationTagline.length}/
              {tagLineLength}
            </span>
            <div className={styles.inputheader}>
              <label htmlFor="_organizationDescription">
                <strong>
                  Organization Description: <span>*</span>
                </strong>
              </label>
              <ErrorMessage name="_organizationDescription">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Tiptap
              setFieldValue={setFieldValue}
              isSubmitting={isSubmitting}
              name="_organizationDescription"
            />
            <div className={styles.linkwrapper}>
              <div className={styles.linkinput}>
                <div className={styles.inputheader}>
                  <label htmlFor="_organizationWebsite">
                    <strong>Website:</strong>
                  </label>
                  <ErrorMessage name="_organizationWebsite">
                    {(message) => (
                      <span className={styles.error}>{message}</span>
                    )}
                  </ErrorMessage>
                </div>
                <Field
                  autoComplete="off"
                  type="text"
                  name="_organizationWebsite"
                  placeholder="https://scottysclub.org/"
                />
                <div className={styles.inputheader}>
                  <label htmlFor="_organizationInstagram">
                    <strong>Instagram:</strong>
                  </label>
                  <ErrorMessage name="_organizationInstagram">
                    {(message) => (
                      <span className={styles.error}>{message}</span>
                    )}
                  </ErrorMessage>
                </div>
                <Field
                  autoComplete="off"
                  type="text"
                  name="_organizationInstagram"
                  placeholder="https://www.instagram.com/highlandersatscottys/"
                />

                <div className={styles.inputheader}>
                  <label htmlFor="_organizationFacebook">
                    <strong>Facebook:</strong>
                  </label>
                  <ErrorMessage name="_organizationFacebook">
                    {(message) => (
                      <span className={styles.error}>{message}</span>
                    )}
                  </ErrorMessage>
                </div>
                <Field
                  autoComplete="off"
                  type="text"
                  name="_organizationFacebook"
                  placeholder="https://www.facebook.com/groups/highlandersatscottys/"
                />
              </div>
              <div className={styles.linkinput}>
                <div className={styles.inputheader}>
                  <label htmlFor="_organizationTwitter">
                    <strong>Twitter:</strong>
                  </label>
                  <ErrorMessage name="_organizationTwitter">
                    {(message) => (
                      <span className={styles.error}>{message}</span>
                    )}
                  </ErrorMessage>
                </div>
                <Field
                  autoComplete="off"
                  type="text"
                  name="_organizationTwitter"
                  placeholder="https://www.twitter.com/highlandersatscottys/"
                />

                <div className={styles.inputheader}>
                  <label htmlFor="_organizationSlack">
                    <strong>Slack:</strong>
                  </label>
                  <ErrorMessage name="_organizationSlack">
                    {(message) => (
                      <span className={styles.error}>{message}</span>
                    )}
                  </ErrorMessage>
                </div>
                <Field
                  autoComplete="off"
                  type="text"
                  name="_organizationSlack"
                  placeholder="https://www.highlandersatscottys.slack.com"
                />

                <div className={styles.inputheader}>
                  <label htmlFor="_organizationDiscord">
                    <strong>Discord:</strong>
                  </label>
                  <ErrorMessage name="_organizationDiscord">
                    {(message) => (
                      <span className={styles.error}>{message}</span>
                    )}
                  </ErrorMessage>
                </div>
                <Field
                  autoComplete="off"
                  type="text"
                  name="_organizationDiscord"
                  placeholder="https://www.discord.gg/highlandersatscottys/"
                />
              </div>
            </div>

            <span className={styles.actions}>
              <button
                className={styles.primary}
                type="submit"
                disabled={isSubmitting}
              >
                Create{' '}
                {!values._organizationName
                  ? 'Organization'
                  : values._organizationName}
                !
              </button>
            </span>
          </Form>
        )}
      </Formik>
    </>
  )
}
