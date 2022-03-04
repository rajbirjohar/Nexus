import { useState, useEffect } from 'react'
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikErrors,
  connect,
} from 'formik'
import ImageDropzone from '../Dropzone/Dropzone'
import styles from '@/styles/form.module.css'
import toast from 'react-hot-toast'
import Tiptap from '../Tiptap/Tiptap'
import { useRouter } from 'next/router'

const tagLineLength = 250

interface Organization {
  orgId: string
  _name: string
  _tagline: string
  _details: string
  _site: string
  _instagram: string
  _facebook: string
  _twitter: string
  _slack: string
  _discord: string
  _newImage: string | null
  image: string
  imagePublicId: string
}

export default function OrganizationEditForm({
  orgId,
  name,
  tagline,
  details,
  site,
  instagram,
  facebook,
  twitter,
  slack,
  discord,
  image,
  imagePublicId,
}) {
  const router = useRouter()
  const initialValues: Organization = {
    orgId: orgId,
    _name: name,
    _tagline: tagline,
    _details: details,
    _site: site,
    _instagram: instagram,
    _facebook: facebook,
    _twitter: twitter,
    _slack: slack,
    _discord: discord,
    _newImage: null,
    image: image,
    imagePublicId: imagePublicId,
  }
  const [param, setParams] = useState(name)

  const sendData = async (orgData) => {
    const response = await fetch(`/api/organizations`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orgData: orgData }),
    })
    const data = await response.json()
    if (response.status === 200) {
      toast.success('Your organization has been edited!')
      router.push(`/organizations/${param}/settings`)
    } else if (response.status === 422) {
      toast.error('This name is taken. Please choose a different one.')
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
    <section>
      <h3>Edit Organization</h3>
      <p>
        Changed your mind about your organization details or want to update your
        organization profile picture? Here is where you can do just that.
      </p>
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
          if (
            values._name === name &&
            values._tagline === tagline &&
            values._details === details &&
            values._site === site &&
            values._instagram === instagram &&
            values._facebook === facebook &&
            values._twitter === twitter &&
            values._slack === slack &&
            values._discord === discord &&
            !values._newImage
          ) {
            errors._name = 'You made no changes'
            errors._tagline = 'You made no changes'
            errors._details = 'You made no changes'
            errors._site = 'You made no changes'
            errors._instagram = 'You made no changes'
            errors._facebook = 'You made no changes'
            errors._twitter = 'You made no changes'
            errors._slack = 'You made no changes'
            errors._discord = 'You made no changes'
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
            <label htmlFor="_newImage">
              <strong>
                Organization Image: <br />
                <span className={styles.subtitle}>
                  For highest quality, use a square photo
                </span>
              </strong>
            </label>
            <ImageDropzone setFieldValue={setFieldValue} name="_newImage" />
            <div className={styles.inputheader}>
              <label htmlFor="_name">
                <strong>
                  Organization Name: <span>*</span>
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
              placeholder="Scotty's Club"
              maxLength={50}
            />
            <div className={styles.inputheader}>
              <label htmlFor="_tagline">
                <strong>
                  Organization Tagline: <span>*</span>
                </strong>
              </label>
              <ErrorMessage name="_tagline">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              name="_tagline"
              type="text"
              placeholder="A memorable tagline"
              maxLength={tagLineLength}
            />
            <span className={styles.maxlength}>
              {tagLineLength - values._tagline.length}/{tagLineLength}
            </span>
            <div className={styles.inputheader}>
              <label htmlFor="_details">
                <strong>
                  Organization Description: <span>*</span>
                </strong>
              </label>
              <ErrorMessage name="_details">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Tiptap
              setFieldValue={setFieldValue}
              name="_details"
              oldContent={values._details}
            />
            <div className={styles.linkwrapper}>
              <div className={styles.linkinput}>
                <div className={styles.inputheader}>
                  <label htmlFor="site">
                    <strong>
                      Website:
                      {/* <span className={styles.subtitle}> (Optional)</span> */}
                    </strong>
                  </label>
                  <ErrorMessage name="site">
                    {(message) => (
                      <span className={styles.error}>{message}</span>
                    )}
                  </ErrorMessage>
                </div>
                <Field
                  autoComplete="off"
                  name="site"
                  type="text"
                  placeholder="https://scottysclub.org/"
                  maxLength={50}
                />

                <div className={styles.inputheader}>
                  <label htmlFor="instagram">
                    <strong>
                      Instagram:
                      {/* <span className={styles.subtitle}> (Optional)</span> */}
                    </strong>
                  </label>
                  <ErrorMessage name="instagram">
                    {(message) => (
                      <span className={styles.error}>{message}</span>
                    )}
                  </ErrorMessage>
                </div>
                <Field
                  autoComplete="off"
                  name="instagram"
                  type="text"
                  placeholder="https://www.instagram.com/highlandersatscottys/"
                  maxLength={100}
                />

                <div className={styles.inputheader}>
                  <label htmlFor="facebook">
                    <strong>
                      Facebook:
                      {/* <span className={styles.subtitle}> (Optional)</span> */}
                    </strong>
                  </label>
                  <ErrorMessage name="facebook">
                    {(message) => (
                      <span className={styles.error}>{message}</span>
                    )}
                  </ErrorMessage>
                </div>
                <Field
                  autoComplete="off"
                  name="facebook"
                  type="text"
                  placeholder="https://www.facebook.com/groups/highlandersatscottys/"
                  maxLength={100}
                />
              </div>

              <div className={styles.linkinput}>
                <div className={styles.inputheader}>
                  <label htmlFor="_twitter">
                    <strong>
                      Twitter:
                      {/* <span className={styles.subtitle}> (Optional)</span> */}
                    </strong>
                  </label>
                  <ErrorMessage name="_twitter">
                    {(message) => (
                      <span className={styles.error}>{message}</span>
                    )}
                  </ErrorMessage>
                </div>
                <Field
                  autoComplete="off"
                  name="_twitter"
                  type="text"
                  placeholder="https://www.twitter.com/highlandersatscottys/"
                  maxLength={100}
                />

                <div className={styles.inputheader}>
                  <label htmlFor="_slack">
                    <strong>
                      Slack:
                      {/* <span className={styles.subtitle}> (Optional)</span> */}
                    </strong>
                  </label>
                  <ErrorMessage name="_slack">
                    {(message) => (
                      <span className={styles.error}>{message}</span>
                    )}
                  </ErrorMessage>
                </div>
                <Field
                  autoComplete="off"
                  name="_slack"
                  type="text"
                  placeholder="https://www.scottysatucr.slack.com"
                  maxLength={100}
                />

                <div className={styles.inputheader}>
                  <label htmlFor="_discord">
                    <strong>
                      Discord:
                      {/* <span className={styles.subtitle}> (Optional)</span> */}
                    </strong>
                  </label>
                  <ErrorMessage name="_discord">
                    {(message) => (
                      <span className={styles.error}>{message}</span>
                    )}
                  </ErrorMessage>
                </div>
                <Field
                  autoComplete="off"
                  name="_discord"
                  type="text"
                  placeholder="https://www.discord.gg/scottysclub/"
                  maxLength={100}
                />
              </div>
            </div>
            <span className={styles.actions}>
              <button
                className={styles.secondary}
                type="submit"
                disabled={isSubmitting}
              >
                Edit {!values._name ? 'Organization' : values._name}!
              </button>
            </span>
          </Form>
        )}
      </Formik>
    </section>
  )
}
