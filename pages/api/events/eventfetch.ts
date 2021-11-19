import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'
import { getSession } from 'next-auth/react'

// fetchEvents()
// This endpoint will fetch all of our events
// that that logged in user has submitted
// from our database and place them into an array
// where we can display them using the EventCard(),
// and listAllEvents()

export default async function fetchEvents(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)

  const events = await db
    .collection('events')
    .find({
      eventEndDate: { $gte: new Date() },
    })
    .sort({ eventStartDate: -1 })
    .toArray()
  return res.status(200).json({ events })
}
