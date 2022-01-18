import React from 'react'
import cardstyles from '@/styles/card.module.css'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

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
  organizationImage,
}) {
  return (
    // Link is used to route each card to a dynamic page
    // listing all details for that specific organization
    <Link href={`/organizations/${organizationName}`} passHref>
      <motion.div variants={listItems} className={cardstyles.card}>
        <div className={cardstyles.orgheader}>
          {organizationImage && (
            <Image
              src={organizationImage}
              width={50}
              height={50}
              className={cardstyles.rounded}
              alt="Thumbnail"
            />
          )}
          <h3 className={cardstyles.organizationName}>{organizationName}</h3>
        </div>

        <h4 className={`${cardstyles.organizationTagline} ${'clamp-2'}`}>
          {organizationTagline}
        </h4>
      </motion.div>
    </Link>
  )
}
