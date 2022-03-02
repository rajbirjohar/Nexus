import clientPromise from '@/lib/mongodb'
import { getSession } from 'next-auth/react'
import { NextApiRequest, NextApiResponse } from 'next'
const mongodb = require('mongodb')

const fetchProfileOpportunities = async (
    req: NextApiRequest,
    res: NextApiResponse
    ) => {
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  const session = await getSession({ req })
  if (session) {
    try {
      const opportunities = await db
        .collection('opportunities')
        .find({ authorId: session.user.id })
        .sort({ createdAt: -1 })
        .toArray()
      return res.status(200).json({ opportunities })
    } catch {
      res.status(500)
      res.json({
        error: 'Unable to delete entry or accessing sensitive routes.',
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

export default fetchProfileOpportunities
