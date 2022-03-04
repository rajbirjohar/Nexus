import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import clientPromise from '@/lib/mongodb'
const mongodb = require('mongodb')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  const session = await getSession({ req })
  if (session) {
    const relations = await db
      .collection('relations')
      .find({ userId: new mongodb.ObjectId(session.user.id) })
      .toArray()

    const relationsFlat = relations.map(
      (relation) => new mongodb.ObjectId(relation.orgId)
    )

    const events = await db
      .collection('events')
      .find({
        orgId: { $in: relationsFlat },
        endDate: { $gte: new Date() },
      })
      .toArray()

    return res.status(200).json({ events })
  } else {
    res.status(401).json({
      error: 'Not signed in.',
    })
  }
}
