import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Layout from '@/components/Layout'
import EventForm from '@/components/Events/EventForm'
import clientPromise from '@/lib/mongodb'
const mongodb = require('mongodb')

const Event = ({ event }) => {
  const router = useRouter()
  const { id } = router.query
  const { data: session, status } = useSession()
  return (
    <Layout>
      {event.map((event) => (
        <>
          <Head>
            <title>Nexus | {event.eventName}</title>
            {/* Change this icon when we have a logo */}
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <h1>{event.eventName}</h1>
          <h3>Details</h3>
          <h4>{event.eventDetails}</h4>
        </>
      ))}
    </Layout>
  )
}

// We are using getServerSideProps instead of an endpoint fetched
// with SWR. This allows us to prefetch our data with what is returned
// from the database (a list of all of our courses) mainly because
// this data does not change often so we don't have to revalidate it
// But the dynamic pages that are following it are updated frequently
export async function getServerSideProps(context) {
  const { id } = context.query
  const db = (await clientPromise).db(process.env.MONGODB_DB)
  const event = await db
    .collection('events')
    .find({ _id: new mongodb.ObjectID(id) })
    .toArray()
  return {
    props: {
      event: JSON.parse(JSON.stringify(event)),
    },
  }
}

export default Event
