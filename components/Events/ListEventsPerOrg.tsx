import useSWR from 'swr'
import Loader from '../Layout/Skeleton'
import Fetcher from '@/lib/fetcher'
import EventCard from './EventCard'
import cardstyles from '@/styles/card.module.css'
import ErrorFetch from '../Layout/ErrorFetch'

export default function ListEventsPerOrg({ organizationId }) {
  const { data, error } = useSWR(`/api/events/${organizationId}`, Fetcher, {
    refreshInterval: 1000,
  })
  if (error) {
    return <ErrorFetch placeholder="events" />
  }
  if (!data) {
    return <Loader />
  }
  return (
    <div className={cardstyles.grid}>
      {data.events.length === 0 && <p>No events today!</p>}
      {data.events.map((newEvent) => (
        <EventCard
          key={newEvent._id}
          organizationName={newEvent.organizationName}
          eventName={newEvent.eventName}
          eventDetails={newEvent.eventDetails}
          eventId={newEvent._id}
          startDate={newEvent.eventStartDate}
          endDate={newEvent.eventEndDate}
          eventTags={newEvent.eventTags}
        />
      ))}
    </div>
  )
}
