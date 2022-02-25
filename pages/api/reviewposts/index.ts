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
      .collection('reviewPosts')
      .find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray()

    res.status(200).json({ posts })
  }

  if (req.method === 'POST') {
    if (session) {
      const {
        reviewPostData: {
          creatorId,
          creator,
          creatorEmail,
          _courseId,
          _course,
          _reviewPost,
          _reviewProfessor,
          _taken,
          _difficulty,
          _anonymous,
        },
      } = req.body

      await db.collection('reviewPosts').insertOne({
        creatorId: new mongodb.ObjectId(creatorId),
        creator: creator,
        creatorEmail: creatorEmail,
        courseId: new mongodb.ObjectId(_courseId),
        course: _course,
        reviewPost: _reviewPost,
        reviewProfessor: _reviewProfessor,
        taken: _taken,
        difficulty: parseInt(_difficulty),
        anonymous: _anonymous,
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
        newReviewPostData: {
          reviewPostId,
          creatorId,
          _newReviewPost,
          _newReviewProfessor,
          _newTaken,
          _difficulty,
          _newAnonymous,
        },
      } = req.body
      await db.collection('reviewPosts').updateOne(
        {
          _id: new mongodb.ObjectId(reviewPostId),
          creatorId: new mongodb.ObjectId(creatorId),
        },
        {
          $set: {
            reviewPost: _newReviewPost,
            reviewProfessor: _newReviewProfessor,
            taken: _newTaken,
            difficulty: parseInt(_difficulty),
            anonymous: _newAnonymous,
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
      const { reviewPostData: reviewPostId } = req.body
      await db
        .collection('reviewPosts')
        .deleteOne({ _id: new mongodb.ObjectID(reviewPostId) })
      return res.status(200).json({});
    } else {
      // Not Signed in
      res.status(401).json({
        error: 'Not signed in.',
      })
    }
  }
}
