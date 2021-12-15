import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'
import { getSession } from 'next-auth/react'
const mongodb = require('mongodb')

export default async function deleteEvent(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  if (session) {
    const { eventData: eventId } = req.body
    const result = await db.collection('events').deleteOne({
      _id: new mongodb.ObjectId(eventId),
    })
    res.status(200).json(result.deletedCount)
  } else {
    res.status(401).json({
      error: 'Not signed in',
    })
  }
}
