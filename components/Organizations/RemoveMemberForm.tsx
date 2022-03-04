import toast from 'react-hot-toast'
import formstyles from '@/styles/form.module.css'
import { useRouter } from 'next/router'
import { TrashIcon } from '../Icons'

export function RemoveMemberForm({ userId, orgId, org, role }: Relation) {
  const router = useRouter()
  const member = { userId, orgId, role }
  const handleSubmit = (event) => {
    event.preventDefault()
    sendData(member)
  }
  const sendData = async (memberData) => {
    const response = await fetch('/api/organizations/members', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ memberData: memberData }),
    })
    await response.json
    if (response.status === 200) {
      toast.success(`You left ${org}.`)
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
        <button type="submit">Leave {org}</button>
      </span>
    </form>
  )
}

// I'm too lazy to create conditional renders
// Literally the same code as above except for how the delete buttons are displayed
export function RemoveMemberAdminForm({ userId, orgId, org, role }: Relation) {
  const member = { userId, org, orgId, role }
  const router = useRouter()
  const handleSubmit = (event) => {
    event.preventDefault()
    sendData(member)
  }
  const sendData = async (memberData) => {
    const response = await fetch('/api/organizations/members', {
      method: 'DELETE',
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
