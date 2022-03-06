import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import formstyles from '@/styles/form.module.css'
import { useSession } from 'next-auth/react'

export default function AddMemberForm({
  orgId,
  org,
  userId,
  firstname,
  lastname,
  email,
  role,
}: Relation) {
  const router = useRouter()
  const member: Relation = {
    orgId: orgId,
    org: org,
    userId: userId,
    firstname: firstname,
    lastname: lastname,
    email: email,
    role: role,
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    sendData(member)
  }
  const sendData = async (memberData: Relation) => {
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
    } else if (response.status === 405) {
      toast.error('You are an admin of this org.')
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
