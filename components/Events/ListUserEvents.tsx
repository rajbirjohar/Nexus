import React, { useState } from 'react'
import Loader from '../Layout/Skeleton'
import EventCard from './EventCard'
import ErrorFetch from '../Layout/ErrorFetch'
import formstyles from '@/styles/form.module.css'
import cardstyles from '@/styles/card.module.css'
import { SearchIcon } from '../Icons'
import { useEventsPages } from '@/hooks/useEventsPage'
import { DebounceInput } from 'react-debounce-input'

export default function ListUserEvents() {
  const [search, setSearch] = useState('')
  const { data, error, size, setSize, isLoadingMore, isReachingEnd } =
    useEventsPages({
      route: '/api/events/memberevents',
      event: search,
    })

  const events = data
    ? data.reduce((acc, val) => [...acc, ...val.events], [])
    : []

  if (error) {
    return <ErrorFetch placeholder="events" />
  }

  return (
    <section>
      <div className={formstyles.searchwrapper}>
        {/* So we don't blow up our db connections */}
        <DebounceInput
          minLength={2}
          debounceTimeout={300}
          autoComplete="off"
          aria-label="Enabled Searchbar"
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by club, details, or tags"
          className={formstyles.search}
        />
        <SearchIcon />
      </div>
      <div className={cardstyles.grid}>
        {events.map((event) => (
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
      {isLoadingMore ? (
        <Loader />
      ) : isReachingEnd ? (
        <p className={formstyles.end}>You&#39;ve reached the end 🎉</p>
      ) : (
        <span className={formstyles.load}>
          <button disabled={isLoadingMore} onClick={() => setSize(size + 1)}>
            Load more
          </button>
        </span>
      )}
    </section>
  )
}
