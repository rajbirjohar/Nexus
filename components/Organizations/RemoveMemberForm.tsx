import Router from 'next/router'
import toast from 'react-hot-toast'
import formstyles from '@/styles/form.module.css'
import { useRouter } from 'next/router'
import { TrashIcon } from '../Icons'

export function RemoveMemberForm({
  memberId,
  organizationId,
  organizationName,
}) {
  const member = { memberId, organizationName, organizationId }
  const router = useRouter()
  const handleSubmit = (event) => {
    event.preventDefault()
    sendData(member)
  }
  const sendData = async (memberData) => {
    const response = await fetch('/api/organizations/memberremove', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ memberData: memberData }),
    })
    await response.json
    if (response.status === 200) {
      toast.success(`You left ${organizationName}.`)
      router.replace(router.asPath)
    } else {
      toast.error(
        'Uh oh, something went wrong. If this persists, please let us know.'
      )
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <span className={formstyles.actions}>
        <button type="submit">Leave {organizationName}</button>
      </span>
    </form>
  )
}

// I'm too lazy to create conditional renders
// Literally the same code as above except for how the delete buttons are displayed
export function RemoveMemberAdminForm({
  memberId,
  organizationId,
  organizationName,
}) {
  const member = { memberId, organizationName, organizationId }
  const router = useRouter()
  const handleSubmit = (event) => {
    event.preventDefault()
    sendData(member)
  }
  const sendData = async (memberData) => {
    const response = await fetch('/api/organizations/memberremove', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ memberData: memberData }),
    })
    await response.json
    if (response.status === 200) {
      toast.success(`You removed this member.`)
      router.replace(router.asPath)
    } else {
      toast.error(
        'Uh oh, something went wrong. If this persists, please let us know.'
      )
    }
  }
  return (
    <button onClick={handleSubmit} className={formstyles.deletemember}>
      <TrashIcon /> Remove
    </button>
  )
}
