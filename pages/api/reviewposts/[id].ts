import { connectToDatabase } from '@/util/connectToDb'

// fetchCourseReviews()
// This endpoint takes in the unique ID of the route that
// the user is currently on, which represents the course
// that the user wants to view, and fetches all the reviews
// on that course alone. We can use course name as our unique ID
// since we know that no two courses can have the same name

const fetchCourseReviews = async (req, res) => {
  const { db } = await connectToDatabase()
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
  return res.status(200).json({ reviewPosts })
}

export default fetchCourseReviews
