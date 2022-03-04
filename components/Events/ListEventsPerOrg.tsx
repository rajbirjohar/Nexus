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
      {!data.events.length && <p>No events today!</p>}
      {data.events.map((event) => (
        <EventCard
          key={event._id}
          orgName={event.orgName}
          name={event.name}
          details={event.details}
          eventId={event._id}
          startDate={event.startDate}
          endDate={event.endDate}
          tags={event.tags}
        />
      ))}
    </div>
  )
}
