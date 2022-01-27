import toast from 'react-hot-toast'
import cardstyles from '@/styles/card.module.css'
import formstyles from '@/styles/form.module.css'

export const NotificationCard = ({ notifId, type, message, createdAt }) => {
  const deleteNotif = async (event) => {
    const response = await fetch(`/api/users/notificationremove`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notifData: notifId }),
    })
    await response.json()
    if (response.status === 200) {
      toast.success('Deleted notification.')
    } else {
      toast.error(
        'Uh oh. Something went wrong. If this persists, please let us know.'
      )
    }
  }
  return (
    <div
      className={
        type === 'success'
          ? `${cardstyles.greennotif}`
          : `${cardstyles.defaultnotif}`
      }
      key={notifId}
    >
      <p className={cardstyles.notifmessage}>
        {message}
        <br />
        <span className={cardstyles.date}>{createdAt}</span>
      </p>

      <button onClick={deleteNotif} className={formstyles.deleteNotif}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  )
}
