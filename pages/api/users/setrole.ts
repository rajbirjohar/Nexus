import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import clientPromise from '@/lib/mongodb'
// import { connectToDatabase } from '@/util/connectToDb'

export default async function setRole(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const isConnected = await clientPromise
  const db = isConnected.db(process.env.MONGODB_DB)
  if (session) {
    const {
      userRoleData: { _role },
    } = req.body
    await db
      .collection('users')
      .updateOne({ email: session.user.email }, { $set: { role: _role } })
    res.status(200).json({ message: 'Successfully updated role.' })
  } else {
    // Not Signed in
    res.status(401).json({
      error:
        'Not signed in. Why are you trying to access sensitive information or attack my site? :(',
    })
  }
}
