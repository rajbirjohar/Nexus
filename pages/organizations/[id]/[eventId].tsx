import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Page from '@/components/Layout/Page'
import clientPromise from '@/lib/mongodb'
import styles from '@/styles/events.module.css'
import { useSession } from 'next-auth/react'
import CommentsForm from '@/components/Events/Comments/CommentsForm'
import ListComments from '@/components/Events/Comments/ListComments'
import toast from 'react-hot-toast'
import EventEditForm from '@/components/Events/EventEditForm'
import { EditIcon, TrashIcon } from '@/components/Icons'
const mongodb = require('mongodb')
import { AnimatePresence, motion } from 'framer-motion'
import formstyles from '@/styles/form.module.css'

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

export default function Event({ event, creator, admins }) {
  const { data: session } = useSession()
  const router = useRouter()
  const { eventId } = router.query

  const start = event.map((event) => event.startDate)
  const end = event.map((event) => event.endDate)

  const [startMonth, startDay, startYear, startHour] = [
    new Date(start).toLocaleString('en-US', { month: 'short' }),
    new Date(start).getDate(),
    new Date(start).getFullYear(),
    new Date(start).toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
  ]
  const [endMonth, endDay, endYear, endHour] = [
    new Date(end).toLocaleString('default', { month: 'short' }),
    new Date(end).getDate(),
    new Date(end).getFullYear(),
    new Date(end).toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
  ]

  const isCreator =
    session &&
    creator.map((creator) => creator.userId).includes(session.user.id)

  const isAdmin =
    (session && isCreator) ||
    (session &&
      admins.map((admin) => admin.userId).includes(session.user.id))

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
      deleteEvent(eventId, imagePublicId)
    } else {
      setIsDelete(true)
    }
  }

  async function deleteEvent(eventId, imagePublicId) {
    const orgName = event.map((event) => event.orgName)
    const response = await fetch(`/api/events`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ eventData: eventId, imagePublicId }),
    })
    await response.json()
    if (response.status === 200) {
      router.push(`/organizations/${orgName}`)
      toast.success('Deleted event.')
    } else {
      toast.error(
        'Uh oh. Something went wrong. If this persists, please let us know.'
      )
    }
  }

  return (
    <Page title={`${event.map((event) => event.name)}`} tip={null}>
      {event.map((event) => (
        <section key={event._id} className={styles.hero}>
          {isEdit ? (
            <EventEditForm
              eventId={eventId}
              name={event.name}
              details={event.details}
              startDate={event.startDate}
              endDate={event.endDate}
              image={event.imageURL}
              imagePublicId={event.imagePublicId}
              commentlock={event.commentlock}
              tags={event.tags}
              setIsEdit={setIsEdit}
              isEdit={isEdit}
            />
          ) : (
            <div>
              {event?.imageURL && (
                <div className={styles.banner}>
                  <Image
                    src={event.imageURL}
                    layout="fill"
                    objectFit="cover"
                    alt="Banner"
                  />
                </div>
              )}
              {new Date(event.endDate) < new Date() && (
                <p className={styles.expired}>This event has expired.</p>
              )}
              <h1 className={styles.title}>{event.name}</h1>
              <h3 className={styles.author}>
                By{' '}
                <Link href={`/organizations/${event.org}`} passHref>
                  <a>{event.org}</a>
                </Link>
              </h3>
              <time className={styles.date}>
                {/* Always display start month day and time */}
                {startMonth} {startDay}
                {/* Display year if year != current year */}
                {startYear != new Date().getFullYear() && (
                  <>{startYear}</>
                )} @ {startHour} -{' '}
                {/* Display end month and day if start month != end month */}
                {(startMonth != endMonth || startDay != endDay) && (
                  <>
                    {endMonth} {endDay}
                    {/* Display end year if end year != current year */}
                    {endYear != new Date().getFullYear() && (
                      <>{startYear}</>
                    )} @ {endHour}
                  </>
                )}{' '}
                {/* Display end time if start month === end month and start day === end day */}
                {startMonth === endMonth && startDay === endDay && (
                  <>{endHour}</>
                )}
              </time>
              <hr />
              <div
                // I don't know how to feel about using this
                // but apparently it is the most recommended way
                // of displaying raw html
                dangerouslySetInnerHTML={{ __html: `${event.details}` }}
              />
              {event.tags && (
                <div className={styles.tagwrapper}>
                  {event.tags.map((tag) => (
                    <Link key={tag.id} href={`/events/tags/${tag.id}`} passHref>
                      <span className={styles.tag}>{tag.text}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
          {session && isAdmin && (
            <div className={styles.actions}>
              <button
                onClick={() => confirmDelete(event._id, event.imagePublicId)}
                className={formstyles.delete}
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
                className={formstyles.edit}
              >
                <EditIcon />
              </button>
            </div>
          )}

          {session ? (
            <>
              {!event.commentlock ? (
                <CommentsForm
                  eventId={event._id}
                  orgId={event.orgId}
                  author={session.user.firstname}
                  authorId={session.user.id}
                  email={session.user.email}
                />
              ) : (
                <p className={styles.subtitle}>Comments are locked.</p>
              )}
            </>
          ) : (
            <p className={styles.subtitle}>Sign in to comment.</p>
          )}
          <ListComments eventId={event._id} isAdmin={isAdmin} />
        </section>
      ))}
    </Page>
  )
}

export async function getServerSideProps(context) {
  const { eventId } = context.query

  const db = (await clientPromise).db(process.env.MONGODB_DB)

  const event = await db
    .collection('events')
    .find({ _id: new mongodb.ObjectId(eventId) })
    .toArray()

  // Org that owns the event
  const orgId = event.map((event) => event.orgId).toString()

  const admins = await db
    .collection('relations')
    .find({ orgId: new mongodb.ObjectId(orgId), role: 'admin' })
    .toArray()

  const creator = await db
    .collection('relations')
    .find({ orgId: new mongodb.ObjectId(orgId), role: 'creator' })
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
      creator: JSON.parse(JSON.stringify(creator)),
      admins: JSON.parse(JSON.stringify(admins)),
    },
  }
}
