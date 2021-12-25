import React, { useState } from 'react'
import Image from 'next/image'
import useSWR from 'swr'
import Loader from '../Skeleton'
import Fetcher from '@/lib/fetcher'
import EventCard from './EventCard'
import NotFound from '../notFound'
import ErrorFetch from '../ErrorFetch'
import formstyles from '@/styles/form.module.css'
import cardstyles from '@/styles/card.module.css'
import { motion, LayoutGroup } from 'framer-motion'

const list = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

export default function ListUserEvents() {
  const { data, error } = useSWR('/api/events/usereventfetch', Fetcher, {
    refreshInterval: 1000,
  })
  const [searchValue, setSearchValue] = useState('')
  if (error) {
    return <ErrorFetch placeholder="events" />
  }
  if (!data) {
    return (
      <>
        <div className={formstyles.searchWrapper}>
          <input
            autoComplete="off"
            aria-label="Disabled Searchbar"
            type="text"
            disabled
            placeholder="Search by name, club, or details"
            className={formstyles.search}
          />
          <svg className={formstyles.searchIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </svg>
        </div>
        <Loader />
      </>
    )
  }
  const filteredEvents = Object(data.events).filter(
    (event) =>
      event.eventName.toLowerCase().includes(searchValue.toLowerCase()) ||
      event.organizationName
        .toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      event.eventDetails.toLowerCase().includes(searchValue.toLowerCase())
  )
  return (
    <div>
      {data.events.length === 0 ? (
        <div className={formstyles.notFound}>
          <p>Create an event!</p>

          <Image
            src={'/assets/post2.svg'}
            height={300}
            width={300}
            alt="Post Image"
          />
        </div>
      ) : (
        <div className={formstyles.searchWrapper}>
          <input
            autoComplete="off"
            aria-label="Enabled Searchbar"
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search by name, club, or details"
            className={formstyles.search}
          />
          <svg className={formstyles.searchIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </svg>
        </div>
      )}

      {!filteredEvents.length && data.events.length !== 0 && (
        <NotFound placeholder="event" />
      )}

      <motion.div
        variants={list}
        initial="hidden"
        animate="show"
        className={cardstyles.grid}
      >
        {filteredEvents.map((newEvent) => (
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
      </motion.div>
    </div>
  )
}
