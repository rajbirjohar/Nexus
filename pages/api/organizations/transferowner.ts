import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import clientPromise from '@/lib/mongodb'
const mongodb = require('mongodb')

export default async function transferOwner(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  if (session) {
    const {
      adminData: { organizationId, _email },
    } = req.body
    const adminExists = await db
      .collection('organizations')
      .find({
        _id: new mongodb.ObjectId(organizationId),
        superMembersList: {
          $elemMatch: { email: _email },
        },
      })
      .count()
    const isCreator = await db
      .collection('organizations')
      .find(
        { email: _email },
        { superMembersList: { $elemMatch: { email: _email } } }
      )
      .count()

    const userNotFound = await db
      .collection('users')
      .find({ email: _email })
      .count()
    const userDetails = await db
      .collection('users')
      .find({ email: _email })
      .toArray()
    const newOrganizer = userDetails.map((details) => details.name).toString()
    const newOrganizerId = userDetails.map((details) => details._id).toString()
    // If you are already the owner, do nothing
    if (isCreator === 1) {
      res.status(403).json({ error: 'You are already the owner.' })
      // If user is not found, do nothing
    } else if (userNotFound === 0) {
      res.status(404).json({ error: 'User not found or email is incorrect.' })
      // If user is not an admin, do nothing
    } else if (adminExists === 0) {
      res.status(405).json({ error: 'User must be an admin.' })
      // If user is an admin, then begin transfer
    } else if (adminExists === 1) {
      // First, reset old owner and make them an admin
      await db.collection('users').updateOne(
        { creatorOfOrg: new mongodb.ObjectId(organizationId) },
        {
          $set: {
            orgRole: 'none',
            creatorOfOrg: 'none',
          },
          $push: {
            adminOfOrg: new mongodb.ObjectId(organizationId),
          },
        }
      )
      // Next, update the new owner and upgrade them from admin to owner
      await db.collection('users').updateOne(
        { email: _email },
        {
          $set: {
            creatorOfOrg: new mongodb.ObjectId(organizationId),
            orgRole: 'Admin',
          },
          $pull: {
            adminOfOrg: new mongodb.ObjectId(organizationId),
          },
        }
      )
      // Then, update the organization
      await db.collection('organizations').updateOne(
        {
          _id: new mongodb.ObjectId(organizationId),
        },
        {
          $set: {
            organizerId: new mongodb.ObjectId(newOrganizerId),
            organizer: newOrganizer,
            email: _email,
          },
        },
        {
          $addToSet: {
            superMembersList: {
              adminId: new mongodb.ObjectId(newOrganizerId),
              admin: newOrganizer,
              email: _email,
            },
          },
        }
      )

      res.status(200).json({})
    }
  } else {
    // Not Signed in
    res.status(401).json({
      error:
        'Not signed in. Why are you trying to access sensitive information or attack my site? :(',
    })
  }
}
