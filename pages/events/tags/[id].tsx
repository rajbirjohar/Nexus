import React, { useState } from 'react'
import Page from '@/components/Layout/Page'
import clientPromise from '@/lib/mongodb'
import { useRouter } from 'next/router'
import EventCard from '@/components/Events/EventCard'
import cardstyles from '@/styles/card.module.css'

export default function TagsPage({ eventByTag }) {
  const router = useRouter()
  const { id } = router.query

  return (
    <Page title={id.toString()} tip={null}>
      <h1>Events Tagged with {id}</h1>
      <div className={cardstyles.grid}>
        {eventByTag.map((event) => (
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
    </Page>
  )
}

export async function getServerSideProps(context) {
  const { id } = context.query
  const db = (await clientPromise).db(process.env.MONGODB_DB)
  const eventByTag = await db
    .collection('events')
    .find({
      tags: { id: id, text: id },
    })
    .sort({ eventStartDate: -1 })
    .toArray()

  if (eventByTag.length < 1) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      eventByTag: JSON.parse(JSON.stringify(eventByTag)),
    },
  }
}
