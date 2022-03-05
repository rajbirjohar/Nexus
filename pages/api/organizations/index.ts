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
        orgData: {
          orgId,
          // Don't allow editing org names for now
          // name,
          tagline,
          details,
          site,
          instagram,
          facebook,
          twitter,
          slack,
          discord,
          newImage,
          image,
          imagePublicId,
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

      await db.collection('organizations').updateOne(
        { _id: new mongodb.ObjectId(orgId) },
        {
          $set: {
            // name: name,
            tagline: tagline,
            details: details,
            site: site,
            instagram: instagram,
            facebook: facebook,
            twitter: twitter,
            slack: slack,
            discord: discord,
            imageURL: cloudinaryRes.secure_url,
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
    const query = req.query.org.toString().toLowerCase()

    // await db.collection('organizations').createIndex({
    //   name: 'text',
    //   details: 'text',
    // })

    const organizations = await db
      .collection('organizations')
      .find({
        // To support search
        ...(req.query.org
          ? {
              $or: [
                // This solution is okay for now but would probably need to migrate it if it gets too big
                { name: { $regex: `${query}`, $options: 'i' } },
                { details: { $regex: `${query}`, $options: 'i' } },
              ],
              // name: { $regex: `${query}`, $options: 'i' },
              // $text: { $search: `${query}` },
            }
          : {
              ...(req.query.before && {
                name: { $gte: req.query.before.toString() },
              }),
            }),
      })
      .sort({ name: 1 })
      .limit(parseInt(req.query.limit.toString(), 10))
      .toArray()

    res.status(200).json({ organizations })
  }

  if (req.method === 'POST') {
    if (session) {
      const {
        orgData: {
          creatorId,
          creatorFirstName,
          creatorLastName,
          email,
          name,
          tagline,
          details,
          image,
          site,
          instagram,
          facebook,
          twitter,
          slack,
          discord,
        },
      } = req.body
      const cloudinaryRes = await cloudinary.uploader.upload(image, {
        width: 512,
        height: 512,
        radius: 'max',
        crop: 'fill',
      })
      const nameTaken = await db
        .collection('organizations')
        .find({ name: name })
        .count()
      if (nameTaken > 0) {
        res
          .status(422)
          .json({ error: 'Organization already has a name that exists.' })
      } else {
        const org = await db.collection('organizations').insertOne({
          creatorId: new mongodb.ObjectId(creatorId),
          creatorFirstName: creatorFirstName,
          creatorLastName: creatorLastName,
          email: email,
          name: name,
          tagline: tagline,
          details: details,
          site: site,
          instagram: instagram,
          facebook: facebook,
          twitter: twitter,
          slack: slack,
          discord: discord,
          imageURL: cloudinaryRes.secure_url,
          imagePublicId: cloudinaryRes.public_id,
        })

        await db.collection('relations').insertOne({
          userId: new mongodb.ObjectId(session.user.id),
          firstname: session.user.name || session.user.firstname,
          lastname: session.user.lastname,
          email: session.user.email,
          orgId: new mongodb.ObjectId(org.insertedId),
          role: 'creator',
        })

        await db.collection('users').updateOne(
          {
            _id: new mongodb.ObjectId(session.user.id),
          },
          { $pull: { roles: 'precreator' } }
        )
        await db.collection('users').updateOne(
          {
            _id: new mongodb.ObjectId(session.user.id),
          },
          { $push: { roles: 'creator' } }
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
          orgData: { orgId, imagePublicId },
        } = req.body
        if (imagePublicId) {
          await cloudinary.uploader.destroy(imagePublicId)
        }
        // First reset the creator's role so they can make a new org
        await db
          .collection('users')
          .updateOne(
            { _id: new mongodb.ObjectId(session.user.id) },
            { $pull: { roles: 'creator' } }
          )
        // Remove relations from all admins and members
        await db.collection('relations').deleteMany({
          orgId: new mongodb.ObjectId(orgId),
        })
        // Delete all events associated with this org
        await db
          .collection('events')
          .deleteMany({ orgId: new mongodb.ObjectId(orgId) })

        // Delete all comments associated with events associated with this org
        await db
          .collection('comments')
          .deleteMany({ orgId: new mongodb.ObjectId(orgId) })

        // Delete the org itself
        const result = await db
          .collection('organizations')
          .deleteOne({ _id: new mongodb.ObjectId(orgId) })
        res.status(200).json({ message: 'Success' })
      } catch {
        res.status(500)
        res.json({
          error: 'Unable to delete.',
        })
      }
    } else {
      // Not Signed in
      res.status(401).json({
        error: 'Not signed in.',
      })
    }
  }
}
