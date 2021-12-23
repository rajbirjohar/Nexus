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
              them all at a glance. Each organization contains all of their own
              events so be sure to check those out 💃.
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
                <button className={formstyles.post} type="submit">
                  I Understand
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
