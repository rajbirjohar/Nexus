import React, { useState } from 'react'
import Page from '@/components/Layout/Page'
import { useSession } from 'next-auth/react'
import { LottieWrapper } from '@/components/LottieWrapper'
import CreatorRoleForm from '@/components/Organizations/CreatorRoleForm'
import OrganizationsForm from '@/components/Organizations/OrganizationsForm'
import ListOrganizations from '@/components/Organizations/ListOrganizations'
import { GreenTip } from '@/components/Layout/Tips'
import styles from '@/styles/organizations.module.css'
import formstyles from '@/styles/form.module.css'
import animationData from '@/lotties/group.json'

export default function OrganizationsPage() {
  const { data: session } = useSession()
  const [displayWarning, setDisplayWarning] = useState(false)

  return (
    <Page
      title="Organizations"
      tip={
        <GreenTip header="Find Your People">
          There is an organization for everyone! Joining an organization or a
          club is a great way to connect and meet new people.
        </GreenTip>
      }
    >
      <div className={styles.hero}>
        <div className={styles.content}>
          <div className={styles.text}>
            <h1>Organizations</h1>
            <p>
              Looking for a specific club or organization? Here you can view
              them all at a glance. Each organization contains all of their own
              events so be sure to check those out 💃.
            </p>
          </div>
          <div className={styles.animationWrapper}>
            <LottieWrapper animationData={animationData} />
          </div>
        </div>
      </div>
      {session &&
        session.user.roles &&
        session.user.roles.includes('student' || 'professor') &&
        !session.user.roles.includes('creator') && (
          <>
            <span className={formstyles.actions}>
              <button
                className={formstyles.primary}
                onClick={() => setDisplayWarning(!displayWarning)}
              >
                Apply for Organizer
              </button>
            </span>
            {displayWarning && (
              <div className={formstyles.warningWrapper}>
                <CreatorRoleForm userId={session.user.id} />
              </div>
            )}
          </>
        )}
      {session && session.user.roles && session.user.roles.includes('precreator') && (
        <>
          <OrganizationsForm />
        </>
      )}
      <ListOrganizations />
    </Page>
  )
}
