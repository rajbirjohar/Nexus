import React from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import Page from '@/components/Layout/Page'
import EventForm from '@/components/Events/EventForm'
import ListEventsPerOrg from '@/components/Events/ListEventsPerOrg'
import clientPromise from '@/lib/mongodb'
import styles from '@/styles/organizations.module.css'
import AddAdminForm from '@/components/Organizations/AddAdminForm'
import AddMemberForm from '@/components/Organizations/AddMemberForm'
import {
  RemoveMemberForm,
  RemoveMemberAdminForm,
} from '@/components/Organizations/RemoveMemberForm'
import Accordion from '@/components/Layout/Accordion'
import Link from 'next/link'
import {
  WebsiteIcon,
  InstagramIcon,
  FacebookIcon,
  TwitterIcon,
  SlackIcon,
  DiscordIcon,
} from '@/components/Icons'
import formstyles from '@/styles/form.module.css'
import Dropdown from '@/components/Layout/Dropdown'
const mongodb = require('mongodb')

export default function Organization({
  organization,
  members,
  admins,
  creator,
}) {
  const { data: session } = useSession()

  const isCreator =
    session &&
    creator.map((creator) => creator.userId).includes(session.user.id)

  const isAdmin =
    session &&
    admins.length > 0 &&
    admins.map((admin) => admin.userId).includes(session.user.id)

  const isMember =
    session &&
    members.length > 0 &&
    members.map((member) => member.userId).includes(session.user.id)

  return (
    <Page
      title={`${organization.map((organization) => organization.name)}`}
      tip={null}
    >
      {organization.map((organization) => (
        <section key={organization._id}>
          <div className={styles.header}>
            <span className={styles.title}>
              {organization.imageURL && (
                <div className={styles.thumbnail}>
                  <Image
                    src={organization.imageURL}
                    width={75}
                    height={75}
                    className={styles.thumbnail}
                    alt="Thumbnail"
                  />
                </div>
              )}{' '}
              <h1>{organization.name}</h1>
            </span>
            <div>
              {session && !isCreator && !isAdmin && !isMember && (
                <AddMemberForm
                  orgId={organization._id}
                  org={organization.name}
                  userId={session.user.id}
                  firstname={session.user.firstname}
                  lastname={session.user.lastname}
                  email={session.user.email}
                  role="member"
                />
              )}
              {session && !isCreator && !isAdmin && isMember && (
                <RemoveMemberForm
                  userId={session.user.id}
                  orgId={organization._id}
                  org={organization.name}
                  role="member"
                />
              )}
              {session && isCreator && (
                <Link
                  href={`/organizations/${organization.name}/settings`}
                  passHref
                >
                  <button>Settings</button>
                </Link>
              )}
            </div>
          </div>

          <h4 className={styles.tagline}>{organization.tagline}</h4>
          <div
            // I don't know how to feel about using this
            // but apparently it is the most recommended way
            // of displaying raw html
            dangerouslySetInnerHTML={{
              __html: `${organization.details}`,
            }}
          />

          <div className={styles.socials}>
            {organization.site && (
              <a
                target="_blank"
                rel="noopener noreferrer"
                className={styles.social}
                href={organization.site}
              >
                <svg className={formstyles.socialicon}>
                  <WebsiteIcon />
                </svg>
              </a>
            )}

            {organization.instagram && (
              <a
                target="_blank"
                rel="noopener noreferrer"
                className={styles.social}
                href={organization.instagram}
              >
                <svg className={formstyles.socialicon}>
                  <InstagramIcon />
                </svg>
              </a>
            )}

            {organization.facebook && (
              <a
                target="_blank"
                rel="noopener noreferrer"
                className={styles.social}
                href={organization.facebook}
              >
                <FacebookIcon />
              </a>
            )}

            {organization.twitter && (
              <a
                target="_blank"
                rel="noopener noreferrer"
                className={styles.social}
                href={organization.twitter}
              >
                <TwitterIcon />
              </a>
            )}

            {organization.slack && (
              <a
                target="_blank"
                rel="noopener noreferrer"
                className={styles.social}
                href={organization.slack}
              >
                <SlackIcon />
              </a>
            )}

            {organization.discord && (
              <a
                target="_blank"
                rel="noopener noreferrer"
                className={styles.social}
                href={organization.discord}
              >
                <DiscordIcon />
              </a>
            )}
          </div>

          {session && (isCreator || isAdmin || isMember) && (
            <>
              <h2>Admins</h2>
              <ul className={styles.memberslist}>
                {creator.map((creator) => (
                  <li className={styles.members} key={creator._id}>
                    <span>
                      <strong>
                        {creator.firstname} {creator.lastname}{' '}
                      </strong>{' '}
                      <br /> {creator.email}
                    </span>
                  </li>
                ))}
                {admins.map((admin) => (
                  <li className={styles.members} key={admin._id}>
                    <span>
                      <strong>{admin.firstname} {admin.lastname} </strong> <br /> {admin.email}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {session && (isCreator || isAdmin) && (
            <>
              <Accordion heading="Members">
                {!members.length && <p>No members have joined.</p>}
                <ul className={styles.memberslist}>
                  {members.map((member) => (
                    <li className={styles.members} key={member.userId}>
                      <span>
                        <strong>{member.firstname}</strong> <br />{' '}
                        {member.email}
                      </span>
                      <Dropdown>
                        <RemoveMemberAdminForm
                          userId={member.userId}
                          orgId={organization._id}
                          org={organization.name}
                          role="member"
                        />
                      </Dropdown>
                    </li>
                  ))}
                </ul>
              </Accordion>
              <Accordion heading="Create Event">
                <EventForm org={organization.name} orgId={organization._id} />
              </Accordion>
              <Accordion heading="Add Admin">
                <AddAdminForm
                  orgId={organization._id}
                  org={organization.name}
                />
              </Accordion>
            </>
          )}
          <h2>Events</h2>
          <ListEventsPerOrg organizationId={organization._id} />
        </section>
      ))}
    </Page>
  )
}

export async function getServerSideProps(context) {
  const { id } = context.query
  const db = (await clientPromise).db(process.env.MONGODB_DB)
  const organization = await db
    .collection('organizations')
    .find({ name: id })
    .toArray()

  if (organization.length < 1) {
    return {
      notFound: true,
    }
  }

  const orgId = organization.map((organization) => organization._id).toString()

  const members = await db
    .collection('relations')
    .find({ orgId: new mongodb.ObjectId(orgId), role: 'member' })
    .toArray()

  const admins = await db
    .collection('relations')
    .find({ orgId: new mongodb.ObjectId(orgId), role: 'admin' })
    .toArray()

  const creator = await db
    .collection('relations')
    .find({ orgId: new mongodb.ObjectId(orgId), role: 'creator' })
    .toArray()

  return {
    props: {
      organization: JSON.parse(JSON.stringify(organization)),
      members: JSON.parse(JSON.stringify(members)),
      admins: JSON.parse(JSON.stringify(admins)),
      creator: JSON.parse(JSON.stringify(creator)),
    },
  }
}
