import Link from 'next/link'
import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import OrganizationCard from '@/components/Organizations/OrganizationCard'
import Loader from '@/components/Layout/Skeleton'
import styles from '@/styles/organizations.module.css'
import cardstyles from '@/styles/card.module.css'
import ErrorFetch from '../Layout/ErrorFetch'

export default function ListUserOrganizations() {
  const { data, error } = useSWR('/api/users/userorgfetch', fetcher, {
    refreshInterval: 1000,
  })
  if (error) {
    return <ErrorFetch placeholder="organizations" />
  }
  if (!data) {
    return <Loader />
  }
  return (
    <div>
      <h3 className={styles.subtitle}>Created</h3>
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
            organizationImage={organization.organizationImageURL}
          />
        ))}
      </div>
      <h3 className={styles.subtitle}>Admined</h3>
      <div className={cardstyles.grid}>
        {data.adminOrganizations.length === 0 && (
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
            organizationImage={organization.organizationImageURL}
          />
        ))}
      </div>
      <h3 className={styles.subtitle}>Joined</h3>
      <div className={cardstyles.grid}>
        {data.memberOrganizations.length === 0 && (
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
            organizationImage={organization.organizationImageURL}
          />
        ))}
      </div>
    </div>
  )
}
