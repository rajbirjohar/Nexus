import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import ImageDropzone from '../Dropzone/Dropzone'
import styles from '@/styles/form.module.css'
import toast from 'react-hot-toast'
import Tiptap from '../Tiptap/Tiptap'

const tagLineLength = 280

interface NewImage {
  newImage: string
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
  const initialValues: Organization & NewImage = {
    orgId: orgId,
    name: name,
    tagline: tagline,
    details: details,
    site: site,
    instagram: instagram,
    facebook: facebook,
    twitter: twitter,
    slack: slack,
    discord: discord,
    newImage: null,
    image: image,
    imagePublicId: imagePublicId,
  }

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
        validate={(values: Organization & NewImage) => {
          let errors: FormikErrors<Organization & NewImage> = {}
          // if (!values.name) {
          //   errors.name = 'Required'
          // }
          if (!values.tagline) {
            errors.tagline = 'Required'
          }
          if (!values.details) {
            errors.details = 'Required'
          }
          if (
            // values.name === name &&
            values.tagline === tagline &&
            values.details === details &&
            values.site === site &&
            values.instagram === instagram &&
            values.facebook === facebook &&
            values.twitter === twitter &&
            values.slack === slack &&
            values.discord === discord &&
            !values.newImage
          ) {
            // errors.name = 'You made no changes'
            errors.tagline = 'You made no changes'
            errors.details = 'You made no changes'
            errors.site = 'You made no changes'
            errors.instagram = 'You made no changes'
            errors.facebook = 'You made no changes'
            errors.twitter = 'You made no changes'
            errors.slack = 'You made no changes'
            errors.discord = 'You made no changes'
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
            <label htmlFor="newImage">
              <strong>
                Organization Image: <br />
                <span className={styles.subtitle}>
                  For highest quality, use a square photo
                </span>
              </strong>
            </label>
            <ImageDropzone setFieldValue={setFieldValue} name="newImage" />
            {/* Don't allow editing org names for now */}
            {/* <div className={styles.inputheader}>
              <label htmlFor="name">
                <strong>
                  Organization Name: <span>*</span>
                </strong>
              </label>
              <ErrorMessage name="name">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              name="name"
              type="text"
              placeholder="Scotty's Club"
              maxLength={50}
            /> */}
            <div className={styles.inputheader}>
              <label htmlFor="tagline">
                <strong>
                  Organization Tagline: <span>*</span>
                </strong>
              </label>
              <ErrorMessage name="tagline">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Field
              autoComplete="off"
              name="tagline"
              type="text"
              placeholder="A memorable tagline"
              maxLength={tagLineLength}
            />
            <span className={styles.maxlength}>
              {tagLineLength - values.tagline.length}/{tagLineLength}
            </span>
            <div className={styles.inputheader}>
              <label htmlFor="details">
                <strong>
                  Organization Description: <span>*</span>
                </strong>
              </label>
              <ErrorMessage name="details">
                {(message) => <span className={styles.error}>{message}</span>}
              </ErrorMessage>
            </div>
            <Tiptap
              setFieldValue={setFieldValue}
              name="details"
              oldContent={values.details}
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
                  <label htmlFor="twitter">
                    <strong>
                      Twitter:
                      {/* <span className={styles.subtitle}> (Optional)</span> */}
                    </strong>
                  </label>
                  <ErrorMessage name="twitter">
                    {(message) => (
                      <span className={styles.error}>{message}</span>
                    )}
                  </ErrorMessage>
                </div>
                <Field
                  autoComplete="off"
                  name="twitter"
                  type="text"
                  placeholder="https://www.twitter.com/highlandersatscottys/"
                  maxLength={100}
                />

                <div className={styles.inputheader}>
                  <label htmlFor="slack">
                    <strong>
                      Slack:
                      {/* <span className={styles.subtitle}> (Optional)</span> */}
                    </strong>
                  </label>
                  <ErrorMessage name="slack">
                    {(message) => (
                      <span className={styles.error}>{message}</span>
                    )}
                  </ErrorMessage>
                </div>
                <Field
                  autoComplete="off"
                  name="slack"
                  type="text"
                  placeholder="https://www.scottysatucr.slack.com"
                  maxLength={100}
                />

                <div className={styles.inputheader}>
                  <label htmlFor="discord">
                    <strong>
                      Discord:
                      {/* <span className={styles.subtitle}> (Optional)</span> */}
                    </strong>
                  </label>
                  <ErrorMessage name="discord">
                    {(message) => (
                      <span className={styles.error}>{message}</span>
                    )}
                  </ErrorMessage>
                </div>
                <Field
                  autoComplete="off"
                  name="discord"
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
                Edit {!values.name ? 'Organization' : values.name}!
              </button>
            </span>
          </Form>
        )}
      </Formik>
    </section>
  )
}
