import React, { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Layout from '@/components/Layout'
import EventForm from '@/components/Events/EventForm'
import ListEventsPerOrg from '@/components/Events/ListEventsPerOrg'
import clientPromise from '@/lib/mongodb'
import styles from '@/styles/organizations.module.css'
import formstyles from '@/styles/form.module.css'
import AddAdminForm from '@/components/Organizations/AddAdminForm'
import AddMemberForm from '@/components/Organizations/AddMemberForm'
import RemoveMemberForm from '@/components/Organizations/RemoveMemberForm'
import DangerousActions from '@/components/Organizations/DangerousActions'

const Organization = ({ organization, superMembers, members }) => {
  const router = useRouter()
  const { id } = router.query
  const { data: session } = useSession()
  const orgId = organization.map((organization) => organization._id).toString()
  const [displayActions, setDisplayActions] = useState(false)
  const [displayMembers, setDisplayMembers] = useState(false)
  const isCreator =
    session &&
    session.user.creatorOfOrg &&
    session.user.creatorOfOrg.includes(orgId)

  const isAdmin =
    isCreator ||
    (session &&
      session.user.adminOfOrg &&
      session.user.adminOfOrg.includes(orgId))

  const isMember =
    session &&
    session.user.memberOfOrg &&
    session.user.memberOfOrg.includes(orgId)

  const isNotMember = !isAdmin && !isMember

  return (
    <Layout>
      {organization.map((organization) => (
        <>
          <Head>
            <title>Nexus | {organization.organizationName}</title>
            {/* Change this icon when we have a logo */}
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <h1>{organization.organizationName}</h1>
          <h4>{organization.organizationTagline}</h4>
          <p>{organization.organizationDescription}</p>
          {session && isNotMember && (
            <AddMemberForm
              memberId={session.user.id}
              organizationId={organization._id}
              organizationName={organization.organizationName}
            />
          )}
          {session && isMember && (
            <RemoveMemberForm
              memberId={session.user.id}
              organizationId={organization._id}
              organizationName={organization.organizationName}
            />
          )}
          <h3>Admins</h3>
          <ul className={styles.memberslist}>
            {superMembers.map((superMember) => (
              <li key={superMember.adminId}>
                <strong>{superMember.admin} </strong> / {superMember.email}
              </li>
            ))}
          </ul>
          {session && isAdmin && (
            <>
              <AddAdminForm organizationId={organization._id} />
              <EventForm
                creator={session.user.name}
                email={session.user.email}
                organizationName={organization.organizationName}
                organizationId={organization._id}
              />
              <h3>Members</h3>
              {displayMembers ? (
                <div>
                  <button onClick={() => setDisplayMembers(!displayMembers)}>
                    Hide Members
                  </button>
                  <ul className={styles.memberslist}>
                    {members.length === 0 && (
                      <p>No one has joined your organization yet.</p>
                    )}
                    {members.map((member) => (
                      <li key={member.memberId}>
                        <strong>{member.member}</strong> / {member.email}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div>
                  <button onClick={() => setDisplayMembers(!displayMembers)}>
                    Show Members
                  </button>
                </div>
              )}
            </>
          )}
          {session && isCreator && (
            <>
              <h2>Dangerous Actions</h2>
              <div className={formstyles.revealactions}>
                <button
                  className={formstyles.deleteaction}
                  onClick={() => setDisplayActions(!displayActions)}
                >
                  Show Actions
                </button>
              </div>
              {displayActions && (
                <DangerousActions
                  organizationId={organization._id}
                  organizationName={organization.organizationName}
                />
              )}
            </>
          )}
          <h3>Events</h3>
          <ListEventsPerOrg organizationId={organization._id} />
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
  const organization = await db
    .collection('organizations')
    .find({ organizationName: id })
    .toArray()
  const superMembers = await db
    .collection('organizations')
    .aggregate([
      { $match: { organizationName: id } },
      { $unwind: '$superMembersList' },
      {
        $project: {
          adminId: '$superMembersList.adminId',
          admin: '$superMembersList.admin',
          email: '$superMembersList.email',
        },
      },
    ])
    .sort({ email: 1 })
    .toArray()

  const members = await db
    .collection('organizations')
    .aggregate([
      { $match: { organizationName: id } },
      { $unwind: '$membersList' },
      {
        $project: {
          memberId: '$membersList.memberId',
          member: '$membersList.member',
          email: '$membersList.email',
        },
      },
    ])
    .sort({ email: 1 })
    .toArray()

  const exists = await db
    .collection('organizations')
    .countDocuments({ organizationName: id })
  if (exists < 1) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      organization: JSON.parse(JSON.stringify(organization)),
      superMembers: JSON.parse(JSON.stringify(superMembers)),
      members: JSON.parse(JSON.stringify(members)),
    },
  }
}

export default Organization
