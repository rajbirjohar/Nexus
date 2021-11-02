import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { connectToDatabase } from '@/util/connectToDb'

const mongodb = require('mongodb')

// createReviewPost()
// This endpoint will take our user data and submit one document 
// to our database containing all the required information on a single review
// Then it will take the ID of that document, and insert it into the
// reviews array contained in that course so we have reference to all
// the reviews a course may have 
// Tip: "_" preceding the variable represents user data,
// while the variable name alone represents what value it
// is assigned to in the database.

export default async function createReviewPost(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  if (session) {
    const { db } = await connectToDatabase()
    const {
      reviewPostData: {
        reviewee,
        email,
        _reviewPost,
        _reviewProfessor,
        _course,
        _taken,
        _difficulty,
        _anonymous,
      },
    } = req.body
    const reviewPost = await db.collection('reviewPosts').insertOne({
      reviewee: reviewee,
      email: email,
      reviewPost: _reviewPost,
      reviewProfessor: _reviewProfessor,
      course: _course,
      taken: _taken,
      difficulty: _difficulty,
      anonymous: _anonymous,
      createdAt: new Date(),
    })
    const reviewPostId = reviewPost.insertedId
    const courseArray = await db
      .collection('courses')
      .updateOne({ name: _course }, { $push: { reviews: reviewPostId } })
    return res.status(200).json({ message: 'Successfully posted entry.' })
  } else {
    // Not Signed in
    res.status(401).json({
      error:
        'Not signed in. Why are you trying to access sensitive information or attack my site? :(',
    })
  }
}
