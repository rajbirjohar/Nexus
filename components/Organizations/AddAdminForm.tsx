import React, { useState } from 'react'
import toast from 'react-hot-toast'
import styles from '@/styles/form.module.css'

export default function AddAdminForm({ organizationId }) {
  const [admin, setAdmin] = useState({
    organizationId: organizationId,
    _email: '',
  })
  const handleSubmit = async (event) => {
    event.preventDefault()
    const regex = /\S+@\S+\.\S+/
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
    const response = await fetch('/api/organizations/adminadd', {
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
      toast.error('User is already an admin.')
    } else if (response.status === 200) {
      toast.success('Successfully added this Admin!')
    } else {
      toast.error(
        'Uh oh. Something happened. Please contact us if this persists.'
      )
    }
    return data.adminData
  }

  return (
    <div>
      <h3>Add an Admin</h3>
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
          <button type="submit" className={styles.postbutton}>
            Add Admin
          </button>
        </span>
      </form>
    </div>
  )
}
