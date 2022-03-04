import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'
import { getSession } from 'next-auth/react'
const mongodb = require('mongodb')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGO_DB)
  if (req.method === 'PATCH') {
    if (session) {
      const {
        commentData: { eventId, _comment, commentId, authorId },
      } = req.body
      await db.collection('comments').updateOne(
        {
          _id: new mongodb.ObjectId(commentId),
          authorId: new mongodb.ObjectId(authorId),
          eventId: new mongodb.ObjectId(eventId),
        },
        {
          $set: {
            comment: _comment,
            createdAt: new Date(),
          },
        }
      )
      res.status(200).json({ message: 'Success.' })
    } else {
      // Not Signed in
      res.status(401).json({
        error: 'Not signed in.',
      })
    }
  }

  if (req.method === 'GET') {
    res.status(200).json({})
  }

  if (req.method === 'POST') {
    if (session) {
      const {
        commentData: { eventId, authorId, orgId, author, email, _comment },
      } = req.body

      await db.collection('comments').insertOne({
        eventId: new mongodb.ObjectId(eventId),
        authorId: new mongodb.ObjectId(authorId),
        orgId: new mongodb.ObjectId(orgId),
        author: author,
        email: email,
        createdAt: new Date(),
        comment: _comment,
      })
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

      await db.collection('comments').deleteOne({
        _id: new mongodb.ObjectId(commentId),
        eventId: new mongodb.ObjectId(eventId),
      })
      return res.status(200).json({ message: 'Success.' })
    } else {
      // Not Signed in
      res.status(401).json({
        error: 'Not signed in.',
      })
    }
  }
}
