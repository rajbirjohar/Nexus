import NextAuth from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image: string
      /** The user's role. */
      role: string
      orgRole: string
      creatorOfOrg: string
      adminOfOrg: Array
      memberOfOrg: Array
      notifications: Array
    }
  }
  interface User {
    role: string
    orgRole: string
    creatorOfOrg: string
    adminOfOrg: Array
    memberOfOrg: Array
    notifications: Array
  }
}
