import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'
const mongodb = require('mongodb')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
  } = req
  const query = req.query.event.toString().toLowerCase()
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
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
      orgId: new mongodb.ObjectId(id),
    })
    .sort({ startDate: -1 })
    .toArray()
  return res.status(200).json({ events })
}
