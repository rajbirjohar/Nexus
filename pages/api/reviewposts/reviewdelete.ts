import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { getSession } from 'next-auth/react'
const mongodb = require('mongodb')
// import { connectToDatabase } from '@/util/connectToDb'

// fetchCourseReviews()
// This endpoint takes in the unique ID of the route that
// the user is currently on, which represents the course
// that the user wants to view, and fetches all the reviews
// on that course alone. We can use course name as our unique ID
// since we know that no two courses can have the same name

const reviewPostDelete = async (req, res) => {
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  const session = await getSession({ req })

  if (session) {
    const { reviewPostData: courseId, reviewPostId } = req.body
    await db
      .collection('allCourses')
      .updateOne(
        { _id: new mongodb.ObjectId(courseId) },
        { $pull: { reviews: new mongodb.ObjectID(reviewPostId) } }
      )
    const result = await db
      .collection('reviewPosts')
      .deleteOne({ _id: new mongodb.ObjectID(reviewPostId) })
    return res.status(200).json(result.deletedCount)
  } else {
    // Not Signed in
    res.status(401).json({
      error:
        'Not signed in. Why are you trying to access sensitive information or attack my site? :(',
    })
  }
}

export default reviewPostDelete
