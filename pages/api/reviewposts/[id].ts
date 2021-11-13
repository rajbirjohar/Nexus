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

const reviewPostHandler = async (req, res) => {
  const db = (await clientPromise).db(process.env.MONGODB_DB)
  const {
    query: { id },
    method,
  } = req
  const session = await getSession({ req })
  switch (method) {
    case 'GET':
      const reviewPosts = await db
        .collection('reviewPosts')
        .find({ course: id })
        // Sorted by newest to oldest
        .sort({ createdAt: -1 })
        .toArray()
      res.status(200).json({ reviewPosts })
      break
    case 'POST':
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
        break
      } else {
        // Not Signed in
        res.status(401).json({
          error:
            'Not signed in. Why are you trying to access sensitive information or attack my site? :(',
        })
      }
    case 'DELETE':
      if (session) {
        const { reviewPostData: course, reviewPostId } = req.body
        await db
          .collection('courses')
          .updateOne(
            { name: course },
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
}

export default reviewPostHandler
