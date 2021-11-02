import { connectToDatabase } from '@/util/connectToDb'
import { getSession } from 'next-auth/react'

// fetchProfilePosts()
// This endpoint will fetch all of our reviews
// that that logged in user has submitted
// from our database and place them into an array
// where we can display them using the reviewPostCard(),
// and listReviewPosts()

const fetchProfilePosts = async (req, res) => {
  const session = await getSession({ req })
  const { user } = session
  if (session) {
    try {
      const { db } = await connectToDatabase()
      const reviewPosts = await db
        .collection('reviewPosts')
        .find({ email: user.email })
        .sort({ createdAt: -1 })
        .toArray()
      return res.status(200).json({ reviewPosts })
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
