import toast from 'react-hot-toast'
import styles from '@/styles/form.module.css'

export default function RemoveAdminForm({ admin, adminId, organizationId }) {
  const adminData = { adminId, organizationId }
  const handleSubmit = (event) => {
    event.preventDefault()
    sendData(adminData)
  }
  const sendData = async (adminData) => {
    const response = await fetch('/api/organizations/adminremove', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ adminData: adminData }),
    })
    await response.json
    if (response.status === 200) {
      toast.success(`You removed ${admin}.`)
    } else {
      toast.error(
        'Uh oh, something went wrong. If this persists, please let us know.'
      )
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" className={styles.deletecomment}>
        Remove
      </button>
    </form>
  )
}
