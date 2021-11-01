import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import styles from '@/styles/reviewposts.module.css'

const maxLength = 1000

export default function OrganizationsPostForm(props) {
  const { data: session } = useSession()

  const [organization, setOrganization] = useState({
    organizer: session.user.name,
    email: session.user.email,
    _organizationName: '',
    _organizationDescription: '',
  })

  const handleSubmit = async (event) => {
    // don't redirect the page
    event.preventDefault()
    // check if any text fields are empty
    if (
      organization._organizationName === '' ||
      organization._organizationDescription === ''
    ) {
      toast.error('Please fill out the missing fields.')
    } else {
      // calls sendData() to send our state data to our API
      sendData(organization)
      // clears our inputs after submitting
      setOrganization({
        ...organization,
        _organizationName: '',
        _organizationDescription: '',
      })
    }
  }

  const handleChange = (event) => {
    setOrganization({
      ...organization,
      [event.target.name]: event.target.value,
    })
  }

  const sendData = async (organizationData) => {
    const response = await fetch('/api/organizations/orgcreate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ organizationData: organizationData }),
    })
    const data = await response.json()
    if (response.status === 200) {
      toast.success('You created your organization!')
    } else {
      toast.error(
        'Uh oh. Something happened. Please contact us if this persists.'
      )
    }
    return data.organizationData
  }

  return (
    <form onSubmit={handleSubmit} className={styles.inputWrapper}>
      <label htmlFor="_organizationName">
        <strong>Organizations:</strong>
      </label>
      <input
        aria-label="Organizations Name Input"
        name="_organizationName"
        value={organization._organizationName}
        onChange={handleChange}
        type="text"
        placeholder="Men's Water Polo"
        className={styles.input}
      />
      <label htmlFor="_organizationDescription">
        <strong>Description:</strong>
      </label>
      <textarea
        aria-label="Organizations Description Input"
        name="_organizationDescription"
        value={organization._organizationDescription}
        onChange={handleChange}
        placeholder="Write a description about your Organizations!"
        className={styles.input}
        maxLength={maxLength}
      />
      <div>
        {maxLength - organization._organizationDescription.length}/{maxLength}
      </div>
      <button className={styles.signbutton} type="submit">
        Create Organization
      </button>
    </form>
  )
}
