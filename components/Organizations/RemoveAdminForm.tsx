import React, { useState } from 'react'
import toast from 'react-hot-toast'
import styles from '@/styles/form.module.css'

export default function RemoveAdminForm({ organizationId }) {
  const [admin, setAdmin] = useState({
    organizationId: organizationId,
    _email: '',
  })
  const handleSubmit = async (event) => {
    event.preventDefault()
    const regex = /\S+@ucr\.edu/
    if (admin._email === '') {
      toast.error('Please fill out the missing field.')
    } else if (!regex.test(admin._email)) {
      toast.error('Email format is incorrect. Please try again.')
    } else {
      sendData(admin)
      setAdmin({ ...admin, _email: '' })
    }
  }
  const handleChange = (event) => {
    setAdmin({
      ...admin,
      [event.target.name]: event.target.value,
    })
  }
  const sendData = async (adminData) => {
    const response = await fetch('/api/organizations/adminremove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ adminData: adminData }),
    })
    const data = await response.json()
    if (response.status === 404) {
      toast.error('User does not exist or email is wrong. Please try again.')
    } else if (response.status === 403) {
      toast.error('You cannot remove yourself until you transfer ownership.')
    } else if (response.status === 200) {
      toast.success('Successfully removed this Admin.')
    } else {
      toast.error(
        'Uh oh. Something happened. Please contact us if this persists.'
      )
    }
    return data.adminData
  }
  return (
    <div>
      <h3>Remove an Admin</h3>
      <p>
        This person will no longer have access to admin roles for this
        organization. You or another admin will have to re-add them if you
        change your mind.
      </p>
      <form onSubmit={handleSubmit} className={styles.inputWrapper}>
        <label htmlFor="_email">
          <strong>Email:</strong>
        </label>
        <input
          aria-label="Admin Email Input"
          name="_email"
          value={admin._email}
          onChange={handleChange}
          type="text"
          placeholder="scotty@ucr.edu"
          className={styles.input}
        />
        <span className={styles.actions}>
          <button type="submit" className={styles.deleteaction}>
            Remove Admin
          </button>
        </span>
      </form>
    </div>
  )
}
