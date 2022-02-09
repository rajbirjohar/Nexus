import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
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
import Dropdown from '@/components/Layout/Dropdown'
import Link from 'next/link'
import { WebsiteIcon, InstagramIcon, FacebookIcon, TwitterIcon, SlackIcon, DiscordIcon } from '@/components/Icons'
import formstyles from '@/styles/form.module.css'

const Organization = ({ organization, superMembers, members }) => {
  const router = useRouter()
  const { id } = router.query
  const { data: session } = useSession()
  const orgId = organization.map((organization) => organization._id).toString()
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
    <Page
      title={`${organization.map(
        (organization) => organization.organizationName
      )}`}
      tip={null}
    >
      {organization.map((organization) => (
        <section key={organization._id}>
          <div className={styles.organizationHeader}>
            <div className={styles.organizationInner}>
              {organization.organizationImageURL && (
                <Image
                  src={organization.organizationImageURL}
                  width={75}
                  height={75}
                  className={styles.rounded}
                  alt="Thumbnail"
                />
              )}{' '}
              <h1>{organization.organizationName}</h1>
            </div>
            <div>
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
              {session && isCreator && (
                <Link
                  href={`/organizations/${organization.organizationName}/settings`}
                  passHref
                >
                  <button>Settings</button>
                </Link>
              )}
            </div>
          </div>
          {}
          <div className={styles.socialHeader}>
            {organization.organizationWebsite && (
                <a target="_blank" rel="noopener noreferrer" className={styles.socialItem} href={organization.organizationWebsite}>
                  <svg className={formstyles.webicon}>
                    <WebsiteIcon />
                  </svg>
                </a>
            )}

            {organization.organizationInstagram && (
                <a target="_blank" rel="noopener noreferrer" className={styles.socialItem} href={organization.organizationInstagram}>
                  <svg className={formstyles.webicon}>
                    <InstagramIcon />
                  </svg>
                </a>
            )}

            {organization.organizationFacebook && (
                <a target="_blank" rel="noopener noreferrer" className={styles.socialItem} href={organization.organizationFacebook}>
                  <svg className={formstyles.webicon}>
                    <FacebookIcon />
                  </svg>
                </a>
            )}

            {organization.organizationTwitter && (
                <a target="_blank" rel="noopener noreferrer" className={styles.socialItem} href={organization.organizationTwitter}>
                  <svg className={formstyles.webicon}>
                    <TwitterIcon />
                  </svg>
                </a>
            )}

            {organization.organizationSlack && (
                <a target="_blank" rel="noopener noreferrer" className={styles.socialItem} href={organization.organizationSlack}>
                  <svg className={formstyles.webicon}>
                    <SlackIcon />
                  </svg>
                </a>
            )}

            {organization.organizationDiscord && (
                <a target="_blank" rel="noopener noreferrer" className={styles.socialItem} href={organization.organizationDiscord}>
                  <svg className={formstyles.webicon}>
                    <DiscordIcon />
                  </svg>
                </a>
            )}
          </div>

          <h4>{organization.organizationTagline}</h4>
          <div
            // I don't know how to feel about using this
            // but apparently it is the most recommended way
            // of displaying raw html
            dangerouslySetInnerHTML={{
              __html: `${organization.organizationDescription}`,
            }}
          />
          {((session && isAdmin) || (session && isMember)) && (
            <>
              <h2>Admins</h2>
              <ul className={styles.memberslist}>
                {superMembers.map((superMember) => (
                  <li className={styles.members} key={superMember.adminId}>
                    <strong>{superMember.admin} </strong> / {superMember.email}
                  </li>
                ))}
              </ul>
            </>
          )}

          {session && isAdmin && (
            <>
              <Dropdown heading="Members">
                {members.length === 0 && (
                  <p>No one has joined your organization yet 😭.</p>
                )}
                {members.map((member) => (
                  <li className={styles.members} key={member.memberId}>
                    <strong>{member.member}</strong> / {member.email} /{' '}
                    <RemoveMemberAdminForm
                      memberId={member.memberId}
                      organizationId={organization._id}
                      organizationName={organization.organizationName}
                    />
                  </li>
                ))}
              </Dropdown>
              <Dropdown heading="Create Event">
                <EventForm
                  creator={session.user.name}
                  email={session.user.email}
                  organizationName={organization.organizationName}
                  organizationId={organization._id}
                />
              </Dropdown>
              <Dropdown heading="Add Admin">
                <AddAdminForm organizationId={organization._id} />
              </Dropdown>
            </>
          )}
          <h2>Events</h2>
          <ListEventsPerOrg organizationId={organization._id} />
        </section>
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
