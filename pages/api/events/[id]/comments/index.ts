import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'
import { getSession } from 'next-auth/react'
const mongodb = require('mongodb')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const { id } = req.query
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGO_DB)
  if (req.method === 'PATCH') {
    if (session) {
      const {
        commentData: { eventId, comment, commentId, authorId },
      } = req.body
      await db.collection('comments').updateOne(
        {
          _id: new mongodb.ObjectId(commentId),
          authorId: new mongodb.ObjectId(authorId),
          eventId: new mongodb.ObjectId(eventId),
        },
        {
          $set: {
            comment: comment,
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
    const comments = await db
      .collection('comments')
      .find({
        eventId: new mongodb.ObjectId(id),
        // Pagination
        ...(req.query.before && {
          createdAt: { $lt: new Date(req.query.before.toString()) },
        }),
      })
      .sort({ createdAt: -1 })
      .limit(parseInt(req.query.limit.toString(), 10))
      .toArray()
    return res.status(200).json({ comments })
  }

  if (req.method === 'POST') {
    if (session) {
      const {
        commentData: { eventId, authorId, orgId, author, email, comment },
      } = req.body
      await db.collection('comments').insertOne({
        eventId: new mongodb.ObjectId(eventId),
        authorId: new mongodb.ObjectId(authorId),
        orgId: new mongodb.ObjectId(orgId),
        author: author,
        email: email,
        createdAt: new Date(),
        comment: comment,
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
