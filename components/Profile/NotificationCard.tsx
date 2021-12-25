import toast from 'react-hot-toast'
import cardstyles from '@/styles/card.module.css'
import formstyles from '@/styles/form.module.css'
import { motion } from 'framer-motion'

const listItems = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.15,
    },
  },
}

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
    <motion.div
      variants={listItems}
      layout="position"
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

      <button onClick={deleteNotif} className={formstyles.deleteicon}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </motion.div>
  )
}
