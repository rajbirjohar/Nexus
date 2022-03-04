import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import formstyles from '@/styles/form.module.css'
import { useSession } from 'next-auth/react'

export default function AddMemberForm({ orgId, org }) {
  const { data: session } = useSession()
  const router = useRouter()
  const member = {
    orgId: orgId,
    org: org,
    userId: session.user.id,
    userFirstName: session.user.name || session.user.firstname,
    userLastName: session.user.lastname,
    userEmail: session.user.email,
    role: 'member',
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    sendData(member)
  }
  const sendData = async (memberData) => {
    const response = await fetch('/api/organizations/members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ memberData: memberData }),
    })
    await response.json
    if (response.status === 200) {
      toast.success(`You joined ${org}!`)
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
        <button type="submit" className={formstyles.primary}>
          Join {org}
        </button>
      </span>
    </form>
  )
}
