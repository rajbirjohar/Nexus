import Image from 'next/image'
import useSWR from 'swr'
import Loader from '../Skeleton'
import Fetcher from '@/lib/fetcher'
import EventCard from './EventCard'
import formstyles from '@/styles/form.module.css'
import cardstyles from '@/styles/card.module.css'

export default function ListAllEvents() {
  const { data, error } = useSWR('/api/events/eventfetch', Fetcher, {
    refreshInterval: 1000,
  })
  if (error) {
    return (
      <div className={formstyles.serverdown}>
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
      {data.events.length === 0 && (
        <div className={formstyles.noreviews}>
          <p>No new events! Check back later.</p>
          <Image
            src={'/assets/post2.svg'}
            height={300}
            width={300}
            alt="Post Image"
          />
        </div>
      )}
      {data.events.map((newEvent) => (
        <EventCard
          key={newEvent._id}
          eventName={newEvent.eventName}
          eventId={newEvent._id}
          startDate={newEvent.eventStartDate}
          endDate={newEvent.eventEndDate}
        />
      ))}
    </div>
  )
}
