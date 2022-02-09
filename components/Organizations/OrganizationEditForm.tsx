import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import ImageDropzone from '../ImageDropzone'
import styles from '@/styles/form.module.css'
import toast from 'react-hot-toast'
import Tiptap from '../Tiptap'

const maxLength = 1000
const tagLineLength = 250

interface Organization {
  organizationId: string
  _newOrganizationName: string
  _newOrganizationTagline: string
  _newOrganizationDescription: string
  _newOrganizationWebsite: string
  _newOrganizationInstagram: string
  _newOrganizationFacebook: string
  _newOrganizationTwitter: string
  _newOrganizationSlack: string
  _newOrganizationDiscord: string
  _newOrganizationImage: string | null
  _oldOrganizationImage: string
  _oldImagePublicId: string
}

export default function OrganizationEditForm({
  organizationId,
  _oldOrganizationName,
  _oldOrganizationTagline,
  _oldOrganizationDescription,
  _oldOrganizationWebsite,
  _oldOrganizationInstagram,
  _oldOrganizationFacebook,
  _oldOrganizationTwitter,
  _oldOrganizationSlack,
  _oldOrganizationDiscord,
  _oldOrganizationImage,
  _oldImagePublicId,
}) {
  const initialValues: Organization = {
    organizationId: organizationId,
    _newOrganizationName: _oldOrganizationName,
    _newOrganizationTagline: _oldOrganizationTagline,
    _newOrganizationDescription: _oldOrganizationDescription,
    _newOrganizationWebsite: _oldOrganizationWebsite,
    _newOrganizationInstagram: _oldOrganizationInstagram,
    _newOrganizationFacebook: _oldOrganizationFacebook,
    _newOrganizationTwitter: _oldOrganizationTwitter,
    _newOrganizationSlack: _oldOrganizationSlack,
    _newOrganizationDiscord: _oldOrganizationDiscord,
    _newOrganizationImage: null,
    _oldOrganizationImage: _oldOrganizationImage,
    _oldImagePublicId: _oldImagePublicId,
  }

  const sendData = async (newOrganizationData) => {
    const response = await fetch(`/api/organizations/orgedit`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newOrganizationData: newOrganizationData }),
    })
    const data = await response.json()
    if (response.status === 200) {
      toast.success('Your organization has been edited!')
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
          if (!values._newOrganizationName) {
            errors._newOrganizationName = 'Required'
          }
          if (!values._newOrganizationTagline) {
            errors._newOrganizationTagline = 'Required'
          }
          if (!values._newOrganizationDescription) {
            errors._newOrganizationDescription = 'Required'
          }
          if (
            values._newOrganizationName === _oldOrganizationName &&
            values._newOrganizationTagline === _oldOrganizationTagline &&
            values._newOrganizationDescription ===
              _oldOrganizationDescription &&
            values._newOrganizationWebsite === _oldOrganizationWebsite &&
            values._newOrganizationInstagram === _oldOrganizationInstagram &&
            values._newOrganizationFacebook === _oldOrganizationFacebook &&
            values._newOrganizationTwitter === _oldOrganizationTwitter &&
            values._newOrganizationSlack === _oldOrganizationSlack &&
            values._newOrganizationDiscord === _oldOrganizationDiscord &&
            !values._newOrganizationImage
          ) {
            errors._newOrganizationName = 'You made no changes'
            errors._newOrganizationTagline = 'You made no changes'
            errors._newOrganizationDescription = 'You made no changes'
            errors._newOrganizationWebsite = 'You made no changes'
            errors._newOrganizationInstagram = 'You made no changes'
            errors._newOrganizationFacebook = 'You made no changes'
            errors._newOrganizationTwitter = 'You made no changes'
            errors._newOrganizationSlack = 'You made no changes'
            errors._newOrganizationDiscord = 'You made no changes'
          }
          return errors
        }}
        onSubmit={(values, { setSubmitting }) => {
          sendData(values)
          //console.log(values)
          setSubmitting(false)
        }}
      >
        {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <label htmlFor="_newOrganizationImage">
              <strong>
                Organization Image:{' '}
                <span className={styles.subtitle}>(Optional)</span>
                <br />
                <span className={styles.subtitle}>
                  For highest quality, use a square photo
                </span>
              </strong>
            </label>
            <ImageDropzone
              setFieldValue={setFieldValue}
              name="_newOrganizationImage"
            />
            <div className={styles.inputheader}>
              <label htmlFor="_newOrganizationName">
                <strong>Organization Name:</strong>
              </label>
              <ErrorMessage name="_newOrganizationName">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              name="_newOrganizationName"
              type="text"
              placeholder="Scotty's Club"
              maxLength={50}
            />
            <div className={styles.inputheader}>
              <label htmlFor="_newOrganizationTagline">
                <strong>Organization Tagline:</strong>
              </label>
              <ErrorMessage name="_newOrganizationTagline">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              name="_newOrganizationTagline"
              type="text"
              placeholder="A memorable tagline"
              maxLength={tagLineLength}
            />
            <span className={styles.maxlength}>
              {tagLineLength - values._newOrganizationTagline.length}/
              {tagLineLength}
            </span>
            <div className={styles.inputheader}>
              <label htmlFor="_newOrganizationDescription">
                <strong>Organization Description:</strong>
              </label>
              <ErrorMessage name="_newOrganizationDescription">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            {/*<Field
            autoComplete="off"
            component="textarea"
            name="_newOrganizationDescription"
            placeholder="A very cool description"
            maxLength={maxLength}
          />*/}
            <Tiptap
              setFieldValue={setFieldValue}
              isSubmitting={isSubmitting}
              name="_newOrganizationDescription"
              // Initially, we set it to the old details in initialValues
              oldOrganizationDescription={values._newOrganizationDescription}
            />
            <div className={styles.inputheader}>
              <label htmlFor="_newOrganizationWebsite">
                <strong>Organization Website:
                  {/* <span className={styles.subtitle}> (Optional)</span> */}
                </strong>
              </label>
              <ErrorMessage name="_newOrganizationWebsite">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              name="_newOrganizationWebsite"
              type="text"
              placeholder="https://scottysclub.org/"
              maxLength={50}
            />

            <div className={styles.inputheader}>
              <label htmlFor="_newOrganizationInstagram">
                <strong>Organization Instagram:
                  {/* <span className={styles.subtitle}> (Optional)</span> */}
                </strong>
              </label>
              <ErrorMessage name="_newOrganizationInstagram">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              name="_newOrganizationInstagram"
              type="text"
              placeholder="https://www.instagram.com/highlandersatscottys/"
              maxLength={100}
            />

            <div className={styles.inputheader}>
              <label htmlFor="_newOrganizationFacebook">
                <strong>Organization Facebook:
                  {/* <span className={styles.subtitle}> (Optional)</span> */}
                </strong>
              </label>
              <ErrorMessage name="_newOrganizationFacebook">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              name="_newOrganizationFacebook"
              type="text"
              placeholder="https://www.facebook.com/groups/highlandersatscottys/"
              maxLength={100}
            />

            <div className={styles.inputheader}>
              <label htmlFor="_newOrganizationTwitter">
                <strong>Organization Twitter:
                  {/* <span className={styles.subtitle}> (Optional)</span> */}
                </strong>
              </label>
              <ErrorMessage name="_newOrganizationTwitter">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              name="_newOrganizationTwitter"
              type="text"
              placeholder="https://www.twitter.com/highlandersatscottys/"
              maxLength={100}
            />

            <div className={styles.inputheader}>
              <label htmlFor="_newOrganizationSlack">
                <strong>Organization Slack:
                  {/* <span className={styles.subtitle}> (Optional)</span> */}
                </strong>
              </label>
              <ErrorMessage name="_newOrganizationSlack">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              name="_newOrganizationSlack"
              type="text"
              placeholder="https://www.scottysatucr.slack.com"
              maxLength={100}
            />

            <div className={styles.inputheader}>
              <label htmlFor="_newOrganizationDiscord">
                <strong>Organization Discord:
                  {/* <span className={styles.subtitle}> (Optional)</span> */}
                </strong>
              </label>
              <ErrorMessage name="_newOrganizationDiscord">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              name="_newOrganizationDiscord"
              type="text"
              placeholder="https://www.discord.gg/scottysclub/"
              maxLength={100}
            />

            <span className={styles.actions}>
              <button
                className={styles.secondary}
                type="submit"
                disabled={isSubmitting}
              >
                Edit{' '}
                {!values._newOrganizationName
                  ? 'Organization'
                  : values._newOrganizationName}
                !
              </button>
            </span>
          </Form>
        )}
      </Formik>
    </section>
  )
}
