import React from 'react'
import cardstyles from '@/styles/card.module.css'
import Link from 'next/link'
import Image from 'next/image'

export default function OrganizationCard({
  organizationName,
  organizationTagline,
  organizationId,
  organizationImage,
}) {
  return (
    <Link href={`/organizations/${organizationName}`} passHref>
      <div className={cardstyles.card}>
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
      </div>
    </Link>
  )
}
