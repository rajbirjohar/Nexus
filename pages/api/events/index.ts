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
          name,
          details,
          startDate,
          endDate,
          newImage,
          commentlock,
          tags,
        },
      } = req.body
      let cloudinaryRes = {
        secure_url: image,
        public_id: imagePublicId,
      }
      if (image) {
        await cloudinary.uploader.destroy(imagePublicId)
      }
      if (newImage) {
        cloudinaryRes = await cloudinary.uploader.upload(newImage)
      }
      await db.collection('events').updateOne(
        { _id: new mongodb.ObjectId(eventId) },
        {
          $set: {
            name: name,
            details: details,
            startDate: zonedTimeToUtc(startDate, 'America/Los_Angeles'),
            endDate: zonedTimeToUtc(endDate, 'America/Los_Angeles'),
            commentlock: commentlock,
            tags: tags,
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
    const query = req.query.event.toString().toLowerCase()

    const events = await db
      .collection('events')
      .find({
        // Search results
        ...(req.query.event
          ? {
              $or: [
                { name: { $regex: `${query}`, $options: 'i' } },
                { details: { $regex: `${query}`, $options: 'i' } },
                { org: { $regex: `${query}`, $options: 'i' } },
                // Search through array of tags text fields only
                { 'tags.text': { $regex: `${query}`, $options: 'i' } },
              ],
            }
          : {
              // Or first 10 results
              ...(req.query.before && {
                // Grab all events after oldest post's startDate
                startDate: { $gt: new Date(req.query.before.toString()) },
              }),
            }),

        // All events that haven't expired
        endDate: { $gte: new Date() },
      })
      .limit(parseInt(req.query.limit.toString(), 10))
      .sort({ startDate: 1 })
      .toArray()
    return res.status(200).json({ events })
  }

  if (req.method === 'POST') {
    if (session) {
      const {
        eventData: {
          org,
          orgId,
          name,
          details,
          startDate,
          endDate,
          image,
          commentlock,
          tags,
        },
      } = req.body
      // Since we only need secure_url and public_id, set as null
      // so if there is no event image submitted, it won't throw an
      // "undefined error"

      let cloudinaryRes = { secure_url: null, public_id: null }
      if (image) {
        cloudinaryRes = await cloudinary.uploader.upload(image)
      }
      await db.collection('events').insertOne({
        orgId: new mongodb.ObjectId(orgId),
        org: org,
        name: name,
        details: details,
        startDate: zonedTimeToUtc(startDate, 'America/Los_Angeles'),
        endDate: zonedTimeToUtc(endDate, 'America/Los_Angeles'),
        commentlock: commentlock,
        tags: tags,
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
