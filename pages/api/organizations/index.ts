import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'
import { getSession } from 'next-auth/react'
const mongodb = require('mongodb')
const cloudinary = require('cloudinary').v2

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  if (req.method === 'PATCH') {
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
      // Need to figure out a way to allow users to change org name
      // const nameTaken = await db
      //   .collection('organizations')
      //   .find({ organizationName: _newOrganizationName })
      //   .count()
      // if (nameTaken > 0) {
      //   res.status(422).json({ error: 'Event already has a name that exists.' })
      // }
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

  if (req.method === 'GET') {
    const organizations = await db
      .collection('organizations')
      .find({})
      .sort({ organizationName: 1 })
      .toArray()

    res.status(200).json({ organizations })
  }

  if (req.method === 'POST') {
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
          _organizationFacebook,
          _organizationTwitter,
          _organizationSlack,
          _organizationDiscord,
        },
      } = req.body
      const cloudinaryRes = await cloudinary.uploader.upload(
        _organizationImage,
        {
          width: 512,
          height: 512,
          radius: 'max',
          crop: 'fill',
        }
      )
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
          organizationFacebook: _organizationFacebook,
          organizationTwitter: _organizationTwitter,
          organizationSlack: _organizationSlack,
          organizationDiscord: _organizationDiscord,
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
        res.status(200).json({ message: 'Success.' })
      }
    } else {
      // Not Signed in
      res.status(401).json({
        error: 'Not signed in.',
      })
    }
  }

  if (req.method === 'DELETE') {
    if (session) {
      try {
        const {
          organizationData: { organizationId, imagePublicId },
        } = req.body
        if (imagePublicId) {
          const image = await cloudinary.uploader.destroy(imagePublicId)
        }
        // First reset the creator's role so they can make a new org
        await db
          .collection('users')
          .updateOne(
            { _id: new mongodb.ObjectId(session.user.id) },
            { $set: { orgRole: 'none', creatorOfOrg: 'none' } }
          )
        // Remove the orgId from all admins and members
        await db.collection('users').updateMany(
          {},
          {
            $pull: {
              adminOfOrg: new mongodb.ObjectId(organizationId),
              memberOfOrg: new mongodb.ObjectId(organizationId),
            },
          }
        )
        // Delete all events associated with this org
        await db
          .collection('events')
          .deleteMany({ organizationId: new mongodb.ObjectId(organizationId) })
        // Delete the org itself
        const result = await db
          .collection('organizations')
          .deleteOne({ _id: new mongodb.ObjectId(organizationId) })
        res.status(200).json(result.deletedCount)
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
}
