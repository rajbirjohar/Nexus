import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { connectToDatabase } from '@/util/connectToDb'
const mongodb = require('mongodb')

export default async function deleteEntry(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  if (session) {
    try {
      const { db } = await connectToDatabase()
      const { reviewPostData: course, reviewPostId } = req.body
      console.log(req.body)
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
