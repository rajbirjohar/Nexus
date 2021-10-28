import { connectToDatabase } from '@/util/connectToDb'

const reviewPostsFetch = async (req, res) => {
  const { db } = await connectToDatabase()

  const reviewPosts = await db
    .collection('reviewPosts')
    .find({})
    .sort({ createdAt: -1 })
    .toArray()

  return res.status(200).json({ reviewPosts })
}

export default reviewPostsFetch
