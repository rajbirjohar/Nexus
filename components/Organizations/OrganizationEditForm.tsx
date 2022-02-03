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
  _newOrganizationImage: string | null
  _oldOrganizationImage: string
  _oldImagePublicId: string
}

export default function OrganizationEditForm({
  organizationId,
  _oldOrganizationName,
  _oldOrganizationTagline,
  _oldOrganizationDescription,
  _oldOrganizationImage,
  _oldImagePublicId,
}) {
  const initialValues: Organization = {
    organizationId: organizationId,
    _newOrganizationName: _oldOrganizationName,
    _newOrganizationTagline: _oldOrganizationTagline,
    _newOrganizationDescription: _oldOrganizationDescription,
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
          values._newOrganizationDescription === _oldOrganizationDescription &&
          !values._newOrganizationImage
        ) {
          errors._newOrganizationName = 'You made no changes'
          errors._newOrganizationTagline = 'You made no changes'
          errors._newOrganizationDescription = 'You made no changes'
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
  )
}
