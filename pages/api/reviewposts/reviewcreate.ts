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

const reviewPostCreate = async (req, res) => {
  const {
    query: { id },
  } = req
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  const session = await getSession({ req })

  if (session) {
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
    await db
      .collection('courses')
      .updateOne({ name: id }, { $push: { reviews: reviewPostId } })
    res.status(200).json({ message: 'Successfully posted entry.' })
  } else {
    // Not Signed in
    res.status(401).json({
      error:
        'Not signed in. Why are you trying to access sensitive information or attack my site? :(',
    })
  }
}

export default reviewPostCreate
