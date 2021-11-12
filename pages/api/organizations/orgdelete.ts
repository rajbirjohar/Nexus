import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
// import { connectToDatabase } from '@/util/connectToDb'
import clientPromise from '@/lib/mongodb'
var mongodb = require('mongodb')

// deleteOrganization
// This endpoint takes the unique ID of the organization,
// and removes that entire document based on that ID

export default async function deleteOrganization(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  if (session) {
    try {
      const db = (await clientPromise).db(process.env.MONGODB_DB)
      const { organizationData: organizationId } = req.body
      const result = await db
        .collection('organizations')
        .deleteOne({ _id: new mongodb.ObjectID(organizationId) })
      return res.status(200).json(result.deletedCount)
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
