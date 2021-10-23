import { connectToDatabase } from '@/lib/connectToDb'

const postsFetch = async (req, res) => {
  const { db } = await connectToDatabase()

  const entries = await db
    .collection('posts')
    .find({})
    .sort({ createdAt: -1 })
    .toArray()

  return res.status(200).json({ entries })
}

export default postsFetch
