import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { connectToDatabase } from '@/util/connectToDb'

export default async function createPost(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  if (session) {
    const { db } = await connectToDatabase()
    const {
      organizationData: {
        organizer,
        email,
        _organizationName,
        _organizationDescription,
      },
    } = req.body
    const result = await db.collection('organizations').insertOne({
      organizer: organizer,
      email: email,
      organizationName: _organizationName,
      organizationDescription: _organizationDescription,
    })
    return res.status(200).json({ message: 'Successfully posted entry.' })
  } else {
    // Not Signed in
    res.status(401).json({
      error:
        'Not signed in. Why are you trying to access sensitive information or attack my site? :(',
    })
  }
}
