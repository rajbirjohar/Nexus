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
  const query = req.query.review.toString().toLowerCase()
  const reviews = await db
    .collection('reviews')
    .find({
      course: id,
      // Search results
      ...(req.query.review
        ? {
            $or: [
              { review: { $regex: `${query}`, $options: 'i' } },
              { professor: { $regex: `${query}`, $options: 'i' } },
              { taken: { $regex: `${query}`, $options: 'i' } },
            ],
          }
        : {
            // Or first 10 results
            ...(req.query.before && {
              createdAt: { $lt: new Date(req.query.before.toString()) },
            }),
          }),
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(req.query.limit.toString(), 10))
    .toArray()

  res.status(200).json({ reviews })
}
