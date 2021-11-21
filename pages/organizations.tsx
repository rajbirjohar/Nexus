import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Router from 'next/router'
import toast from 'react-hot-toast'
import Layout from '@/components/Layout'
import { useSession } from 'next-auth/react'
import OrganizationsPostForm from '@/components/Organizations/OrganizationsPostForm'
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
      Router.reload()
      toast.success("You've set your role.")
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
              session.user.orgRole &&
              session.user.orgRole.includes('none') && (
                <button
                  className={formstyles.apply}
                  onClick={() => setDisplayWarning(!displayWarning)}
                >
                  Apply for Organizer
                </button>
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
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p>
                <strong>Warning:</strong>
              </p>
            </span>
            <p>
              <strong>
                Please tell us your position in your organization. This will
                help us set the correct permissions for your members. Currently,
                we only support the creation of <u>one organization</u>.
              </strong>
            </p>
            <p>
              <strong>Permissions:</strong>
              <br />
              <strong>Admin: </strong>This role grants all permissions regarding{' '}
              <u>club creation/deletion, event posting, and member viewing</u>.
              This is inline with positions such as President, Vice President,
              Director, etc. We strongly recommend the highest ranking officer
              to be in charge of creating the club which they can then assign
              other board members with thier positions.
            </p>
            <p>
              Please enter <strong>&#34;Admin&#34;</strong> if you satisfy Admin
              requirements.
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
              <div className={styles.actions}>
                <button className={formstyles.setrolebutton} type="submit">
                  Set Role
                </button>
              </div>
            </form>
          </div>
        )}
        {session &&
          session.user.orgRole &&
          session.user.orgRole.includes('Admin') &&
          session.user.adminOfOrg.includes('none') && (
            <>
              <OrganizationsPostForm />
            </>
          )}
        <ListOrganizations />
      </section>
    </Layout>
  )
}
