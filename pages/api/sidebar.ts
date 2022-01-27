import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'

export default async function fetchDiscoverSidebar(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)

  const discover = await db
    .collection('events')
    .aggregate([
      {
        $match: {
          eventEndDate: { $gte: new Date() },
        },
      },
      {
        $sample: {
          size: 3,
        },
      },
    ])
    .sort({ eventStartDate: 1 })
    .toArray()
  return res.status(200).json({ discover })
}
