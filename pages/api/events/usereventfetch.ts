import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import clientPromise from '@/lib/mongodb'
const mongodb = require('mongodb')

// fetchEvents()
// This endpoint will fetch all of our events
// that that logged in user has submitted
// from our database and place them into an array
// where we can display them using the EventCard(),
// and listAllEvents()

export default async function fetchEvents(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  const session = await getSession({ req })
  if (session) {
    const joinedOrganizations = await db
      .collection('users')
      .aggregate([
        {
          $match: { _id: new mongodb.ObjectId(session.user.id) },
        },
        {
          $project: {
            joinedOrgs: {
              $setUnion: ['$adminOfOrg', '$memberOfOrg', ['$creatorOfOrg']],
            },
          },
        },
        {
          $unwind: '$joinedOrgs',
        },
        {
          $project: {
            organizationId: '$joinedOrgs',
          },
        },
      ])
      .toArray()
    const flattenedArray = joinedOrganizations.map(
      (org) => new mongodb.ObjectId(org.organizationId)
    )
    const events = await db
      .collection('events')
      .find({
        organizationId: { $in: flattenedArray },
        eventEndDate: { $gte: new Date() },
      })
      .toArray()

    return res.status(200).json({ events })
  } else {
    res.status(401).json({
      error:
        'Not signed in. Why are you trying to access sensitive information or attack my site? :(',
    })
  }
}
