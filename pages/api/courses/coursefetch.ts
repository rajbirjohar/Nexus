import { connectToDatabase } from '@/util/connectToDb'

const coursesFetch = async (req, res) => {
  const { db } = await connectToDatabase()

  const courses = await db.collection('courses').find({}).sort({name: 1}).toArray()

  return res.status(200).json({ courses })
}

export default coursesFetch
