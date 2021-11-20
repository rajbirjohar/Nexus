import React from 'react'
import { useSession } from 'next-auth/react'
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
  organizationTagline,
  organizationId,
}) {
  const { data: session } = useSession()

  return (
    // Link is used to route each card to a dynamic page
    // listing all details for that specific organization
    <Link href={`/organizations/${organizationId}`} passHref>
      <div className={styles.gridcard}>
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

        <h4 className={styles.organizationTagline}>{organizationTagline}</h4>
      </div>
    </Link>
  )
}
