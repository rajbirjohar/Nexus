import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'
import { getSession } from 'next-auth/react'
const mongodb = require('mongodb')

export default async function fetchComments(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGO_DB)
  if (req.method === 'PATCH') {
    if (session) {
      const {
        newCommentData: { eventId, _newComment, commentId, authorId },
      } = req.body
      await db.collection('events').updateOne(
        {
          _id: new mongodb.ObjectId(eventId),
          'comments.commentId': new mongodb.ObjectId(commentId),
          'comments.authorId': new mongodb.ObjectId(authorId),
        },
        {
          $set: {
            'comments.$.comment': _newComment,
            'comments.$.createdAt': new Date(),
          },
        }
      )
      res.status(200).json({ message: 'Success.' })
    } else {
      // Not Signed in
      res.status(401).json({
        error:
          'Not signed in.',
      })
    }
  }

  if (req.method === 'GET') {
    res.status(200).json({})
  }

  if (req.method === 'POST') {
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
      res.status(200).json({ message: 'Success.' })
    } else {
      res.status(401).json({
        error: 'Not signed in.',
      })
    }
  }

  if (req.method === 'DELETE') {
    if (session) {
      const {
        commentData: { commentId, eventId },
      } = req.body
      await db.collection('events').updateOne(
        {
          _id: new mongodb.ObjectId(eventId),
        },
        {
          $pull: { comments: { commentId: new mongodb.ObjectId(commentId) } },
        }
      )
      return res.status(200).json({ message: 'Success.' })
    } else {
      // Not Signed in
      res.status(401).json({
        error: 'Not signed in.',
      })
    }
  }
}
