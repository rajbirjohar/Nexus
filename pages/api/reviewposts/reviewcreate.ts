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
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  const session = await getSession({ req })
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
    const reviewPost = await db.collection('reviewPosts').insertOne({
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
    await db
      .collection('allCourses')
      .updateOne(
        { _id: new mongodb.ObjectId(_courseId) },
        { $push: { reviews: reviewPost.insertedId } }
      )
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
