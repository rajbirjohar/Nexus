import clientPromise from '@/lib/mongodb'
import { getSession } from 'next-auth/react'
const mongodb = require('mongodb')

// fetchProfilePosts()
// This endpoint will fetch all of our reviews
// that that logged in user has submitted
// from our database and place them into an array
// where we can display them using the reviewPostCard(),
// and listReviewPosts()

const fetchProfilePosts = async (req, res) => {
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  const session = await getSession({ req })
  if (session) {
    try {
      const reviews = await db
        .collection('reviews')
        .find({ authorId: new mongodb.ObjectId(session.user.id) })
        .sort({ course: 1 })
        .toArray()
      return res.status(200).json({ reviews })
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

export default fetchProfilePosts
