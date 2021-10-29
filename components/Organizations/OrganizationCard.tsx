import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import styles from '@/styles/organizations.module.css'
import Link from 'next/link'

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
      if (res.status === 200) {
        toast.success('Deleted entry!')
      } else {
        toast.error('Uh oh. Something went wrong.')
      }
    }
  }
  return (
    <Link href={`/organization/${organizationName}`} passHref>
      <div className={styles.card}>
        <p className={styles.organizationName}>{organizationName}</p>
        <h4 className={styles.organizationDescription}>
          {organizationDescription}
        </h4>
        <span className={styles.organizer}>{organizer}</span>
        <br />
        {session && session.user.name === organizer && (
          <>
            {/* <button className={styles.modify}>Modify</button> */}
            <button onClick={deleteOrganization} className={styles.delete}>
              Delete
            </button>
          </>
        )}
      </div>
    </Link>
  )
}