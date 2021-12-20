import Link from 'next/link'
import { motion } from 'framer-motion'
import cardstyles from '@/styles/card.module.css'

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
      <motion.div variants={card} id={eventId} className={cardstyles.card}>
        {endDate > new Date() && <span>Expired</span>}
        <h3 className={cardstyles.course}>{eventName}</h3>
        <span className={cardstyles.author}>
          <strong>By {organizationName}</strong>
        </span>
        <p className="clamp-2">{eventDetails}</p>
        <span className={cardstyles.date}>
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
