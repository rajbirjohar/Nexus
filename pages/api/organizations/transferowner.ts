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
      adminData: { orgId, email, origCreatorId },
    } = req.body

    const user = await db.collection('users').find({ email: email }).toArray()

    const creator = await db
      .collection('relations')
      .find({
        email: email,
        role: 'creator',
      })
      .toArray()

    const admin = await db
      .collection('relations')
      .find({
        orgId: new mongodb.ObjectId(orgId),
        email: email,
        role: 'admin',
      })
      .toArray()

    // If user is not found, do nothing
    if (user.length < 1) {
      return res.status(404).json({ error: 'User does not exist.' })
    }
    // If creator, do nothing
    if (creator.length === 1) {
      return res.status(403).json({ error: 'Already owner.' })
    }
    // If no admin found, do nothing
    if (admin < 1) {
      return res.status(405).json({ error: 'User is not an admin.' })
    }
    // First pull creator roll
    await db.collection('users').updateOne(
      {
        _id: new mongodb.ObjectId(origCreatorId),
      },
      {
        $pull: { roles: 'creator' },
      }
    )

    // Insert role into new creator
    await db.collection('users').updateOne(
      {
        email: email,
      },
      // Only if they have the precreator role
      { $pull: { roles: 'precreator' } }
    )
    await db.collection('users').updateOne(
      {
        email: email,
      },
      { $push: { roles: 'creator' } }
    )

    // Update org
    await db.collection('organizations').updateOne(
      {
        _id: new mongodb.ObjectId(orgId),
        creatorId: new mongodb.ObjectId(origCreatorId),
      },
      {
        $set: {
          creatorId: new mongodb.ObjectId(
            user.map((user) => user._id).toString()
          ),
          creatorFirstName:
            user.map((user) => user.name).toString() ||
            user.map((user) => user.firstname).toString(),
          creatorLastName: user.map((user) => user.lastname).toString(),
          email: email,
        },
      }
    )

    // Update relation
    await db.collection('relations').updateOne(
      {
        orgId: new mongodb.ObjectId(orgId),
        email: email,
      },
      {
        $set: {
          role: 'creator',
        },
      }
    )

    // Delete previous relation
    await db.collection('relations').deleteOne({
      orgId: new mongodb.ObjectId(orgId),
      userId: new mongodb.ObjectId(origCreatorId),
      role: 'creator',
    })

    return res.status(200).json({ message: 'Success.' })
  } else {
    // Not Signed in
    res.status(401).json({
      error:
        'Not signed in. Why are you trying to access sensitive information or attack my site? :(',
    })
  }
}
