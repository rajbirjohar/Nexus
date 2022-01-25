import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import { NotificationCard } from './NotificationCard'
import TimeAgo from 'react-timeago'
import ErrorFetch from '../ErrorFetch'
import cardstyles from '@/styles/card.module.css'
import { motion, LayoutGroup } from 'framer-motion'

const list = {
  hidden: {
    opacity: 1,
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function ListNotifications() {
  const { data, error } = useSWR('/api/users/notificationfetch', fetcher, {
    refreshInterval: 1000,
  })
  if (error) {
    return <ErrorFetch placeholder="notifications" />
  }
  if (!data) {
    return <div className={cardstyles.notifgrid}></div>
  }
  return (
    <motion.div
      variants={list}
      initial="hidden"
      animate="show"
      layout="position"
      className={cardstyles.notifgrid}
    >
      {data.notifications.length === 0 ? null : (
        <>
          {data.notifications.map((notif) => (
            <NotificationCard
              key={notif.notifId}
              notifId={notif.notifId}
              type={notif.notifType}
              message={notif.message}
              createdAt={<TimeAgo date={notif.notifCreatedAt} />}
            />
          ))}
        </>
      )}
    </motion.div>
  )
}
