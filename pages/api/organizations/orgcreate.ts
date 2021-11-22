import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import clientPromise from '@/lib/mongodb'
const mongodb = require('mongodb')

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
        organizerId,
        organizer,
        email,
        _organizationName,
        _organizationTagline,
        _organizationDescription,
      },
    } = req.body
    const nameTaken = await db
      .collection('organizations')
      .countDocuments({ organizationName: _organizationName })
    if (nameTaken > 1) {
      res.status(422).json({ error: 'Event already has a name that exists.' })
    } else {
      const organization = await db.collection('organizations').insertOne({
        organizerId: new mongodb.ObjectId(organizerId),
        organizer: organizer,
        email: email,
        organizationName: _organizationName,
        organizationTagline: _organizationTagline,
        organizationDescription: _organizationDescription,
        superMembersList: [
          {
            adminId: new mongodb.ObjectId(organizerId),
            admin: organizer,
            email: email,
          },
        ],
        membersList: [],
      })
      await db.collection('users').updateOne(
        {
          _id: new mongodb.ObjectId(session.user.id),
        },
        { $set: { adminOfOrg: organization.insertedId } }
      )
      res.status(200).json({ message: 'Successfully posted organization.' })
    }
  } else {
    // Not Signed in
    res.status(401).json({
      error:
        'Not signed in. Why are you trying to access sensitive information or attack my site? :(',
    })
  }
}
