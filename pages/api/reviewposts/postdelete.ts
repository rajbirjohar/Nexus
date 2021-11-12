import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import clientPromise from '@/lib/mongodb'
// import { connectToDatabase } from '@/util/connectToDb'
const mongodb = require('mongodb')

// deleteReviewPost()
// This endpoint takes the unique ID of the review post,
// and removes that entire document based on that ID
// Then it removes the referencing ID from the reviews array
// of that particular course

export default async function deleteReviewPost(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  if (session) {
    try {
      const db = (await clientPromise).db(process.env.MONGODB_DB)
      const { reviewPostData: course, reviewPostId } = req.body
      const courseArray = await db
        .collection('courses')
        .updateOne(
          { name: course },
          { $pull: { reviews: new mongodb.ObjectID(reviewPostId) } }
        )
      const result = await db
        .collection('reviewPosts')
        .deleteOne({ _id: new mongodb.ObjectID(reviewPostId) })
      return res.status(200).json(result.deletedCount)
    } catch {
      res.status(500)
      res.json({
        error: 'Unable to delete entry or accessing sensitive routes.',
      })
    }
  } else {
    // Not Signed in
    res.status(401).json({
      error:
        'Not signed in. Why are you trying to access sensitive information or attack my site? :(',
    })
  }
}
