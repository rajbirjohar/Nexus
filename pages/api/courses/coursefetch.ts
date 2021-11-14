import clientPromise from '@/lib/mongodb'
// import { connectToDatabase } from '@/util/connectToDb'

// courseFetch(req,res)
// This endpoint will fetch JSON containing a list of all our current courses
// and place them into an array where we can display it using the courseCard()
// and listCourses() component

const coursesFetch = async (req, res) => {
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)

  const courses = await db
    .collection('courses')
    .find({})
    .sort({ name: 1 })
    .toArray()
  res.status(200).json({ courses })
}

export default coursesFetch
