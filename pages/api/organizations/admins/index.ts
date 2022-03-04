import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import clientPromise from '@/lib/mongodb'
const mongodb = require('mongodb')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  if (req.method === 'PUT') {
    res.status(201).json({})
  }

  if (req.method === 'GET') {
    res.status(200).json({})
  }

  if (req.method === 'POST') {
    if (session) {
      const {
        adminData: { orgId, email },
      } = req.body

      const user = await db.collection('users').find({ email: email }).toArray()

      const creatorOrAdmin = await db
        .collection('relations')
        .find({
          orgId: new mongodb.ObjectId(orgId),
          role: { $in: ['creator', 'admin'] },
          email: email,
        })
        .count()

      // First check if user exists
      // Then, check if they are a creator or admin, if so, break
      // Then, check if they are a member, if so, update
      // If not, insert
      if (user.length < 1) {
        return res.status(404).json({ error: 'User does not exist.' })
      }
      if (creatorOrAdmin === 1) {
        return res.status(403).json({ error: 'User is already an admin.' })
      }

      await db.collection('relations').updateOne(
        {
          orgId: new mongodb.ObjectId(orgId),
          email: email,
        },
        {
          $set: {
            userId: new mongodb.ObjectId(
              user.map((user) => user._id).toString()
            ),
            firstname:
              user.map((user) => user.name).toString() ||
              user.map((user) => user.firstname).toString(),
            lastname: user.map((user) => user.lastname).toString(),
            email: email,
            orgId: new mongodb.ObjectId(orgId),
            role: 'admin',
          },
        },
        { upsert: true }
      )
      return res.status(200).json({ message: 'Successfully added admin.' })
    } else {
      // Not Signed in
      return res.status(401).json({
        error:
          'Not signed in. Why are you trying to access sensitive information or attack my site? :(',
      })
    }
  }

  if (req.method === 'DELETE') {
    if (session) {
      const {
        adminData: { orgId, email },
      } = req.body

      const user = await db.collection('users').find({ email: email }).count()

      const admin = await db
        .collection('relations')
        .find({
          orgId: new mongodb.ObjectId(orgId),
          role: 'admin',
          email: email,
        })
        .count()

      const creator = await db
        .collection('relations')
        .find({
          orgId: new mongodb.ObjectId(orgId),
          role: 'creator',
          email: email,
        })
        .count()

      if (user < 1) {
        return res.status(404).json({ error: 'User does not exist.' })
      }
      if (creator === 1) {
        return res.status(403).json({ error: 'Cannot remove owner.' })
      }
      if (admin < 1) {
        return res.status(404).json({ error: 'User is not an admin.' })
      }

      await db.collection('relations').deleteOne({
        orgId: new mongodb.ObjectId(orgId),
        email: email,
        role: 'admin',
      })
      return res.status(200).json({ message: 'Success.' })
    }
  } else {
    // Not Signed in
    return res.status(401).json({
      error:
        'Not signed in. Why are you trying to access sensitive information or attack my site? :(',
    })
  }
}
