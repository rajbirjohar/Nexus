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

  const comments = await db
    .collection('comments')
    .find({ eventId: id })
    .sort({ createdAt: -1 })
    .toArray()
  return res.status(200).json({ comments })
}
