import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'
import { getSession } from 'next-auth/react'
const mongodb = require('mongodb')

export default async function removeNotifications(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  const session = await getSession({ req })

  if (session) {
    const { notifData: notifId } = req.body
    const result = await db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(session.user.id) },
        { $pull: { notifications: { notifId: new mongodb.ObjectID(notifId) } } }
      )
    return res.status(200).json(result)
  } else {
    // Not Signed in
    res.status(401).json({
      error:
        'Not signed in. Why are you trying to access sensitive information or attack my site? :(',
    })
  }
}
