import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from '@/lib/mongodb'
import { getSession } from 'next-auth/react'
import { zonedTimeToUtc } from 'date-fns-tz'

const mongodb = require('mongodb')

export default async function handler(
    req: NextApiRequest, 
    res: NextApiResponse
) {
    const session = await getSession({ req })
    const isConnected = await clientPromise
    const db = isConnected.db(process.env.MONGODB_DB)

        if (req.method === 'PUT') {
        res.status(201).json({});
        }
    
        if (req.method === 'GET') {
            const opportunities = await db
                .collection('opportunities')
                .find({
                    opportunityEndDate: { $gte: new Date() },
                })
                .sort({ opportunityEndDate: 1})
                .toArray()
        res.status(200).json({ opportunities });
        }
    
        if (req.method === 'POST') {
            if (session) {
                const {
                    opportunityData: {
                        opportunityCreator,
                        opportunityId,
                        email,
                        _opportunityDetails,
                        _opportunityName,
                        _opportunityEndDate,
                        _opportunityTags,

                    },
                } = req.body

                await db.collection('opportunities').insertOne({
                    opportunityCreator: opportunityCreator,
                    opportunityId: new mongodb.ObjectId(opportunityId),
                    email: email,
                    oppportunityName: _opportunityName,
                    opportunityDetails: _opportunityDetails,
                    opportunityEndDate: _opportunityEndDate,
                    opportunityTags: _opportunityTags,
                    createdAt: new Date(),
                })

                res.status(200).json({ message: 'Success.' })
            } else {
                res.status(401).json({
                    error: 'Not signed in.',
                })
            }
        res.status(200).json({});
        }

        if(req.method === 'PATCH') {
            if (session) {
                const {
                    newOpportunityData: {
                        opportunityId,
                        creatorId,
                        _newOpportunityPost,
                        _newOpportunityName,
                        _newOpportunityProfessor,
                        _newOpportunityTags,
                        _newOpportunityEndDate,
                    },
                } = req.body
                await db.collection('opportunities').updateOne(
                    {
                        _id: new mongodb.ObjectId(opportunityId),
                        creatorId: new mongodb.ObjectId(creatorId),
                    },
                    {
                        $set: {
                            opportunityName: _newOpportunityName,
                            opportunityPost: _newOpportunityPost,
                            opportunityProfessor: _newOpportunityProfessor,
                            opportunityEndDate: zonedTimeToUtc(
                                _newOpportunityEndDate,
                                'America/Los_Angeles'
                            ),
                            opportunityTags: _newOpportunityTags,
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
                const { opportunityData: opportunityId } = req.body
                const result = await db.collection('opportunities').deleteOne({
                    _id: new mongodb.ObjectId(opportunityId),
                })
                res.status(200).json({ message: 'Success.' })
            } else {
                res.status(401).json({
                    error: 'Not signed in',
                })
            }
        }
  }