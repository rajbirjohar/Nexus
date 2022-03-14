import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import styles from '@/styles/form.module.css'
import ImageDropzone from '../Dropzone/Dropzone'
import Router from 'next/router'
import Tiptap from '../Tiptap/Tiptap'

// length of description
const tagLineLength = 280

export default function OrganizationsForm() {
  const { data: session } = useSession()
  const initialValues: Organization = {
    creatorId: session.user.id,
    creatorFirstName: session.user.firstname,
    creatorLastName: session.user.lastname,
    email: session.user.email,
    name: '',
    tagline: '',
    details: '',
    image: '',
    site: '',
    instagram: '',
    facebook: '',
    twitter: '',
    slack: '',
    discord: '',
  }

  const sendData = async (orgData) => {
    const response = await fetch('/api/organizations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orgData: orgData }),
    })
    const data = await response.json()
    if (response.status === 422) {
      toast.error('This name is taken. Please choose a different one.')
    } else if (response.status === 200) {
      toast.success("You've created your organization!")
      // Instead of replace because I think it's due the way we are fetching
      Router.reload()
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
          if (!values.name) {
            errors.name = 'Required'
          } else if (!/^[A-Z0-9 ]*$/i.test(values.name)) {
            errors.name = 'Alphanumeric and spaces only'
          }
          if (!values.tagline) {
            errors.tagline = 'Required'
          }
          if (!values.details) {
            errors.details = 'Required'
          }
          if (!values.image) {
            errors.image = 'Required'
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
              <label htmlFor="image">
                <strong>
                  Profile Thumbnail: <br />
                  <span className={styles.subtitle}>
                    For highest quality, use a square photo
                  </span>
                </strong>
              </label>
              <ErrorMessage name="image">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <ImageDropzone setFieldValue={setFieldValue} name="image" />
            <div className={styles.inputheader}>
              <label htmlFor="name">
                <strong>
                  Name: <span>*</span> <br />
                  <span className={styles.subtitle}>
                    Note, you will not be able to change this later
                  </span>
                </strong>
              </label>
              <ErrorMessage name="name">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              type="text"
              name="name"
              placeholder="Scotty's Club"
            />
            <div className={styles.inputheader}>
              <label htmlFor="tagline">
                <strong>
                  Tagline: <span>*</span>
                </strong>
              </label>
              <ErrorMessage name="tagline">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              type="text"
              name="tagline"
              placeholder="A memorable tagline"
              maxLength={tagLineLength}
            />
            <span className={styles.maxlength}>
              {tagLineLength - values.tagline.length}/{tagLineLength}
            </span>
            <div className={styles.inputheader}>
              <label htmlFor="details">
                <strong>
                  Details: <span>*</span>
                </strong>
              </label>
              <ErrorMessage name="details">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Tiptap setFieldValue={setFieldValue} name="details" />
            <div className={styles.linkwrapper}>
              <div className={styles.linkinput}>
                <div className={styles.inputheader}>
                  <label htmlFor="site">
                    <strong>Website:</strong>
                  </label>
                  <ErrorMessage name="site">
                    {(message) => (
                      <span className={styles.error}>{message}</span>
                    )}
                  </ErrorMessage>
                </div>
                <Field
                  autoComplete="off"
                  type="text"
                  name="site"
                  placeholder="https://scottysclub.org/"
                />
                <div className={styles.inputheader}>
                  <label htmlFor="instagram">
                    <strong>Instagram:</strong>
                  </label>
                  <ErrorMessage name="instagram">
                    {(message) => (
                      <span className={styles.error}>{message}</span>
                    )}
                  </ErrorMessage>
                </div>
                <Field
                  autoComplete="off"
                  type="text"
                  name="instagram"
                  placeholder="https://www.instagram.com/highlandersatscottys/"
                />

                <div className={styles.inputheader}>
                  <label htmlFor="facebook">
                    <strong>Facebook:</strong>
                  </label>
                  <ErrorMessage name="facebook">
                    {(message) => (
                      <span className={styles.error}>{message}</span>
                    )}
                  </ErrorMessage>
                </div>
                <Field
                  autoComplete="off"
                  type="text"
                  name="facebook"
                  placeholder="https://www.facebook.com/groups/highlandersatscottys/"
                />
              </div>
              <div className={styles.linkinput}>
                <div className={styles.inputheader}>
                  <label htmlFor="twitter">
                    <strong>Twitter:</strong>
                  </label>
                  <ErrorMessage name="twitter">
                    {(message) => (
                      <span className={styles.error}>{message}</span>
                    )}
                  </ErrorMessage>
                </div>
                <Field
                  autoComplete="off"
                  type="text"
                  name="twitter"
                  placeholder="https://www.twitter.com/highlandersatscottys/"
                />

                <div className={styles.inputheader}>
                  <label htmlFor="slack">
                    <strong>Slack:</strong>
                  </label>
                  <ErrorMessage name="slack">
                    {(message) => (
                      <span className={styles.error}>{message}</span>
                    )}
                  </ErrorMessage>
                </div>
                <Field
                  autoComplete="off"
                  type="text"
                  name="slack"
                  placeholder="https://www.highlandersatscottys.slack.com"
                />

                <div className={styles.inputheader}>
                  <label htmlFor="discord">
                    <strong>Discord:</strong>
                  </label>
                  <ErrorMessage name="discord">
                    {(message) => (
                      <span className={styles.error}>{message}</span>
                    )}
                  </ErrorMessage>
                </div>
                <Field
                  autoComplete="off"
                  type="text"
                  name="discord"
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
                Create {!values.name ? 'Organization' : values.name}!
              </button>
            </span>
          </Form>
        )}
      </Formik>
    </>
  )
}
