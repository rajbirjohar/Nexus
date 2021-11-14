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

const reviewPostFetch = async (req, res) => {
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  const {
    query: { id },
    method,
  } = req

  const reviewPosts = await db
    .collection('reviewPosts')
    .find({ course: id })
    // Sorted by newest to oldest
    .sort({ createdAt: -1 })
    .toArray()

  res.status(200).json({ reviewPosts })
}

export default reviewPostFetch
