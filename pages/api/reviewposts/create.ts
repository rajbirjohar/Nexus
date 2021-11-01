import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { connectToDatabase } from '@/util/connectToDb'

const mongodb = require('mongodb')

export default async function createPost(
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
    console.log(req.body)
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
    console.log(reviewPostId)
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
