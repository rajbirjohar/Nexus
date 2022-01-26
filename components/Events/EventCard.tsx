import Link from 'next/link'
import cardstyles from '@/styles/card.module.css'

const listItems = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.15,
    },
  },
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
    <Link href={`/organizations/${organizationName}/${eventId}`} passHref>
      <div id={eventId} className={cardstyles.card}>
        {new Date(endDate) < new Date() && (
          <span className={cardstyles.expired}>Expired</span>
        )}
        <h3 className={cardstyles.eventName}>{eventName}</h3>
        <p className={cardstyles.author}>
          <strong>By {organizationName}</strong>
        </p>

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
      </div>
    </Link>
  )
}
