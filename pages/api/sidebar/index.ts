import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  if (req.method === 'GET') {
    const discover = await db
      .collection('events')
      .aggregate([
        {
          $match: {
            endDate: { $gte: new Date() },
          },
        },
        {
          // Select five documents at random
          $sample: {
            size: 5,
          },
        },
      ])
      .sort({ eventStartDate: 1 })
      .toArray()
    return res.status(200).json({ discover })
  }
}
