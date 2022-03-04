import React, { useState } from 'react'
import useSWR from 'swr'
import Loader from '../Layout/Skeleton'
import Fetcher from '@/lib/fetcher'
import EventCard from './EventCard'
import NotFound from '../notFound'
import ErrorFetch from '../Layout/ErrorFetch'
import formstyles from '@/styles/form.module.css'
import cardstyles from '@/styles/card.module.css'
import { SearchIcon } from '../Icons'

export default function ListUserEvents() {
  const { data, error } = useSWR('/api/events/memberevents', Fetcher, {
    refreshInterval: 1000,
  })
  const [searchValue, setSearchValue] = useState('')
  if (error) {
    return <ErrorFetch placeholder="events" />
  }
  if (!data) {
    return (
      <>
        <div className={formstyles.searchwrapper}>
          <input
            autoComplete="off"
            aria-label="Disabled Searchbar"
            type="text"
            disabled
            placeholder="Search by name, club, or details"
            className={formstyles.search}
          />
          <SearchIcon />
        </div>
        <Loader />
      </>
    )
  }
  const filteredEvents = Object(data.events).filter(
    (event) =>
      event.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      event.orgName.toLowerCase().includes(searchValue.toLowerCase()) ||
      event.details.toLowerCase().includes(searchValue.toLowerCase())
  )
  return (
    <div>
      {data.events.length === 0 ? (
        <div className={formstyles.notFound}>
          <p>No events today!</p>
        </div>
      ) : (
        <div className={formstyles.searchwrapper}>
          <input
            autoComplete="off"
            aria-label="Enabled Searchbar"
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search by name, club, or details"
            className={formstyles.search}
          />
          <SearchIcon />
        </div>
      )}

      {!filteredEvents.length && data.events.length !== 0 && (
        <NotFound placeholder="event" />
      )}

      <div className={cardstyles.grid}>
        {filteredEvents.map((event) => (
          <EventCard
            key={event._id}
            org={event.org}
            name={event.name}
            details={event.details}
            eventId={event._id}
            startDate={event.startDate}
            endDate={event.endDate}
            tags={event.tags}
          />
        ))}
      </div>
    </div>
  )
}
