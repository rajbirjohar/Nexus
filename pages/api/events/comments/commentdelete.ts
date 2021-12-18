import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'
import { getSession } from 'next-auth/react'
const mongodb = require('mongodb')

export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGO_DB)
  const {
    commentData: { commentId, eventId },
  } = req.body
  if (session) {
    const result = await db.collection('events').updateOne(
      {
        _id: new mongodb.ObjectId(eventId),
      },
      {
        $pull: { comments: { commentId: new mongodb.ObjectId(commentId) } },
      }
    )
    return res.status(200).json(result.deletedCount)
  } else {
    // Not Signed in
    res.status(401).json({
      error:
        'Not signed in. Why are you trying to access sensitive information or attack my site? :(',
    })
  }
}
