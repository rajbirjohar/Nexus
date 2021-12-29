import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'
import { getSession } from 'next-auth/react'
const mongodb = require('mongodb')
// import { connectToDatabase } from '@/util/connectToDb'

// fetchCourseReviews()
// This endpoint takes in the unique ID of the route that
// the user is currently on, which represents the course
// that the user wants to view, and fetches all the reviews
// on that course alone. We can use course name as our unique ID
// since we know that no two courses can have the same name

export default async function reviewPostEdit(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  const session = await getSession({ req })
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
      { _id: new mongodb.ObjectId(reviewPostId) },
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
    res.status(200).json({ message: 'Successfully updated entry.' })
  } else {
    // Not Signed in
    res.status(401).json({
      error:
        'Not signed in. Why are you trying to access sensitive information or attack my site? :(',
    })
  }
}
