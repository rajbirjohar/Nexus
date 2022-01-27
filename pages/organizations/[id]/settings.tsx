import Page from '@/components/Layout/Page'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import clientPromise from '@/lib/mongodb'
import DeleteOrganization from '@/components/Organizations/DeleteOrganization'
import TransferOwnerForm from '@/components/Organizations/TransferOwnerForm'
import RemoveAdminForm from '@/components/Organizations/RemoveAdminForm'
import useEffect from 'react'

export default function Settings({ organization }) {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/')
      toast.error('Please sign in.')
      // User is not authenticated
    },
  })
  const orgId = organization.map((organization) => organization._id).toString()
  const isCreator =
    session &&
    session.user.creatorOfOrg &&
    session.user.creatorOfOrg.includes(orgId)

  return (
    <Page title="Settings" tip={null}>
      <h1>Settings</h1>

      {session && isCreator ? (
        <section>
          <p>
            Only the organization owner can view and perform these actions.
            Please read through each warning before proceeding.
          </p>
          {organization.map((organization) => (
            <>
              <RemoveAdminForm organizationId={organization._id} />
              <TransferOwnerForm organizationId={organization._id} />
              <DeleteOrganization
                organizationId={organization._id}
                organizationName={organization.organizationName}
                imagePublicId={organization.imagePublicId}
              />
            </>
          ))}
        </section>
      ) : (
        <p>You are not allowed access.</p>
      )}
    </Page>
  )
}

export async function getServerSideProps(context) {
  const { id } = context.query
  const db = (await clientPromise).db(process.env.MONGODB_DB)
  const organization = await db
    .collection('organizations')
    .find({ organizationName: id })
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
    },
  }
}
