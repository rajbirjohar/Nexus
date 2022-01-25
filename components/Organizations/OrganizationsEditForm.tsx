import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import styles from '@/styles/form.module.css'

export default function OrganizationsEditForm(props) {
  const router = useRouter()
  const { data: session } = useSession()

  // Default values of an organization Object
  const [editOrganization, setEditOrganization] = useState({
    _organizationName: '',
    _organizationTagline: '',
    _organizationDescription: '',
  })
  const handleChange = (event) => {
    setEditOrganization({
      ...editOrganization,
      [event.target.name]: event.target.value,
    })
  }
  return (
    <form className={styles.inputWrapper}>
      <h3>Edit Organization</h3>
      <label htmlFor="_organizationName">
        <strong>Organization Name:</strong>
      </label>
      <input
        aria-label="Organization Name Input"
        name="_organizationName"
        value={editOrganization._organizationName}
        onChange={handleChange}
        type="text"
        placeholder="Cyber"
        className={styles.input}
      />
      <label htmlFor="_organizationTagline">
        <strong>Organization Tagline:</strong>
      </label>
      <input
        aria-label="Organization Tagline Input"
        name="_organizationTagline"
        value={editOrganization._organizationTagline}
        onChange={handleChange}
        type="text"
        placeholder="Hacking since '99"
        className={styles.input}
      />
      <label htmlFor="_organizationDescription">
        <strong>Organization Description:</strong>
      </label>
      <input
        aria-label="Organization Description Input"
        name="_organizationDescription"
        value={editOrganization._organizationDescription}
        onChange={handleChange}
        type="text"
        placeholder="Cyber is a cybersecurity club at UCR!"
        className={styles.input}
      />
    </form>
  )
}
