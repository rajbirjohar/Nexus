import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import styles from '@/styles/form.module.css'
import ImageDropzone from '../Dropzone/Dropzone'
import Router, { useRouter } from 'next/router'
import Tiptap from '../Tiptap/Tiptap'
import { Organization } from 'types/nexus'

// length of description
const tagLineLength = 250

export default function OrganizationsForm() {
  const router = useRouter()
  const { data: session } = useSession()
  const initialValues: Organization = {
    creatorId: session.user.id,
    creatorFirstName: session.user.name || session.user.firstname,
    creatorLastName: session.user.lastname,
    email: session.user.email,
    _name: '',
    _tagline: '',
    _details: '',
    _image: '',
    _site: '',
    _instagram: '',
    _facebook: '',
    _twitter: '',
    _slack: '',
    _discord: '',
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
      router.replace(router.asPath)
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
          if (!values._name) {
            errors._name = 'Required'
          }
          if (!values._tagline) {
            errors._tagline = 'Required'
          }
          if (!values._details) {
            errors._details = 'Required'
          }
          if (!values._image) {
            errors._image = 'Required'
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
              <label htmlFor="_image">
                <strong>
                  Profile Thumbnail: <br />
                  <span className={styles.subtitle}>
                    For highest quality, use a square photo
                  </span>
                </strong>
              </label>
              <ErrorMessage name="_image">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <ImageDropzone setFieldValue={setFieldValue} name="_image" />
            <div className={styles.inputheader}>
              <label htmlFor="_name">
                <strong>
                  Name: <span>*</span>
                </strong>
              </label>
              <ErrorMessage name="_name">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              type="text"
              name="_name"
              placeholder="Scotty's Club"
            />
            <div className={styles.inputheader}>
              <label htmlFor="_tagline">
                <strong>
                  Tagline: <span>*</span>
                </strong>
              </label>
              <ErrorMessage name="_tagline">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              type="text"
              name="_tagline"
              placeholder="A memorable tagline"
              maxLength={tagLineLength}
            />
            <span className={styles.maxlength}>
              {tagLineLength - values._tagline.length}/{tagLineLength}
            </span>
            <div className={styles.inputheader}>
              <label htmlFor="_details">
                <strong>
                  Details: <span>*</span>
                </strong>
              </label>
              <ErrorMessage name="_details">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Tiptap setFieldValue={setFieldValue} name="_details" />
            <div className={styles.linkwrapper}>
              <div className={styles.linkinput}>
                <div className={styles.inputheader}>
                  <label htmlFor="_site">
                    <strong>Website:</strong>
                  </label>
                  <ErrorMessage name="_site">
                    {(message) => (
                      <span className={styles.error}>{message}</span>
                    )}
                  </ErrorMessage>
                </div>
                <Field
                  autoComplete="off"
                  type="text"
                  name="_site"
                  placeholder="https://scottysclub.org/"
                />
                <div className={styles.inputheader}>
                  <label htmlFor="_instagram">
                    <strong>Instagram:</strong>
                  </label>
                  <ErrorMessage name="_instagram">
                    {(message) => (
                      <span className={styles.error}>{message}</span>
                    )}
                  </ErrorMessage>
                </div>
                <Field
                  autoComplete="off"
                  type="text"
                  name="_instagram"
                  placeholder="https://www.instagram.com/highlandersatscottys/"
                />

                <div className={styles.inputheader}>
                  <label htmlFor="_facebook">
                    <strong>Facebook:</strong>
                  </label>
                  <ErrorMessage name="_facebook">
                    {(message) => (
                      <span className={styles.error}>{message}</span>
                    )}
                  </ErrorMessage>
                </div>
                <Field
                  autoComplete="off"
                  type="text"
                  name="_facebook"
                  placeholder="https://www.facebook.com/groups/highlandersatscottys/"
                />
              </div>
              <div className={styles.linkinput}>
                <div className={styles.inputheader}>
                  <label htmlFor="_twitter">
                    <strong>Twitter:</strong>
                  </label>
                  <ErrorMessage name="_twitter">
                    {(message) => (
                      <span className={styles.error}>{message}</span>
                    )}
                  </ErrorMessage>
                </div>
                <Field
                  autoComplete="off"
                  type="text"
                  name="_twitter"
                  placeholder="https://www.twitter.com/highlandersatscottys/"
                />

                <div className={styles.inputheader}>
                  <label htmlFor="_slack">
                    <strong>Slack:</strong>
                  </label>
                  <ErrorMessage name="_slack">
                    {(message) => (
                      <span className={styles.error}>{message}</span>
                    )}
                  </ErrorMessage>
                </div>
                <Field
                  autoComplete="off"
                  type="text"
                  name="_slack"
                  placeholder="https://www.highlandersatscottys.slack.com"
                />

                <div className={styles.inputheader}>
                  <label htmlFor="_discord">
                    <strong>Discord:</strong>
                  </label>
                  <ErrorMessage name="_discord">
                    {(message) => (
                      <span className={styles.error}>{message}</span>
                    )}
                  </ErrorMessage>
                </div>
                <Field
                  autoComplete="off"
                  type="text"
                  name="_discord"
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
                Create {!values._name ? 'Organization' : values._name}!
              </button>
            </span>
          </Form>
        )}
      </Formik>
    </>
  )
}
