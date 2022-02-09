import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'
import { getSession } from 'next-auth/react'
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

export default async function editOrganization(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  if (session) {
    const {
      newOrganizationData: {
        organizationId,
        _newOrganizationName,
        _newOrganizationTagline,
        _newOrganizationDescription,
        _newOrganizationWebsite,
        _newOrganizationInstagram,
        _newOrganizationFacebook,
        _newOrganizationTwitter,
        _newOrganizationSlack,
        _newOrganizationDiscord,
        _newOrganizationImage,
        _oldOrganizationImage,
        _oldImagePublicId,
      },
    } = req.body
    let cloudinaryRes = {
      secure_url: _oldOrganizationImage,
      public_id: _oldImagePublicId,
    }
    if (_oldOrganizationImage) {
      const image = await cloudinary.uploader.destroy(_oldImagePublicId)
    }
    if (_newOrganizationImage) {
      cloudinaryRes = await cloudinary.uploader.upload(_newOrganizationImage)
    }

    await db.collection('organizations').updateOne(
      { _id: new mongodb.ObjectId(organizationId) },
      {
        $set: {
          organizationName: _newOrganizationName,
          organizationTagline: _newOrganizationTagline,
          organizationDescription: _newOrganizationDescription,
          organizationWebsite: _newOrganizationWebsite,
          organizationInstagram: _newOrganizationInstagram,
          organizationFacebook: _newOrganizationFacebook,
          organizationTwitter: _newOrganizationTwitter,
          organizationSlack: _newOrganizationSlack,
          organizationDiscord: _newOrganizationDiscord,
          organizationImageURL: cloudinaryRes.secure_url,
          imagePublicId: cloudinaryRes.public_id,
        },
      }
    )
    res.status(200).json({ message: 'Successfully edited organization.' })
  } else {
    res.status(401).json({
      error: 'Not signed in.',
    })
  }
}
