import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Layout from '@/components/Layout'
import clientPromise from '@/lib/mongodb'
var mongodb = require('mongodb')

const Organization = ({ organization, superMembers }) => {
  const router = useRouter()
  const { id } = router.query
  const { data: session, status } = useSession()
  return (
    <>
      <Layout>
        <Head>
          <title>Nexus | {organization.organizationName}</title>
          {/* Change this icon when we have a logo */}
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {organization.map((organization) => (
          <>
            <h1>{organization.organizationName}</h1>
            <h4>{organization.organizationTagline}</h4>
            <p>{organization.organizationDescription}</p>
            <h3>Admins</h3>
            {superMembers.map((superMember) => (
              <li key={superMember.name}>{superMember.name}</li>
            ))}
            {session &&
              session.user.adminOfOrg &&
              session.user.adminOfOrg === organization.organizationName && (
                <>
                  <h3>Members</h3>
                </>
              )}
            <h3>Events</h3>
          </>
        ))}
      </Layout>
    </>
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
    .find({ _id: new mongodb.ObjectID(id) })
    .toArray()
  const superMembers = await db
    .collection('organizations')
    .aggregate([
      { $match: { _id: new mongodb.ObjectID(id) } },
      { $unwind: '$superMembersList' },
      {
        $project: {
          name: '$superMembersList.name',
          email: '$superMembersList.email',
        },
      },
    ])
    .toArray()
  return {
    props: {
      organization: JSON.parse(JSON.stringify(organization)),
      superMembers: JSON.parse(JSON.stringify(superMembers)),
    },
  }
}

export default Organization
