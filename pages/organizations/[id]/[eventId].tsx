import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import clientPromise from '@/lib/mongodb'
import styles from '@/styles/events.module.css'

const Event = ({ event }) => {
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
          <h4 className={styles.author}>By {event.organizationName}</h4>
          <span className={styles.date}>
            {new Date(event.eventStartDate).toLocaleDateString()} -{' '}
            {new Date(event.eventEndDate).toLocaleDateString()}
          </span>
          <h3>{event.eventDetails}</h3>
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
  const { eventId } = context.query
  const db = (await clientPromise).db(process.env.MONGODB_DB)
  const event = await db
    .collection('events')
    .find({ eventName: eventId })
    .toArray()
  const exists = await db
    .collection('events')
    .countDocuments({ eventName: eventId })
  if (exists < 1) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      event: JSON.parse(JSON.stringify(event)),
    },
  }
}

export default Event
