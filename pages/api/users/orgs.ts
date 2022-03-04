import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import clientPromise from '@/lib/mongodb'
const mongodb = require('mongodb')

// fetchOrganizations()
// This endpoint will fetch all of our organizations
// from our database and place them into an array
// where we can display them using the organizationCard(),
// and listOrganizations()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  const session = await getSession({ req })
  if (session) {
    const adminRelations = await db
      .collection('relations')
      .find({ userId: new mongodb.ObjectId(session.user.id), role: 'admin' })
      .sort({ orgName: 1 })
      .toArray()

    const memberRelations = await db
      .collection('relations')
      .find({ userId: new mongodb.ObjectId(session.user.id), role: 'member' })
      .sort({ orgName: 1 })
      .toArray()

    // create an array of all org Ids attached to a user based on relation
    const adminRelationsFlat = adminRelations.map((admin) => admin.orgId)
    const memberRelationsFlat = memberRelations.map((member) => member.orgId)

    const creatorOrg = await db
      .collection('organizations')
      .find({ creatorId: new mongodb.ObjectId(session.user.id) })
      .sort({ name: 1 })
      .toArray()

    const adminOrgs = await db
      .collection('organizations')
      .find({
        _id: { $in: adminRelationsFlat },
      })
      .sort({ name: 1 })
      .toArray()

    const memberOrgs = await db
      .collection('organizations')
      .find({
        _id: { $in: memberRelationsFlat },
      })
      .sort({ name: 1 })
      .toArray()

    res.status(200).json({ creatorOrg, adminOrgs, memberOrgs })
  } else {
    res.status(401).json({
      error:
        'Not signed in. Why are you trying to access sensitive information or attack my site? :(',
    })
  }
}
