import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import clientPromise from '@/lib/mongodb'
const mongodb = require('mongodb')

export default async function removeMember(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)

  if (session) {
    const {
      memberData: { organizationId, organizationName, memberId },
    } = req.body
    const userNotFound = await db
      .collection('users')
      .find({ _id: new mongodb.ObjectId(memberId) })
      .count()
    const memberNotExists = await db
      .collection('organizations')
      .find({
        _id: new mongodb.ObjectId(organizationId),
        membersList: {
          $elemMatch: { memberId: new mongodb.ObjectId(memberId) },
        },
      })
      .count()
    if (memberNotExists === 0) {
      res.status(403).json({ error: 'Member does not exist in organization.' })
    } else if (userNotFound === 0) {
      res.status(404).json({ error: 'User does not exist.' })
    } else {
      await db.collection('users').updateOne(
        {
          _id: new mongodb.ObjectId(memberId),
        },
        {
          $pull: {
            memberOfOrg: new mongodb.ObjectId(organizationId),
          },
          $push: {
            notifications: {
              notifId: new mongodb.ObjectId(),
              notifCreatedAt: new Date(),
              notifType: 'update',
              message: `You've left ${organizationName}.`,
            },
          },
        }
      )
      await db.collection('organizations').updateOne(
        { _id: new mongodb.ObjectId(organizationId) },
        {
          $pull: {
            membersList: { memberId: new mongodb.ObjectId(memberId) },
          },
        }
      )
      res.status(200).json({ message: 'Successfully removed member.' })
    }
  } else {
    // Not Signed in
    res.status(401).json({
      error:
        'Not signed in. Why are you trying to access sensitive information or attack my site? :(',
    })
  }
}
