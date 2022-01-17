import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'
import { getSession } from 'next-auth/react'
import { v2 as cloudinary } from 'cloudinary'
const mongodb = require('mongodb')

const {
  hostname: cloud_name,
  username: api_key,
  password: api_secret,
} = new URL(process.env.CLOUDINARY_URL)

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
})

export default async function deleteEvent(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  if (session) {
    const { eventData: eventId, imagePublicId } = req.body
    const image = await cloudinary.uploader.destroy(imagePublicId)
    const result = await db.collection('events').deleteOne({
      _id: new mongodb.ObjectId(eventId),
    })
    res.status(200).json(result.deletedCount)
  } else {
    res.status(401).json({
      error: 'Not signed in',
    })
  }
}
