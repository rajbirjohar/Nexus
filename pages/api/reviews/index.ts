import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'
import { getSession } from 'next-auth/react'
const mongodb = require('mongodb')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  const session = await getSession({ req })

  if (req.method === 'PUT') {
    res.status(201).json({})
  }

  // Fetch most recent review posts
  if (req.method === 'GET') {
    const posts = await db
      .collection('reviews')
      .find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray()

    res.status(200).json({ posts })
  }

  if (req.method === 'POST') {
    if (session) {
      const {
        reviewData: {
          authorId,
          author,
          courseId,
          course,
          review,
          professor,
          taken,
          difficulty,
          anonymous,
        },
      } = req.body

      await db.collection('reviews').insertOne({
        authorId: new mongodb.ObjectId(authorId),
        courseId: new mongodb.ObjectId(courseId),
        author: author,
        course: course,
        review: review,
        professor: professor,
        taken: taken,
        difficulty: parseInt(difficulty),
        anonymous: anonymous,
        createdAt: new Date(),
      })

      res.status(200).json({ message: 'Success.' })
    } else {
      // Not Signed in
      res.status(401).json({
        error: 'Not signed in.',
      })
    }
  }

  if (req.method === 'PATCH') {
    if (session) {
      const {
        reviewData: {
          reviewId,
          authorId,
          review,
          professor,
          taken,
          difficulty,
          anonymous,
        },
      } = req.body

      await db.collection('reviews').updateOne(
        {
          _id: new mongodb.ObjectId(reviewId),
          authorId: new mongodb.ObjectId(authorId),
        },
        {
          $set: {
            review: review,
            professor: professor,
            taken: taken,
            difficulty: parseInt(difficulty),
            anonymous: anonymous,
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

  if (req.method === 'DELETE') {
    if (session) {
      const { reviewData: reviewId } = req.body
      await db
        .collection('reviews')
        .deleteOne({ _id: new mongodb.ObjectID(reviewId) })
      return res.status(200).json({})
    } else {
      // Not Signed in
      res.status(401).json({
        error: 'Not signed in.',
      })
    }
  }
}
