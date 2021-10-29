import { connectToDatabase } from '@/util/connectToDb'

const reviewOrganizationsFetch = async (req, res) => {
  const { db } = await connectToDatabase()

  const organizations = await db
    .collection('organizations')
    .find({})
    .sort({})
    .toArray()

  return res.status(200).json({ organizations })
}

export default reviewOrganizationsFetch