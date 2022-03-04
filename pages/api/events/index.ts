import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'
import { getSession } from 'next-auth/react'
import { zonedTimeToUtc } from 'date-fns-tz'
const mongodb = require('mongodb')
const cloudinary = require('cloudinary').v2

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGO_DB)
  if (req.method === 'PATCH') {
    if (session) {
      const {
        eventData: {
          eventId,
          imagePublicId,
          image,
          _name,
          _details,
          _startDate,
          _endDate,
          _newImage,
          _commentlock,
          _tags,
        },
      } = req.body
      let cloudinaryRes = {
        secure_url: image,
        public_id: imagePublicId,
      }
      if (image) {
        await cloudinary.uploader.destroy(imagePublicId)
      }
      if (_newImage) {
        cloudinaryRes = await cloudinary.uploader.upload(_newImage)
      }
      await db.collection('events').updateOne(
        { _id: new mongodb.ObjectId(eventId) },
        {
          $set: {
            name: _name,
            details: _details,
            startDate: zonedTimeToUtc(_startDate, 'America/Los_Angeles'),
            endDate: zonedTimeToUtc(_endDate, 'America/Los_Angeles'),
            commentlock: _commentlock,
            tags: _tags,
            imageURL: cloudinaryRes.secure_url,
            imagePublicId: cloudinaryRes.public_id,
            createdAt: new Date(),
          },
        }
      )
      res.status(200).json({ message: 'Success.' })
    } else {
      res.status(401).json({
        error: 'Not signed in.',
      })
    }
  }

  // Fetch all events with end dates before today
  if (req.method === 'GET') {
    const events = await db
      .collection('events')
      .find({
        endDate: { $gte: new Date() },
      })
      .sort({ eventStartDate: 1 })
      .toArray()
    return res.status(200).json({ events })
  }

  if (req.method === 'POST') {
    if (session) {
      const {
        eventData: {
          orgName,
          orgId,
          _name,
          _details,
          _startDate,
          _endDate,
          _image,
          _commentlock,
          _tags,
        },
      } = req.body
      // Since we only need secure_url and public_id, set as null
      // so if there is no event image submitted, it won't throw an
      // "undefined error"

      let cloudinaryRes = { secure_url: null, public_id: null }
      if (_image) {
        cloudinaryRes = await cloudinary.uploader.upload(_image)
      }
      await db.collection('events').insertOne({
        orgId: new mongodb.ObjectId(orgId),
        orgName: orgName,
        name: _name,
        details: _details,
        startDate: zonedTimeToUtc(_startDate, 'America/Los_Angeles'),
        endDate: zonedTimeToUtc(_endDate, 'America/Los_Angeles'),
        commentlock: _commentlock,
        tags: _tags,
        imageURL: cloudinaryRes.secure_url,
        imagePublicId: cloudinaryRes.public_id,
        createdAt: new Date(),
      })
      res.status(200).json({ message: 'Success.' })
    } else {
      res.status(401).json({
        error: 'Not signed in.',
      })
    }
  }

  if (req.method === 'DELETE') {
    if (session) {
      const { eventData: eventId, imagePublicId } = req.body
      if (imagePublicId) {
        await cloudinary.uploader.destroy(imagePublicId)
      }
      await db.collection('comments').deleteMany({
        eventId: new mongodb.ObjectId(eventId),
      })
      await db.collection('events').deleteOne({
        _id: new mongodb.ObjectId(eventId),
      })
      res.status(200).json({ message: 'Success.' })
    } else {
      res.status(401).json({
        error: 'Not signed in',
      })
    }
  }
}
