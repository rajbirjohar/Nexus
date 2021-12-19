import React, { useState } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import formstyles from '@/styles/form.module.css'

export default function DeleteOrganization({
  organizationId,
  organizationName,
}) {
  const router = useRouter()
  const [deleteOrg, setDeleteOrg] = useState({
    organizationId: organizationId,
    _organization: '',
    _organizationConfirmation: '',
  })
  const handleSubmit = async (event) => {
    event.preventDefault()
    if (
      deleteOrg._organization === '' ||
      deleteOrg._organizationConfirmation === ''
    ) {
      toast.error('Please fill out your Organization Name.')
    } else if (
      deleteOrg._organization === organizationName &&
      deleteOrg._organizationConfirmation === organizationName
    ) {
      deleteOrganization(deleteOrg)
    } else {
      toast.error('Your input is incorrect. Please try again.')
    }
  }

  const handleChange = (event) => {
    setDeleteOrg({
      ...deleteOrg,
      [event.target.name]: event.target.value,
    })
  }

  const deleteOrganization = async (organizationData) => {
    const res = await fetch('/api/organizations/orgdelete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ organizationData: organizationData }),
    })
    await res.json()
    // wait for status from orgdelete endpoint to post success toast
    if (res.status === 200) {
      router.push('/organizations')
      toast.success('Deleted organization.')
    } else {
      toast.error(
        'Uh oh. Something went wrong. If this persists, please let us know.'
      )
    }
  }
  return (
    <div className={formstyles.warningWrapper}>
      <span className={formstyles.warningTitle}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={formstyles.warningIcon}
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <h4>Warning</h4>
      </span>
      <p>
        <strong>
          You understand that deleting this organization will delete all posts,
          members, and admins from Nexus never to be seen again.
        </strong>
      </p>
      <p>
        <strong>
          If you are completely sure and aware of the consequences, please fill
          out the form below.
        </strong>
      </p>
      <p>
        Please enter <strong>&#34;{organizationName}&#34;</strong> to delete
        this organization.
      </p>
      <form onSubmit={handleSubmit} className={formstyles.inputWrapper}>
        <label htmlFor="_Organization">
          <strong>Organization:</strong>
        </label>
        <input
          aria-label="Organization Input"
          name="_organization"
          value={deleteOrg._organization}
          onChange={handleChange}
          type="text"
          placeholder="Organization"
          className={formstyles.input}
        />
        <label htmlFor="_Organization">
          <strong>Confirm Organization:</strong>
        </label>
        <input
          aria-label="Organization Input"
          name="_organizationConfirmation"
          value={deleteOrg._organizationConfirmation}
          onChange={handleChange}
          type="text"
          placeholder="Organization"
          className={formstyles.input}
        />
        <div className={formstyles.actions}>
          <button className={formstyles.deleteaction} type="submit">
            Delete
          </button>
        </div>
      </form>
    </div>
  )
}
