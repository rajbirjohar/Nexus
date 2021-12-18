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
  if (session) {
    const {
      commentData: { eventId, authorId, author, email, _comment },
    } = req.body

    await db.collection('events').updateOne(
      { _id: new mongodb.ObjectId(eventId) },
      {
        $push: {
          comments: {
            commentId: new mongodb.ObjectId(),
            authorId: new mongodb.ObjectId(authorId),
            author: author,
            email: email,
            createdAt: new Date(),
            comment: _comment,
          },
        },
      }
    )
    res.status(200).json({ message: 'Successfully posted comment.' })
  } else {
    res.status(401).json({
      error: 'Not signed in.',
    })
  }
}
