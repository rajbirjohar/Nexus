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
      newCommentData: { eventId, _newComment, commentId, authorId },
    } = req.body
    console.log(req.body);
    await db.collection('events').updateOne(
      {"comments.commentId": new mongodb.ObjectId(commentId)},
      {
        $set: {
          "comments.$.comment": _newComment,
          "comments.$.createdAt": new Date(),
        }
      }
      )
  } else {
    // Not Signed in
    res.status(401).json({
      error:
      'Not signed in. Why are you trying to access sensitive information or attack my site? :(',
    })
  }
}
