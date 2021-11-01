import Head from 'next/head'
import useSWR from 'swr'
import Fetcher from '@/lib/fetcher'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { connectToDatabase } from '@/util/connectToDb'

// const mongodb = require('mongodb')

const Organization = ({ organization }) => {
  const router = useRouter()
  const { id } = router.query
  return (
    <Layout>
      <Head>
        <title>Nexus | {id}</title>
        {/* Change this icon when we have a logo */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {organization.map((organization) => (
        <>
          <h1>{organization.organizationName}</h1>
          <h3>{organization.organizationDescription}</h3>
        </>
      ))}
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { id } = context.query
  const { db } = await connectToDatabase()
  const organization = await db
    .collection('organizations')
    .find({ organizationName: id })
    .toArray()
  return {
    props: {
      organization: JSON.parse(JSON.stringify(organization)),
    },
  }
}

export default Organization
