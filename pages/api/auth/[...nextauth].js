import NextAuth from 'next-auth'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from 'lib/mongodb'
import GoogleProvider from 'next-auth/providers/google'

export default async function auth(req, res) {
  return await NextAuth(req, res, {
    adapter: MongoDBAdapter({ db: (await clientPromise).db('NexusDatabase') }),
    //Configure one or more authentication providers
    //We will solely use Google, preferably within a single domain
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    ],

    //TODO: Create a custom sign in page
    //   pages: {
    //     signIn: '/signin',
    //   },
    //A Database residing in MongoDB is used to persist user accounts
    database: process.env.MONGODB_URI,
  })
}
