import Head from 'next/head'
import Layout from '@/components/Layout'
import { useSession } from 'next-auth/react'
import OrganizationsPostForm from '@/components/Organizations/OrganizationsPostForm'
import ListOrganizations from '@/components/Organizations/ListOrganizations'

export default function OrganizationsPage() {
  const { data: session, status } = useSession()
  return (
    <Layout>
      <Head>
        <title>Nexus | Organizations</title>
        {/* Change this icon when we have a logo */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section>
        <h1>Organizations</h1>
        <p>
          Looking for a specific club or org event? Here you can sort all the
          events by their specific club and read more about them. Try creating your own!
        </p>
        {session && (
          <>
            <OrganizationsPostForm
              name={session.user.name}
              email={session.user.email}
            />
          </>
        )}
        <ListOrganizations />
      </section>
    </Layout>
  )
}
