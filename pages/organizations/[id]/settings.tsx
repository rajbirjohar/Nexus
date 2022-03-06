import Page from '@/components/Layout/Page'
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import clientPromise from '@/lib/mongodb'
import DeleteOrganization from '@/components/Organizations/DeleteOrganization'
import TransferOwnerForm from '@/components/Organizations/TransferOwnerForm'
import RemoveAdminForm from '@/components/Organizations/RemoveAdminForm'
import OrganizationEditForm from '@/components/Organizations/OrganizationEditForm'
import styles from '@/styles/organizations.module.css'
import { LeftChevronIcon } from '@/components/Icons'
import Link from 'next/link'
import { useEffect } from 'react'
const mongodb = require('mongodb')

export default function Settings({ organization, creator }) {
  const router = useRouter()
  const { id } = router.query
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/')
      toast.error('Please sign in.')
      // User is not authenticated
    },
  })

  const isCreator =
    session &&
    creator.map((creator) => creator.userId).includes(session.user.id)

  useEffect(() => {
    if (session && !isCreator) {
      router.push('/')
      toast.error('Unauthorized.')
    }
    // Run only once
    /* eslint-disable */
  }, [])

  return (
    <Page title="Settings" tip={null}>
      <Link href={`/organizations/${id}`} passHref>
        <a className={styles.link}>
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
              <OrganizationEditForm
                orgId={organization._id}
                name={organization.name}
                tagline={organization.tagline}
                details={organization.details}
                instagram={organization.instagram}
                facebook={organization.facebook}
                twitter={organization.twitter}
                slack={organization.slack}
                discord={organization.discord}
                site={organization.site}
                image={organization.imageURL}
                imagePublicId={organization.imagePublicId}
              />

              <div className={styles.danger}>
                <RemoveAdminForm orgId={organization._id} />
              </div>
              <div className={styles.danger}>
                <TransferOwnerForm
                  orgId={organization._id}
                  origCreatorId={session.user.id}
                  role="creator"
                />
              </div>
              <div className={styles.danger}>
                <DeleteOrganization
                  orgId={organization._id}
                  name={organization.name}
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
  const session = getSession()
  const db = (await clientPromise).db(process.env.MONGODB_DB)
  const organization = await db
    .collection('organizations')
    .find({ name: id })
    .toArray()

  const orgId = organization.map((organization) => organization._id).toString()

  const creator = await db
    .collection('relations')
    .find({ orgId: new mongodb.ObjectId(orgId), role: 'creator' })
    .toArray()

  if (organization.length < 1) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      organization: JSON.parse(JSON.stringify(organization)),
      creator: JSON.parse(JSON.stringify(creator)),
    },
  }
}
