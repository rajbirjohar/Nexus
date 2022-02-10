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
  eventTags,
}) {
  // To remove all markdown tags from the details sections
  let strippedEventDetails = eventDetails.replace(/(<([^>]+)>)/gi, ' ')
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
        <p className="clamp-2">{strippedEventDetails}</p>

        {eventTags && (
          <div className={cardstyles.tagwrapper}>
            {eventTags.map((tag) => (
              <span key={tag.id} className={cardstyles.tag}>
                {tag.text}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
