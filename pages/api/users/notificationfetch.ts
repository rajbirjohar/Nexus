import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'
import { getSession } from 'next-auth/react'
const mongodb = require('mongodb')

// fetchProfilePosts()
// This endpoint will fetch all of our reviews
// that that logged in user has submitted
// from our database and place them into an array
// where we can display them using the reviewPostCard(),
// and listReviewPosts()

export default async function fetchNotifications(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  const session = await getSession({ req })
  if (session) {
    try {
      const notifications = await db
        .collection('users')
        .aggregate([
          {
            $match: { _id: new mongodb.ObjectId(session.user.id) },
          },
          {
            $unwind: '$notifications',
          },
          {
            $project: {
              notifId: '$notifications.notifId',
              notifCreatedAt: '$notifications.notifCreatedAt',
              notifType: '$notifications.notifType',
              message: '$notifications.message',
            },
          },
        ])
        .sort({ notifCreatedAt: -1 })
        .limit(5)
        .toArray()
      return res.status(200).json({ notifications })
    } catch {
      res.status(500)
      res.json({
        error: 'Unable to fetch notifications.',
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
