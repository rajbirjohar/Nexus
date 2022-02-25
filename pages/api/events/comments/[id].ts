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
    .collection('events')
    .aggregate([
      { $match: { _id: new mongodb.ObjectId(id) } },
      { $unwind: '$comments' },
      {
        $project: {
          commentId: '$comments.commentId',
          comment: '$comments.comment',
          author: '$comments.author',
          authorId: '$comments.authorId',
          createdAt: '$comments.createdAt',
        },
      },
    ])
    .sort({ createdAt: -1 })
    .toArray()
  return res.status(200).json({ comments })
}
