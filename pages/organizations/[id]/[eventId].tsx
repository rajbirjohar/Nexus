import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Page from '@/components/Layout/Page'
import clientPromise from '@/lib/mongodb'
import styles from '@/styles/events.module.css'
import formstyles from '@/styles/form.module.css'
import { useSession } from 'next-auth/react'
import CommentsForm from '@/components/Events/CommentsForm'
import ListComments from '@/components/Events/ListComments'
import cardstyles from '@/styles/card.module.css'
import toast from 'react-hot-toast'
import EventEditForm from '@/components/Events/EventEditForm'
import { EditIcon, TrashIcon } from '@/components/Icons'
const mongodb = require('mongodb')
import { AnimatePresence, motion } from 'framer-motion'

const deleteTextWrapper = {
  closed: {
    width: '0',
    transition: {
      when: 'afterChildren',
    },
  },
  open: {
    width: 'auto',
  },
}

const deleteText = {
  closed: {
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
  open: {
    opacity: 1,
    transition: {
      delay: 0.15,
    },
  },
}

export default function Event({ event }) {
  const { data: session } = useSession()
  const router = useRouter()
  const { eventId } = router.query
  const orgId = event.map((event) => event.organizationId).toString()
  const isCreator =
    session &&
    session.user.creatorOfOrg &&
    session.user.creatorOfOrg.includes(orgId)

  const isAdmin =
    isCreator ||
    (session &&
      session.user.adminOfOrg &&
      session.user.adminOfOrg.includes(orgId))
  const [isDelete, setIsDelete] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const wrapperRef = useRef(null)
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false)
    return () => {
      document.removeEventListener('click', handleClickOutside, false)
    }
  }, [])
  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setIsDelete(false)
    }
  }
  const confirmDelete = (eventId, imagePublicId) => {
    if (isDelete === true) {
      deleteEvent({ eventId, imagePublicId })
    } else {
      setIsDelete(true)
    }
  }
  const organizationName = event.map((event) => event.organizationName)
  async function deleteEvent({ eventId, imagePublicId }) {
    const response = await fetch(`/api/events/eventdelete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ eventData: eventId, imagePublicId }),
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
    <Page title={`${event.map((event) => event.eventName)}`} tip={null}>
      {event.map((event) => (
        <>
          <AnimatePresence exitBeforeEnter>
            {isEdit ? (
              <motion.div layout="position">
                <EventEditForm
                  eventId={eventId}
                  _oldEventName={event.eventName}
                  _oldEventDetails={event.eventDetails}
                  _oldEventStartDate={event.eventStartDate}
                  _oldEventEndDate={event.eventEndDate}
                  _oldEventImage={event.eventImageURL}
                  _oldImagePublicId={event.imagePublicId}
                  onHandleChange={setIsEdit}
                />
              </motion.div>
            ) : (
              <motion.div layout="position">
                {event?.eventImageURL && (
                  <div className={styles.banner}>
                    <Image
                      src={event.eventImageURL}
                      layout="fill"
                      objectFit="cover"
                      alt="Banner"
                    />
                  </div>
                )}
                <h1>{event.eventName}</h1>
                <h4 className={styles.author}>
                  By{' '}
                  <Link
                    href={`/organizations/${event.organizationName}`}
                    passHref
                  >
                    <a>{event.organizationName}</a>
                  </Link>
                </h4>
                {new Date(event.eventEndDate) < new Date() && (
                  <p className={cardstyles.expired}>This event has expired.</p>
                )}
                <h3>Event Details</h3>
                <span className={styles.date}>
                  {new Date(event.eventStartDate).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                    timeZone: 'GMT',
                  })}{' '}
                  until{' '}
                  {new Date(event.eventEndDate).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                    timeZone: 'GMT',
                  })}
                </span>
                <p>{event.eventDetails}</p>
              </motion.div>
            )}
          </AnimatePresence>
          {session && isAdmin && (
            <motion.span layout="position" className={formstyles.actions}>
              <button
                onClick={() => confirmDelete(event._id, event.imagePublicId)}
                className={formstyles.deleteicon}
                ref={wrapperRef}
              >
                <TrashIcon />
                <AnimatePresence exitBeforeEnter>
                  {isDelete && (
                    <motion.span
                      variants={deleteTextWrapper}
                      animate={isDelete ? 'open' : 'closed'}
                      initial="closed"
                      exit="closed"
                    >
                      <motion.span variants={deleteText}>Confirm</motion.span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <button
                onClick={() => {
                  setIsEdit(!isEdit)
                }}
                className={formstyles.editicon}
              >
                <EditIcon />
              </button>
            </motion.span>
          )}
          <motion.div layout="position">
            <h3>Comments</h3>
            {session ? (
              <CommentsForm eventId={event._id} />
            ) : (
              <p>Sign in to comment.</p>
            )}
            <ListComments
              eventId={event._id}
              organizationId={event.organizationId}
            />
          </motion.div>
        </>
      ))}
    </Page>
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
