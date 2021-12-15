import React, { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import Layout from '@/components/Layout'
import EventForm from '@/components/Events/EventForm'
import ListEventsPerOrg from '@/components/Events/ListEventsPerOrg'
import clientPromise from '@/lib/mongodb'
import formstyles from '@/styles/form.module.css'
import AddAdminForm from '@/components/Organizations/AddAdminForm'

const Organization = ({ organization, superMembers }) => {
  const router = useRouter()
  const { id } = router.query
  const { data: session } = useSession()
  const [deleteOrg, setDeleteOrg] = useState({
    _organization: '',
    _organizationConfirmation: '',
  })
  const [displayWarning, setDisplayWarning] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const orgName = organization
      .map((organization) => organization.organizationName)
      .toString()
    if (
      deleteOrg._organization === '' ||
      deleteOrg._organizationConfirmation === ''
    ) {
      toast.error('Please fill out your Organization Name.')
    } else if (
      deleteOrg._organization === orgName &&
      deleteOrg._organizationConfirmation === orgName
    ) {
      deleteOrganization(deleteOrg)
    } else {
      toast.error('Your input is incorrect. Please try again.')
    }
  }

  const handleChange = (event) => {
    setDeleteOrg({
      ...deleteOrg,
      [event.target.name]: event.target.value,
    })
  }

  const deleteOrganization = async (event) => {
    if (session) {
      const res = await fetch('/api/organizations/orgdelete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ organizationData: id }),
      })
      await res.json()
      // wait for status from orgdelete endpoint to post success toast
      if (res.status === 200) {
        router.push('/organizations')
        toast.success('Deleted organization.')
      } else {
        toast.error('Uh oh. Something went wrong.')
      }
    }
  }
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
          <h3>Admins</h3>
          {superMembers.map((superMember) => (
            <li key={superMember.adminId}>{superMember.admin}</li>
          ))}
          {session &&
            session.user.adminOfOrg &&
            session.user.adminOfOrg.includes(organization._id) && (
              <>
                <AddAdminForm organizationId={organization._id} />
                <EventForm
                  organizationName={organization.organizationName}
                  organizationId={organization._id}
                />
              </>
            )}
          {session &&
            session.user.creatorOfOrg &&
            session.user.creatorOfOrg.includes(organization._id) && (
              <>
                <AddAdminForm organizationId={organization._id} />
                <EventForm
                  organizationName={organization.organizationName}
                  organizationId={organization._id}
                />
              </>
            )}
          <h3>Events</h3>
          <ListEventsPerOrg organizationId={organization._id} />
          {/* Checks if user is logged in and the user name matches organizer
        Thus, only the logged in user can access the delete function */}

          {session &&
            session.user.creatorOfOrg &&
            session.user.creatorOfOrg.includes(organization._id) && (
              <>
                <h3>Dangerous Actions</h3>
                <button
                  className={formstyles.deleteaction}
                  onClick={() => setDisplayWarning(!displayWarning)}
                >
                  Delete Organization
                </button>
              </>
            )}
          {displayWarning && (
            <div className={formstyles.warningWrapper}>
              <p>
                <strong>
                  Warning:
                  <br />
                  You understand that deleting this organization will delete all
                  posts, members, and admins from Nexus never to be seen again.
                </strong>
              </p>
              <p>
                <strong>
                  If you are completely sure and aware of the consequences,
                  please fill out the form below.
                </strong>
              </p>
              <p>
                Please enter{' '}
                <strong>&#34;{organization.organizationName}&#34;</strong> to
                delete this organization.
              </p>
              <form onSubmit={handleSubmit} className={formstyles.inputWrapper}>
                <label htmlFor="_Organization">
                  <strong>Organization:</strong>
                </label>
                <input
                  aria-label="Organization Input"
                  name="_organization"
                  value={deleteOrg._organization}
                  onChange={handleChange}
                  type="text"
                  placeholder="Organization"
                  className={formstyles.input}
                />
                <label htmlFor="_Organization">
                  <strong>Confirm Organization:</strong>
                </label>
                <input
                  aria-label="Organization Input"
                  name="_organizationConfirmation"
                  value={deleteOrg._organizationConfirmation}
                  onChange={handleChange}
                  type="text"
                  placeholder="Organization"
                  className={formstyles.input}
                />
                <div className={formstyles.actions}>
                  <button className={formstyles.deleteaction} type="submit">
                    Delete
                  </button>
                </div>
              </form>
            </div>
          )}
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
          adminId: '$superMembersList.admin',
          admin: '$superMembersList.admin',
          email: '$superMembersList.email',
        },
      },
    ])
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
    },
  }
}

export default Organization
