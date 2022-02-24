import React from 'react'
import styles from './card.module.css'
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
      <div className={styles.card}>
        <div className={styles.header}>
          {organizationImage && (
            <Image
              src={organizationImage}
              width={50}
              height={50}
              className={styles.thumbnail}
              alt="Thumbnail"
            />
          )}
          <h3 className={`{styles.title} ${'clamp'}`}>{organizationName}</h3>
        </div>
        <h4 className={`${styles.tagline} ${'clamp-2'}`}>
          {organizationTagline}
        </h4>
      </div>
    </Link>
  )
}
