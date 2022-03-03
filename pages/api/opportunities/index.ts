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
          _name,
          _details,
          _endDate,
          _tags,
        },
      } = req.body

      await db.collection('opportunities').insertOne({
        authorId: authorId,
        author: author,
        email: email,
        name: _name,
        details: _details,
        endDate: zonedTimeToUtc(_endDate, 'America/Los_Angeles'),
        tags: _tags,
        createdAt: new Date(),
      })

      res.status(200).json({ message: 'Success.' })
    } else {
      res.status(401).json({
        error: 'Not signed in.',
      })
    }
    res.status(200).json({})
  }

  if (req.method === 'PATCH') {
    if (session) {
      const {
        newOpportunityData: {
          authorId,
          author,
          email,
          _newName,
          _newDetails,
          _newEndDate,
          _newTags,
        },
      } = req.body
      await db.collection('opportunities').updateOne(
        {
          _id
        },
        {
          $set: {
            authorId: authorId,
            author: author,
            email: email,
            name: _newName,
            details: _newDetails,
            endDate: zonedTimeToUtc(_newEndDate, 'America/Los_Angeles'),
            tags: _newTags,
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
      const { newOpportunityData } = req.body
      const result = await db.collection('opportunities').deleteOne({ _id })
      res.status(200).json({ message: 'Success.' })
    } else {
      res.status(401).json({
        error: 'Not signed in',
      })
    }
  }
}
