import Head from 'next/head'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import Layout from '@/components/Layout'

export default function CoursesPage() {
  const { data: session, status } = useSession()
  return (
    <Layout>
      <Head>
        <title>Nexus | Events</title>
      </Head>
      <section>
        <h1>Events</h1>
        <p>
          This is where you&apos;ll be able to see all events from every org
        </p>
      </section>
    </Layout>
  )
}