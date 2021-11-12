import React from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import styles from '@/styles/card.module.css'
import Link from 'next/link'

// Component: OrganizationCard({
// organizer,
// organizationName,
// organizationDescription,
// organizationId,})
// Params: organizer, organizationName, organizationDescription, organizationId
// Purpose: Display each organization as an individual "card"
// See ListOrganizations component

export default function OrganizationCard({
  organizer,
  organizationName,
  organizationDescription,
  organizationId,
}) {
  const { data: session } = useSession()

  const deleteOrganization = async (event) => {
    if (session) {
      const res = await fetch('/api/organizations/orgdelete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ organizationData: organizationId }),
      })
      await res.json()
      // wait for status from orgdelete endpoint to post success toast
      if (res.status === 200) {
        toast.success('Deleted organization.')
      } else {
        toast.error('Uh oh. Something went wrong.')
      }
    }
  }

  return (
    // Link is used to route each card to a dynamic page
    // listing all details for that specific organization
    <div className={styles.card}>
      <Link href={`/organizations/${organizationName}`} passHref>
        <div className={styles.orgheader}>
          <h3 className={styles.organizationName}>{organizationName}</h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={styles.linkIcon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="5"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </div>
      </Link>
      <h4 className={styles.organizationDescription}>
        {organizationDescription}
      </h4>
      <p className={styles.organizer}>{organizer}</p>
      {/* Checks if user is logged in and the user name matches organizer
        Thus, only the logged in user can access the delete function */}
      {session && session.user.name === organizer && (
        <div className={styles.actions}>
          {/* <button className={styles.modify}>Modify</button> */}
          <button onClick={deleteOrganization} className={styles.deleteaction}>
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
