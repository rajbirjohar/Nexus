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
  if (req.method === 'POST') {
    if (session) {
      const {
        memberData: { orgId, org, userId, firstname, lastname, email, role },
      } = req.body

      const memberExists = await db
        .collection('relations')
        .find({
          orgId: new mongodb.ObjectId(orgId),
          userId: new mongodb.ObjectId(userId),
          role: 'member',
        })
        .count()

      const admin = await db
        .collection('relations')
        .find({
          orgId: new mongodb.ObjectId(orgId),
          userId: new mongodb.ObjectId(userId),
          role: 'admin',
        })
        .count()

      if (admin > 0) {
        res.status(405).json({ error: 'Already an Admin.' })
      }
      if (memberExists > 0) {
        res
          .status(403)
          .json({ error: 'Member already exists in organization.' })
      } else {
        await db.collection('relations').insertOne({
          userId: new mongodb.ObjectId(userId),
          firstname: firstname,
          lastname: lastname,
          email: email,
          orgId: new mongodb.ObjectId(orgId),
          org: org,
          role: role,
        })
        res.status(200).json({ message: 'Success.' })
      }
    } else {
      // Not Signed in
      res.status(401).json({
        error:
          'Not signed in. Why are you trying to access sensitive information or attack my site? :(',
      })
    }
  }

  if (req.method === 'DELETE') {
    if (session) {
      const {
        memberData: { userId, orgId, role },
      } = req.body
      await db.collection('relations').deleteOne({
        orgId: new mongodb.ObjectId(orgId),
        userId: new mongodb.ObjectId(userId),
        role: role,
      })
      res.status(200).json({ message: 'Success.' })
    } else {
      // Not Signed in
      res.status(401).json({
        error:
          'Not signed in. Why are you trying to access sensitive information or attack my site? :(',
      })
    }
  }
}
