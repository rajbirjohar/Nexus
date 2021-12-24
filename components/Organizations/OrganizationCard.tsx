import React from 'react'
import cardstyles from '@/styles/card.module.css'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Component: OrganizationCard({
// organizer,
// organizationName,
// organizationDescription,
// organizationId,})
// Params: organizer, organizationName, organizationDescription, organizationId
// Purpose: Display each organization as an individual "card"
// See ListOrganizations component

const listItems = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.15,
    },
  },
}

export default function OrganizationCard({
  organizationName,
  organizationTagline,
  organizationId,
}) {
  return (
    // Link is used to route each card to a dynamic page
    // listing all details for that specific organization
    <Link href={`/organizations/${organizationName}`} passHref>
      <motion.div
        variants={listItems}
        className={cardstyles.card}
        layout="position"
      >
        <h3 className={cardstyles.organizationName}>{organizationName}</h3>
        <h4 className={`${cardstyles.organizationTagline} ${'clamp-2'}`}>
          {organizationTagline}
        </h4>
      </motion.div>
    </Link>
  )
}
