import Link from 'next/link'
import styles from './card.module.css'

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
  const strippedEventDetails = eventDetails.replace(/(<([^>]+)>)/gi, ' ')
  return (
    <Link href={`/organizations/${organizationName}/${eventId}`} passHref>
      <div id={eventId} className={styles.card}>
        {new Date(endDate) < new Date() && (
          <span className={styles.expired}>Expired</span>
        )}
        <h3 className={styles.title}>{eventName}</h3>
        <p className={styles.author}>
          <strong>By {organizationName}</strong>
        </p>
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
        <p className="clamp-2">{strippedEventDetails}</p>

        {eventTags && (
          <div className={styles.tagwrapper}>
            {eventTags.map((tag) => (
              <span key={tag.id} className={styles.tag}>
                {tag.text}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
