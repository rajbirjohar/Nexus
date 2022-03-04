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
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  const events = await db
    .collection('events')
    .find({ orgId: new mongodb.ObjectId(id) })
    .sort({ startDate: -1 })
    .toArray()
  return res.status(200).json({ events })
}
