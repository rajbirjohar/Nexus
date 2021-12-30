import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'
import { getSession } from 'next-auth/react'
const mongodb = require('mongodb')
const cloudinary = require('cloudinary').v2

const {
  hostname: cloud_name,
  username: api_key,
  password: api_secret,
} = new URL(process.env.CLOUDINARY_URL);

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

export default async function createEvent(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  if (session) {
    const {
      newEventData: {
        eventCreator,
        email,
        organizationName,
        organizationId,
        _eventName,
        _eventDetails,
        _eventStartDate,
        _eventEndDate,
        // _eventImage,
      },
    } = req.body
    // const cloudinaryRes = await cloudinary.uploader.upload(_eventImage, function(error, result) {console.log(result, error)})
    // console.log("Cloudinary Response: ", cloudinaryRes.secure_url);
    
    await db.collection('events').insertOne({
      eventCreator: eventCreator,
      email: email,
      organizationId: new mongodb.ObjectId(organizationId),
      organizationName: organizationName,
      eventName: _eventName,
      eventDetails: _eventDetails,
      eventStartDate: new Date(_eventStartDate),
      eventEndDate: new Date(_eventEndDate),
      // eventImageURL: cloudinaryRes.secure_url,
      createdAt: new Date(),
      comments: [],
    })
    res.status(200).json({ message: 'Successfully posted event.' })
  } else {
    res.status(401).json({
      error: 'Not signed in.',
    })
  }
}
