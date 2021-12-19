import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import clientPromise from '@/lib/mongodb'
const mongodb = require('mongodb')

export default async function removeAdmin(
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
    const isCreator = await db
      .collection('organizations')
      .find({ email: _email })
      .count()
    const adminExists = await db
      .collection('organizations')
      .find({
        _id: new mongodb.ObjectId(organizationId),
        superMembersList: {
          $elemMatch: { email: _email },
        },
      })
      .count()
    if (isCreator > 0) {
      res
        .status(403)
        .json({ message: 'You are trying to remove yourself, the creator.' })
    } else if (adminExists === 0) {
      res.status(404).json({ message: 'This Admin does not exist.' })
    } else {
      await db.collection('users').updateOne(
        {
          email: _email,
        },
        {
          $pull: {
            adminOfOrg: new mongodb.ObjectId(organizationId),
          },
        }
      )
      await db.collection('organizations').updateOne(
        { _id: new mongodb.ObjectId(organizationId) },
        {
          $pull: {
            superMembersList: { email: _email },
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
