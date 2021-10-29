import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import styles from '@/styles/reviewposts.module.css'

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
    <div className={styles.card}>
      <p>Organization Name: {organizationName}</p>
      <p>Organization Description: {organizationDescription}</p>
      <p>Organizer: {organizer}</p>
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
  )
}
