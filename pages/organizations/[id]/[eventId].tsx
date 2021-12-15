import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import clientPromise from '@/lib/mongodb'
import styles from '@/styles/events.module.css'
import formstyles from '@/styles/form.module.css'
import { useSession } from 'next-auth/react'
import CommentsForm from '@/components/Events/CommentsForm'
import ListComments from '@/components/Events/ListComments'
import toast from 'react-hot-toast'
const mongodb = require('mongodb')

const Event = ({ event }) => {
  const { data: session } = useSession()
  const router = useRouter()
  const { eventId } = router.query
  const organizationName = event.map((event) => event.organizationName)
  const deleteEvent = async (event) => {
    const response = await fetch(`/api/events/eventdelete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ eventData: eventId }),
    })
    await response.json()
    if (response.status === 200) {
      router.push(`/organizations/${organizationName}`)
      toast.success('Deleted event.')
    } else {
      toast.error(
        'Uh oh. Something went wrong. If this persists, please let us know.'
      )
    }
  }
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
            Starts{' '}
            {new Date(event.eventStartDate).toLocaleString('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
            <br />
            Ends{' '}
            {new Date(event.eventEndDate).toLocaleString('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </span>
          <h3>Event Details</h3>
          <p>{event.eventDetails}</p>
          {session &&
            session.user.adminOfOrg &&
            session.user.adminOfOrg.includes(event.organizationId) && (
              <button onClick={deleteEvent} className={formstyles.deleteaction}>
                Delete Event
              </button>
            )}
          {session &&
            session.user.creatorOfOrg &&
            session.user.creatorOfOrg.includes(event.organizationId) && (
              <button onClick={deleteEvent} className={formstyles.deleteaction}>
                Delete Event
              </button>
            )}

          <h3>Comments</h3>
          {session ? (
            <CommentsForm eventId={event._id} />
          ) : (
            <p>Sign in to comment.</p>
          )}
          <ListComments eventId={event._id} />
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
    .find({ _id: new mongodb.ObjectId(eventId) })
    .toArray()
  const exists = await db
    .collection('events')
    .countDocuments({ _id: new mongodb.ObjectId(eventId) })
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
