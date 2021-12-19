import Link from 'next/link'
import { motion } from 'framer-motion'
import styles from '@/styles/card.module.css'

// Component: CourseCard({courseId, courseName})
// Params: courseId, courseName
// Purpose: Display each course as an individual "card"
// courseId: the ID unique to the course used to
//  parse the courses collection for each course
// courseName: the name of the course displayed
// on each card
// See ListCourses component

const card = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
}

export default function EventCard({
  eventId,
  organizationName,
  eventName,
  eventDetails,
  startDate,
  endDate,
}) {
  return (
    // Link is used to route each card to a dynamic page
    // listing all course review posts for that specific
    // course
    <Link href={`/organizations/${organizationName}/${eventId}`} passHref>
      <motion.div variants={card} id={eventId} className={styles.gridcard}>
        {endDate > new Date() && <span>Expired</span>}
        <h3 className={styles.course}>{eventName}</h3>
        <span className={styles.author}>By {organizationName}</span>
        <p className="clamp-2">{eventDetails}</p>
        <span className={styles.date}>
          {new Date(startDate).toLocaleString('en-US', {
            dateStyle: 'short',
            timeStyle: 'short',
            timeZone: 'GMT',
          })}{' '}
          -{' '}
          {new Date(endDate).toLocaleString('en-US', {
            dateStyle: 'short',
            timeStyle: 'short',
            timeZone: 'GMT',
          })}
        </span>
      </motion.div>
    </Link>
  )
}
