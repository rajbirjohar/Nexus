import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
  //Configure one or more authentication providers
  //We will solely use Google, preferably within a single domain
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session(session, user) {
      session.user.id = user.id
      return session
    },
  },
  //TODO: Create a custom sign in page
  //   pages: {
  //     signIn: '/signin',
  //   },
  //A Database residing in MongoDB is used to persist user accounts
  database: process.env.MONGODB_URI,
})
