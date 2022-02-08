import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import clientPromise from '@/lib/mongodb'
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

export default async function createOrganization(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  if (session) {
    const {
      organizationData: {
        organizerId,
        organizer,
        email,
        _organizationName,
        _organizationTagline,
        _organizationDescription,
        _organizationImage,
        _organizationWebsite,
        _organizationInstagram,
      },
    } = req.body
    const cloudinaryRes = await cloudinary.uploader.upload(_organizationImage, {
      width: 512,
      height: 512,
      radius: 'max',
      crop: 'fill',
    })
    const nameTaken = await db
      .collection('organizations')
      .find({ organizationName: _organizationName })
      .count()
    if (nameTaken > 0) {
      res.status(422).json({ error: 'Event already has a name that exists.' })
    } else {
      const organization = await db.collection('organizations').insertOne({
        organizerId: new mongodb.ObjectId(organizerId),
        organizer: organizer,
        email: email,
        organizationName: _organizationName,
        organizationTagline: _organizationTagline,
        organizationDescription: _organizationDescription,
        organizationWebsite: _organizationWebsite,
        organizationInstagram: _organizationInstagram,
        superMembersList: [
          {
            adminId: new mongodb.ObjectId(organizerId),
            admin: organizer,
            email: email,
          },
        ],
        membersList: [],
        organizationImageURL: cloudinaryRes.secure_url,
        imagePublicId: cloudinaryRes.public_id,
      })
      await db.collection('users').updateOne(
        {
          _id: new mongodb.ObjectId(session.user.id),
        },
        { $set: { creatorOfOrg: organization.insertedId } }
      )
      res.status(200).json({ message: 'Successfully posted organization.' })
    }
  } else {
    // Not Signed in
    res.status(401).json({
      error:
        'Not signed in. Why are you trying to access sensitive information or attack my site? :(',
    })
  }
}
