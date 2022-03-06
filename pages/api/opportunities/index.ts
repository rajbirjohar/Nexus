import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'
import { getSession } from 'next-auth/react'
import { zonedTimeToUtc } from 'date-fns-tz'
import { _id } from '@next-auth/mongodb-adapter'

const mongodb = require('mongodb')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)

  if (req.method === 'PUT') {
    res.status(200).json({})
  }

  if (req.method === 'GET') {
    const opportunities = await db
      .collection('opportunities')
      .find({
        endDate: { $gte: new Date() },
      })
      .sort({ endDate: 1 })
      .toArray()
    res.status(200).json({ opportunities })
  }

  if (req.method === 'POST') {
    if (session) {
      const {
        opportunityData: {
          authorId,
          author,
          email,
          name,
          details,
          endDate,
          tags,
        },
      } = req.body

      await db.collection('opportunities').insertOne({
        opId: _id,
        authorId: authorId,
        author: author,
        email: email,
        name: name,
        details: details,
        endDate: zonedTimeToUtc(endDate, 'America/Los_Angeles'),
        tags: tags,
        createdAt: new Date(),
      })

      res.status(200).json({ message: 'Success.' })
    } else {
      res.status(401).json({
        error: 'Not signed in.',
      })
    }
  }

  if (req.method === 'PATCH') {
    if (session) {
      const {
        newOpportunityData: {
          opId,
          authorId,
          name,
          details,
          endDate,
          tags,
        },
      } = req.body
      await db.collection('opportunities').updateOne(
        {
          _id: new mongodb.ObjectId(opId),
          // authorId: new mongodb.ObjectId(authorId),
        },
        {
          $set: {
            name: name,
            details: details,
            endDate: zonedTimeToUtc(endDate, 'America/Los_Angeles'),
            tags: tags,
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

  if (req.method === 'DELETE') {
    if (session) {
      const { newOpportunityData: opId, authorId } = req.body
      const result = await db.collection('opportunities').deleteOne({ 
        _id: new mongodb.ObjectId(opId),
        // authorId: new mongodb.ObjectId(authorId),
       })
      res.status(200).json({ message: 'Success.' })
    } else {
      res.status(401).json({
        error: 'Not signed in',
      })
    }
  }
}
