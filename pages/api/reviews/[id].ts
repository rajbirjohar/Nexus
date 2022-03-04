import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  const {
    query: { id },
  } = req
  const reviews = await db
    .collection('reviews')
    .find({
      course: id,
      ...(req.query.before && {
        createdAt: { $lt: new Date(req.query.before.toString()) },
      }),
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(req.query.limit.toString(), 10))
    .toArray()

  res.status(200).json({ reviews })
}
