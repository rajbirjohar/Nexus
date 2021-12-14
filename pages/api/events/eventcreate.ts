import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'
import { getSession } from 'next-auth/react'
const mongodb = require('mongodb')

export default async function createEvent(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  if (session) {
    const {
      newEventData: {
        eventCreator,
        email,
        organizationName,
        organizationId,
        _eventName,
        _eventDetails,
        _eventStartDate,
        _eventEndDate,
      },
    } = req.body
    await db.collection('events').insertOne({
      eventCreator: eventCreator,
      email: email,
      organizationId: new mongodb.ObjectId(organizationId),
      organizationName: organizationName,
      eventName: _eventName,
      eventDetails: _eventDetails,
      eventStartDate: new Date(_eventStartDate),
      eventEndDate: new Date(_eventEndDate),
      createdAt: new Date(),
      comments: [],
    })
    res.status(200).json({ message: 'Successfully posted event.' })
  } else {
    res.status(401).json({
      error: 'Not signed in.',
    })
  }
}
