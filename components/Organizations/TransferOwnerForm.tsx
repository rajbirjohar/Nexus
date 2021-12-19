import React, { useState } from 'react'
import toast from 'react-hot-toast'
import styles from '@/styles/form.module.css'

export default function TransferOwnerForm({ organizationId }) {
  const [admin, setAdmin] = useState({
    organizationId: organizationId,
    _email: '',
    _emailConfirm: '',
  })
  const handleSubmit = async (event) => {
    event.preventDefault()
    const regex = /\S+@ucr\.edu/
    if (admin._email === '') {
      toast.error('Please fill out the missing field.')
    } else if (!regex.test(admin._email) || !regex.test(admin._emailConfirm)) {
      toast.error('Email format is incorrect. Please try again.')
    } else if (admin._email !== admin._emailConfirm) {
      toast.error('Emails do not match. Please try again.')
    } else {
      sendData(admin)
      setAdmin({ ...admin, _email: '', _emailConfirm: '' })
    }
  }
  const handleChange = (event) => {
    setAdmin({
      ...admin,
      [event.target.name]: event.target.value,
    })
  }
  const sendData = async (adminData) => {
    const response = await fetch('/api/organizations/transferowner', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ adminData: adminData }),
    })
    const data = await response.json()
    if (response.status === 404) {
      toast.error('User does not exist or email is wrong. Please try again.')
    } else if (response.status === 405) {
      toast.error('User must be an admin.')
    } else if (response.status === 403) {
      toast.error('User is already the owner of this org or another one.')
    } else if (response.status === 200) {
      toast.success('Successfully transferred ownership!')
    } else {
      toast.error(
        'Uh oh. Something happened. Please contact us if this persists.'
      )
    }
    return data.adminData
  }
  return (
    <div>
      <h3>Transfer Owner</h3>
      <p>
        This action is irreversible unless the new owner transfer the
        organization back to you. Please ensure this is what you want to do.
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
        <label htmlFor="_emailConfirm">
          <strong>Confirm Email:</strong>
        </label>
        <input
          aria-label="Admin Email Input"
          name="_emailConfirm"
          value={admin._emailConfirm}
          onChange={handleChange}
          type="text"
          placeholder="scotty@ucr.edu"
          className={styles.input}
        />
        <span className={styles.actions}>
          <button type="submit" className={styles.deleteaction}>
            Transfer Owner
          </button>
        </span>
      </form>
    </div>
  )
}
