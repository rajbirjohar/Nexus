import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
// import { connectToDatabase } from '@/util/connectToDb'
import clientPromise from '@/lib/mongodb'
import { v2 as cloudinary } from 'cloudinary'

const mongodb = require('mongodb')

const {
  hostname: cloud_name,
  username: api_key,
  password: api_secret,
} = new URL(process.env.CLOUDINARY_URL)

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
})

// deleteOrganization
// This endpoint takes the unique ID of the organization,
// and removes that entire document based on that ID

export default async function deleteOrganization(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  if (session) {
    try {
      const {
        organizationData: { organizationId, imagePublicId },
      } = req.body
      if (imagePublicId) {
        const image = await cloudinary.uploader.destroy(imagePublicId)
      }
      // First reset the creator's role so they can make a new org
      await db
        .collection('users')
        .updateOne(
          { _id: new mongodb.ObjectId(session.user.id) },
          { $set: { orgRole: 'none', creatorOfOrg: 'none' } }
        )
      // Remove the orgId from all admins and members
      await db.collection('users').updateMany(
        {},
        {
          $pull: {
            adminOfOrg: new mongodb.ObjectId(organizationId),
            memberOfOrg: new mongodb.ObjectId(organizationId),
          },
        }
      )
      // Delete all events associated with this org
      await db
        .collection('events')
        .deleteMany({ organizationId: new mongodb.ObjectId(organizationId) })
      // Delete the org itself
      const result = await db
        .collection('organizations')
        .deleteOne({ _id: new mongodb.ObjectId(organizationId) })
      res.status(200).json(result.deletedCount)
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
