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
  const reviewPosts = await db
    .collection('reviewPosts')
    .find({ course: id })
    .sort({ createdAt: -1 })
    .toArray()

  res.status(200).json({ reviewPosts })
}
