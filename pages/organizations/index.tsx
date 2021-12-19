import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Router from 'next/router'
import toast from 'react-hot-toast'
import Layout from '@/components/Layout'
import { useSession } from 'next-auth/react'
import OrganizationsForm from '@/components/Organizations/OrganizationsForm'
import ListOrganizations from '@/components/Organizations/ListOrganizations'
import styles from '@/styles/organizations.module.css'
import formstyles from '@/styles/form.module.css'

export default function OrganizationsPage() {
  const { data: session } = useSession()
  const [orgRole, setOrgRole] = useState({ _orgRole: '' })
  const [displayWarning, setDisplayWarning] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (orgRole._orgRole === '') {
      toast.error('Please fill out your role.')
    } else if (orgRole._orgRole === 'Admin') {
      sendData(orgRole)
      setOrgRole({ _orgRole: '' })
    } else {
      toast.error('Your input is incorrect. Please try again.')
    }
  }

  const handleChange = (event) => {
    setOrgRole({
      _orgRole: event.target.value,
    })
  }

  const sendData = async (orgRoleData) => {
    const response = await fetch('/api/courses/setrole', {
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
    <Layout>
      <Head>
        <title>Nexus | Organizations</title>
        {/* Change this icon when we have a logo */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section>
        <div className={styles.hero}>
          <div className={styles.content}>
            <h1>Organizations</h1>
            <p>
              Looking for a specific club or organization? Here you can view
              them all at a glance. Each organization contains all of their
              events so be sure to check those out.
            </p>

            {session &&
              session.user.role &&
              session.user.orgRole &&
              session.user.role.includes('student' || 'professor') &&
              session.user.orgRole.includes('none') && (
                <button
                  className={formstyles.apply}
                  onClick={() => setDisplayWarning(!displayWarning)}
                >
                  Apply for Organizer
                </button>
              )}
            {session &&
              session.user.role &&
              session.user.role.includes('none') && (
                <Link href="/profile" passHref>
                  <a>Please verify if you are a student or professor.</a>
                </Link>
              )}
          </div>
          <Image
            src={'/assets/club.svg'}
            width={300}
            height={300}
            alt="Team Image"
          />
        </div>
        {displayWarning && (
          <div className={formstyles.warningWrapper}>
            <span className={formstyles.warningTitle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={formstyles.warningIcon}
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <h4>Warning</h4>
            </span>
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
                club creation/deletion, admin addition/removal, owner
                transfership, event posting, comment moderation, and member
                viewing
              </u>
              . We strongly recommend the highest ranking officer to be in
              charge of creating the club which they can then add other board
              members as <u>Admins</u>.
            </p>
            <p>
              <strong>Admin: </strong>This role grants all permissions regarding{' '}
              <u>
                admin addition, event posting, comment moderation, and member
                viewing.
              </u>
              .
            </p>
            <p>
              <strong>Member: </strong> Any other user that isn&#39;t already a
              Creator or Admin will be able to join your club as a member. They
              can filter events based on membership status and view your contact
              information.
            </p>
            <p>
              Please enter <strong>&#34;Admin&#34;</strong> if you understand
              the rules and limitations of each role and would like to proceed
              creating your own organization.
            </p>
            <form onSubmit={handleSubmit} className={formstyles.inputWrapper}>
              <label htmlFor="_orgRole">
                <strong>Position:</strong>
              </label>
              <input
                aria-label="Org Role Input"
                name="_orgRole"
                value={orgRole._orgRole}
                onChange={handleChange}
                type="text"
                placeholder="Role"
                className={formstyles.input}
              />
              <div className={formstyles.actions}>
                <button className={formstyles.postbutton} type="submit">
                  Set Role
                </button>
              </div>
            </form>
          </div>
        )}
        {session &&
          session.user.orgRole &&
          session.user.orgRole.includes('Admin') &&
          session.user.creatorOfOrg.includes('none') && (
            <>
              <OrganizationsForm />
            </>
          )}
        <ListOrganizations />
      </section>
    </Layout>
  )
}
