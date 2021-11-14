import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import clientPromise from '@/lib/mongodb'
// import { connectToDatabase } from '@/util/connectToDb'

// createOrganization()
// This endpoint takes data from our OrganizationPostForm()
// component and writes to the database submitting one
// document containing all of the required data
// Tip: "_" preceding the variable represents user data,
// while the variable name alone represents what value it
// is assigned to in the database.

export default async function createOrganization(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  if (session) {
    const {
      organizationData: {
        organizer,
        email,
        _organizationName,
        _organizationDescription,
      },
    } = req.body
    await db.collection('organizations').insertOne({
      organizer: organizer,
      email: email,
      organizationName: _organizationName,
      organizationDescription: _organizationDescription,
    })
    res.status(200).json({ message: 'Successfully posted organization.' })
  } else {
    // Not Signed in
    res.status(401).json({
      error:
        'Not signed in. Why are you trying to access sensitive information or attack my site? :(',
    })
  }
}
