import Image from 'next/image'
import useSWR from 'swr'
import Loader from '../Skeleton'
import Fetcher from '@/lib/fetcher'
import EventCard from './EventCard'
import styles from '@/styles/form.module.css'
import cardstyles from '@/styles/card.module.css'

export default function ListEventsPerOrg({ organizationId }) {
  const { data, error } = useSWR(`/api/events/${organizationId}`, Fetcher, {
    refreshInterval: 1000,
  })
  if (error) {
    return (
      <div className={styles.serverdown}>
        <p>
          Oops. Looks like the reviews are not being fetched right now. If this
          persists, please let us know.
        </p>
        <Image
          src={'/assets/server.svg'}
          height={500}
          width={500}
          alt="Server Down Image"
        />
      </div>
    )
  }
  if (!data) {
    return <Loader />
  }
  return (
    <div className={cardstyles.grid}>
      {data.events.length === 0 && <p>Create your first event!</p>}
      {data.events.map((newEvent) => (
        <EventCard
          key={newEvent._id}
          organizationName={newEvent.organizationName}
          eventName={newEvent.eventName}
          eventDetails={newEvent.eventDetails}
          eventId={newEvent._id}
          startDate={newEvent.eventStartDate}
          endDate={newEvent.eventEndDate}
        />
      ))}
    </div>
  )
}
