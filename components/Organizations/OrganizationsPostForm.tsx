import React, { useState } from 'react'
import Router from 'next/router'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import styles from '@/styles/form.module.css'

// length of description
const maxLength = 1000
const tagLineLength = 250

// Component: OrganizationPostForm()
// Purpose: To take in user inputted data and submit it to the database

export default function OrganizationsPostForm() {
  const { data: session } = useSession()

  // Default values of an organization Object
  const [organization, setOrganization] = useState({
    organizerId: session.user.id,
    organizer: session.user.name,
    email: session.user.email,
    _organizationName: '',
    _organizationTagline: '',
    _organizationDescription: '',
  })

  // handleSubmit function
  const handleSubmit = async (event) => {
    // don't redirect the page
    event.preventDefault()
    // check if any text fields are empty
    if (
      organization._organizationName === '' ||
      organization._organizationTagline === '' ||
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
        _organizationTagline: '',
        _organizationDescription: '',
      })
    }
  }

  // handleChange function takes in the user input
  // and sets each value of the organization Object
  // uses the "name" attribute to map it to the event
  // since it is unique which is why we can use the
  // ... spreader and the target.name: target.value
  const handleChange = (event) => {
    setOrganization({
      ...organization,
      [event.target.name]: event.target.value,
    })
  }

  // sendData function sends the data to the orgcreate endpoint
  const sendData = async (organizationData) => {
    const response = await fetch('/api/organizations/orgcreate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ organizationData: organizationData }),
    })
    const data = await response.json()
    if (response.status === 422) {
      toast.error('This name is taken. Please choose a different one.')
    } else if (response.status === 200) {
      Router.reload()
      toast.success("You've created your organization!")
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
        <strong>Organization:</strong>
      </label>
      <input
        aria-label="Organizations Name Input"
        name="_organizationName"
        value={organization._organizationName}
        onChange={handleChange}
        type="text"
        placeholder="Best Club on Campus"
        className={styles.input}
      />
      <label htmlFor="_organizationTagline">
        <strong>Tagline:</strong>
      </label>
      <input
        aria-label="Organizations Tagline Input"
        name="_organizationTagline"
        value={organization._organizationTagline}
        onChange={handleChange}
        placeholder="A memorable Tagline"
        className={styles.input}
        maxLength={tagLineLength}
      />
      <div>
        {tagLineLength - organization._organizationTagline.length}/
        {tagLineLength}
      </div>
      <label htmlFor="_organizationDescription">
        <strong>Description:</strong>
      </label>
      <textarea
        aria-label="Organizations Description Input"
        name="_organizationDescription"
        value={organization._organizationDescription}
        onChange={handleChange}
        placeholder="A very cool Description"
        className={styles.input}
        maxLength={maxLength}
      />
      <div>
        {maxLength - organization._organizationDescription.length}/{maxLength}
      </div>
      <button className={styles.postbutton} type="submit">
        Create Organization
      </button>
    </form>
  )
}
