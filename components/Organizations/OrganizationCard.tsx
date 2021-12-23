import React from 'react'
import cardstyles from '@/styles/card.module.css'
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
  organizationName,
  organizationTagline,
  organizationId,
}) {
  return (
    // Link is used to route each card to a dynamic page
    // listing all details for that specific organization
    <Link href={`/organizations/${organizationName}`} passHref>
      <div className={cardstyles.card}>
        <h3 className={cardstyles.organizationName}>{organizationName}</h3>
        <h4 className={`${cardstyles.organizationTagline} ${'clamp-2'}`}>
          {organizationTagline}
        </h4>
      </div>
    </Link>
  )
}
