import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import styles from '@/styles/form.module.css'

export default function Entry({ name, entry, timestamp, entryId }) {
  const { data: session, status } = useSession()

  // Render delete button only if the
  // session user equals the name of the entry
  let match = false
  if (session) {
    if (session.user.name === name) {
      match = true
    }
  }

  return (
    <div>
      <p>
        {entry}
        <br />
        <span className={styles.author}>
          {name} / {timestamp}{' '}
        </span>
      </p>
    </div>
  )
}
