import Link from 'next/link'
import Image from 'next/image'
import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import OrganizationCard from '@/components/Organizations/OrganizationCard'
import Loader from '@/components/Skeleton'
import styles from '@/styles/organizations.module.css'
import cardstyles from '@/styles/card.module.css'

// Component: ListOrganizations()
// Params: None
// Purpose: To list all OrganizationCard({key, organizationId, organizationName, organizationDescription, organizer})
// components via mapping from useSWR hook at orgfetch api

export default function ListUserOrganizations() {
  const { data, error } = useSWR('/api/organizations/userorgfetch', fetcher, {
    refreshInterval: 1000,
  })
  if (error) {
    return (
      <div className={styles.serverdown}>
        <p>
          Oops. Looks like the organizations are not being fetched right now. If
          this persists, please let us know.
        </p>
        <Image
          src={'/assets/server.svg'}
          height={500}
          width={500}
          alt="Server Down Image"
        />
      </div>
    )
  }
  if (!data) {
    return <Loader />
  }
  return (
    <>
      <h3>Created Organizations</h3>
      <div className={cardstyles.grid}>
        {data.creatorOrganization.length === 0 && (
          <Link href="/organizations" passHref>
            <a>Create your first organization!</a>
          </Link>
        )}
        {data.creatorOrganization.map((organization) => (
          <OrganizationCard
            key={organization._id}
            organizationId={organization._id}
            organizationName={organization.organizationName}
            organizationTagline={organization.organizationTagline}
          />
        ))}
      </div>
      <h3>Admined Organizations</h3>
      <div className={cardstyles.grid}>
        {data.creatorOrganization.length === 0 && (
          <p>
            You are not an Admin of any organization. If this is a mistake,
            contact your organization creator to add you as an Admin.
          </p>
        )}
        {data.adminOrganizations.map((organization) => (
          <OrganizationCard
            key={organization._id}
            organizationId={organization._id}
            organizationName={organization.organizationName}
            organizationTagline={organization.organizationTagline}
          />
        ))}
      </div>
      <h3>Joined Organizations</h3>
      <div className={cardstyles.grid}>
        {data.creatorOrganization.length === 0 && (
          <Link href="/organizations" passHref>
            <a>Join your first organization!</a>
          </Link>
        )}
        {data.memberOrganizations.map((organization) => (
          <OrganizationCard
            key={organization._id}
            organizationId={organization._id}
            organizationName={organization.organizationName}
            organizationTagline={organization.organizationTagline}
          />
        ))}
      </div>
    </>
  )
}
