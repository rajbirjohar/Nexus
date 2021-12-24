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
    <div>
      <h3>Delete Organization</h3>
      <p>
        <strong>
          You understand that deleting this organization will delete all posts,
          members, and admins from Nexus never to be seen again 🤯.
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
      <form onSubmit={handleSubmit} className={formstyles.form}>
        <label htmlFor="_Organization">
          <strong>Organization:</strong>
        </label>
        <input
          autoComplete="off"
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
          autoComplete="off"
          aria-label="Organization Input"
          name="_organizationConfirmation"
          value={deleteOrg._organizationConfirmation}
          onChange={handleChange}
          type="text"
          placeholder="Organization"
          className={formstyles.input}
        />
        <span className={formstyles.actions}>
          <button className={formstyles.delete} type="submit">
            Delete Organization
          </button>
        </span>
      </form>
    </div>
  )
}
