import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { connectToDatabase } from '@/lib/connectToDb'

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
        _difficulty,
        _anonymous,
      },
    } = req.body
    console.log(req.body)
    const result = await db.collection('reviewPosts').insertOne({
      reviewee: reviewee,
      email: email,
      reviewPost: _reviewPost,
      reviewProfessor: _reviewProfessor,
      course: _course,
      difficulty: _difficulty,
      anonymous: _anonymous,
      createdAt: new Date(),
    })
    return res.status(200).json({ message: 'Successfully posted entry.' })
  } else {
    // Not Signed in
    res.status(401).json({
      error:
        'Not signed in. Why are you trying to access sensitive information or attack my site? :(',
    })
  }
}
