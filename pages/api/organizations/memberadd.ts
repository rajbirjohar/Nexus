import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import clientPromise from '@/lib/mongodb'
const mongodb = require('mongodb')

export default async function addMember(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  if (session) {
    const {
      memberData: { organizationId, email },
    } = req.body
    const userDetails = await db
      .collection('users')
      .aggregate([
        {
          $match: { email: email },
        },
        {
          $project: {
            memberId: '$_id',
            member: '$name',
            email: '$email',
            _id: 0,
          },
        },
      ])
      .toArray()
    await db.collection('users').updateOne(
      {
        email: email,
      },
      {
        $push: {
          memberOfOrg: new mongodb.ObjectId(organizationId),
        },
      }
    )
    await db.collection('organizations').updateOne(
      { _id: new mongodb.ObjectId(organizationId) },
      {
        $addToSet: {
          // We use userDetails[0] because mongodb returns
          // the document as an object within an array via
          // the .toArray() function. We don't want the array
          // format though so we instead find the 0th index
          // since there will only ever be one item within
          // the returned array since emails are unique
          membersList: userDetails[0],
        },
      }
    )
    res.status(200).json({ message: 'Successfully added member.' })
  } else {
    // Not Signed in
    res.status(401).json({
      error:
        'Not signed in. Why are you trying to access sensitive information or attack my site? :(',
    })
  }
}
