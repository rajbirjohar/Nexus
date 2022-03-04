import NextAuth from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string
      name: string
      firstname: string
      lastname: string
      email: string
      image: string
      /** The user's role. */
      roles: Array
    }
  }
  interface User {
    roles: Array
  }
}
