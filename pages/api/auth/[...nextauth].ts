import NextAuth, { Account, Profile, Session, User } from 'next-auth'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from 'lib/mongodb'
import GoogleProvider from 'next-auth/providers/google'
import { JWT } from 'next-auth/jwt'

const maxAge = 30 * 24 * 60 * 60 // 30 days

export default async function auth(req, res) {
  return await NextAuth(req, res, {
    adapter: MongoDBAdapter({
      db: (await clientPromise).db(process.env.MONGODB_DB),
    }),
    //Configure one or more authentication providers
    //We will solely use Google, preferably within a single domain (ucr.edu)
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        profile(profile: {
          sub: string
          name: string
          given_name: string
          family_name: string
          email: string
          picture: string
          roles: any[]
        }) {
          return {
            id: profile.sub,
            name: profile.name,
            firstname: profile.given_name,
            lastname: profile.family_name,
            email: profile.email,
            image: profile.picture,
            roles: [],
          }
        },
      }),
    ],
    pages: {
      signIn: '/auth/signin',
      signOut: '/auth/signout',
      error: '/404', // Error code passed in query string as ?error=
      // verifyRequest: '/auth/verify-request', // (used for check email message)
      newUser: '/profile', // New users will be directed here on first sign in (leave the property out if not of interest)
    },
    callbacks: {
      async session({ session, user }) {
        // Send properties to the client, like an access_token from a provider.
        session.user.firstname = String(user.firstname)
        session.user.lastname = String(user.lastname)
        session.user.id = user.id
        session.user.roles = user.roles
        return session
      },
    },
    // jwt: {
    //   signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,

    // You can also specify a public key for verification if using public/private key (but private only is fine)
    // verificationKey: process.env.JWT_SIGNING_PUBLIC_KEY,

    // If you want to use some key format other than HS512 you can specify custom options to use
    // when verifying (note: verificationOptions should include a value for maxTokenAge as well).
    // verificationOptions: {
    //   maxTokenAge: `${maxAge}s`,
    //   algorithms: ['HS512'],
    // },
    //},
  })
}
