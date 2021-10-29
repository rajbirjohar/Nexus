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
