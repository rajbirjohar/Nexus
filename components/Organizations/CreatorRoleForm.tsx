import React, { useState } from 'react'
import Router from 'next/router'
import { Formik, Form, Field, ErrorMessage, FormikErrors } from 'formik'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import styles from '@/styles/form.module.css'

const listItems = {
  closed: {
    opacity: 0,
    y: -5,
    transition: {
      duration: 0.15,
    },
  },
  open: {
    opacity: 1,
    y: 0,
  },
}

interface Agreement {
  userId: string
  _orgRole: string
}

export default function CreatorRoleForm({ userId }) {
  const initialValues: Agreement = {
    userId: userId,
    _orgRole: '',
  }
  const sendData = async (orgRoleData) => {
    const response = await fetch('/api/users/setcreatorrole', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orgRoleData: orgRoleData }),
    })
    const data = await response.json()
    if (response.status === 200) {
      toast.success("You've set your role!")
      Router.reload()
    } else {
      toast.error(
        'Uh oh. Something happened. Please contact us if this persists.'
      )
    }
  }
  return (
    
      <motion.div variants={listItems}>
        <h3>Before You Create</h3>
        <p>
          <strong>
            We currently only support the creation of{' '}
            <u>one organization per user</u>.
          </strong>
        </p>
        <p>
          <strong>Permissions:</strong>
        </p>
        <p>
          <strong>Creator (You): </strong>This role grants all permissions
          regarding{' '}
          <u>
            club creation/deletion, admin addition/removal, owner transfership,
            event posting, comment moderation, and member viewing
          </u>
          . We strongly recommend the highest ranking officer to be in charge of
          creating the club which they can then add other board members as{' '}
          <u>Admins</u>.
        </p>
        <p>
          <strong>Admin: </strong>This role grants all permissions regarding{' '}
          <u>
            admin addition, event posting, comment moderation, and member
            viewing
          </u>
          .
        </p>
        <p>
          <strong>Member: </strong> Any other user that isn&#39;t already a
          Creator or Admin will be able to join your club as a member. They can
          filter events based on membership status and view your contact
          information.
        </p>
        <p>
          Please enter <strong>&#34;Admin&#34;</strong> if you understand the
          rules and limitations of each role and would like to proceed creating
          your own organization.
        </p>
        <Formik
          validateOnBlur={false}
          initialValues={initialValues}
          validate={(values: Agreement) => {
            let errors: FormikErrors<Agreement> = {}
            if (!values._orgRole) {
              errors._orgRole = 'Required'
            } else if (values._orgRole !== 'Admin') {
              errors._orgRole = 'Wrong answer'
            }
            return errors
          }}
          onSubmit={(values, { setSubmitting }) => {
            sendData(values)
            setSubmitting(false)
          }}
        >
          {({ values, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <div className={styles.inputheader}>
                <label htmlFor="_comment">
                  <strong>Role:</strong>
                </label>
                <ErrorMessage name="_orgRole">
                  {(message) => <span className={styles.error}>{message}</span>}
                </ErrorMessage>
              </div>
              <Field
                autoComplete="off"
                type="text"
                name="_orgRole"
                placeholder="Show your interest!"
                maxLength={10}
              />
              <span className={styles.actions}>
                <button
                  className={styles.primary}
                  type="submit"
                  disabled={isSubmitting}
                >
                  I Understand!
                </button>
              </span>
            </Form>
          )}
        </Formik>
      
    </motion.div>
  )
}
