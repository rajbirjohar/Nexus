import { format } from 'date-fns'
import Link from 'next/link'
import styles from './card.module.css'

export default function EventCard({
  eventId,
  org,
  name,
  details,
  startDate,
  endDate,
  tags,
}: OrgEvent) {
  // To remove all markdown tags from the details sections
  const strippedEventDetails = details.replace(/(<([^>]+)>)/gi, ' ')
  const [startMonth, startDay, startYear, startHour] = [
    format(new Date(startDate), 'MMM'),
    format(new Date(startDate), 'd'),
    format(new Date(startDate), 'yyyy'),
    format(new Date(startDate), 'hh:mm aaa'),
  ]
  const [endMonth, endDay, endYear, endHour] = [
    format(new Date(endDate), 'MMM'),
    format(new Date(endDate), 'd'),
    format(new Date(endDate), 'yyyy'),
    format(new Date(endDate), 'hh:mm aaa'),
  ]
  return (
    <Link href={`/organizations/${org}/${eventId}`} passHref>
      <div className={styles.card}>
        {new Date(endDate) < new Date() && (
          <span className={styles.expired}>Expired</span>
        )}
        <h3 className={styles.title}>{name}</h3>
        <p className={styles.author}>
          <strong>By {org}</strong>
        </p>
        <time className={styles.date}>
          {/* Always display start month day and time */}
          {startMonth} {startDay} {/* Display year if year != current year */}
          {startYear != format(new Date(), 'yyyy') && <>{startYear}</>} @{' '}
          {startHour} -{' '}
          {/* Display end month and day if start month != end month */}
          {(startMonth != endMonth || startDay != endDay) && (
            <>
              {endMonth} {endDay}{' '}
              {/* Display end year if end year != current year */}
              {endYear != format(new Date(), 'yyyy') && <>{startYear}</>} @{' '}
              {endHour}
            </>
          )}{' '}
          {/* Display end time if start month === end month and start day === end day */}
          {startMonth === endMonth && startDay === endDay && <>{endHour}</>}
        </time>
        <p className="clamp-2">{strippedEventDetails}</p>

        {tags && (
          <div className={styles.tagwrapper}>
            {tags.map((tag) => (
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
