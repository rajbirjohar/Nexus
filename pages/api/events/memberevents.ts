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
    const query = req.query.event.toString().toLowerCase()

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
        // Search results
        ...(req.query.event
          ? {
              $or: [
                { name: { $regex: `${query}`, $options: 'i' } },
                { details: { $regex: `${query}`, $options: 'i' } },
                { org: { $regex: `${query}`, $options: 'i' } },
                // Search through array of tags text fields only
                { 'tags.text': { $regex: `${query}`, $options: 'i' } },
              ],
            }
          : {
              // Or first 10 results
              ...(req.query.before && {
                createdAt: {},
              }),
            }),
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
