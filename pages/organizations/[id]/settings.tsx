import Page from '@/components/Layout/Page'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import clientPromise from '@/lib/mongodb'
import DeleteOrganization from '@/components/Organizations/DeleteOrganization'
import TransferOwnerForm from '@/components/Organizations/TransferOwnerForm'
import RemoveAdminForm from '@/components/Organizations/RemoveAdminForm'
import styles from '@/styles/organizations.module.css'
import formstyles from '@/styles/form.module.css'
import { LeftChevronIcon } from '@/components/Icons'
import Link from 'next/link'

export default function Settings({ organization }) {
  const router = useRouter()
  const { id } = router.query
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
      <Link href={`/organizations/${id}`} passHref>
        <a className={formstyles.linkwrap}>
          <LeftChevronIcon />
          Go back to Organization
        </a>
      </Link>
      <h1>Settings</h1>
      {session && isCreator ? (
        <section>
          <p>
            Only the organization owner can view and perform these actions.
            Please read through each warning before proceeding.
          </p>
          {organization.map((organization) => (
            <section key={organization._id} className={styles.dangeractions}>
              <div className={styles.danger}>
                <RemoveAdminForm organizationId={organization._id} />
              </div>
              <div className={styles.danger}>
                <TransferOwnerForm organizationId={organization._id} />
              </div>
              <div className={styles.danger}>
                <DeleteOrganization
                  organizationId={organization._id}
                  organizationName={organization.organizationName}
                  imagePublicId={organization.imagePublicId}
                />
              </div>
            </section>
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
