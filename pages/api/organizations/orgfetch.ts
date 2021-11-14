// import { connectToDatabase } from '@/util/connectToDb'
import clientPromise from '@/lib/mongodb'

// fetchOrganizations()
// This endpoint will fetch all of our organizations
// from our database and place them into an array
// where we can display them using the organizationCard(),
// and listOrganizations()

const fetchOrganizations = async (req, res) => {
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)

  const organizations = await db
    .collection('organizations')
    .find({})
    .sort({ organizationName: 1 })
    .toArray()

  res.status(200).json({ organizations })
}

export default fetchOrganizations
