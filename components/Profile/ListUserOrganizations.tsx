import Link from 'next/link'
import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import OrganizationCard from '@/components/Organizations/OrganizationCard'
import Loader from '@/components/Layout/Skeleton'
import styles from '@/styles/organizations.module.css'
import cardstyles from '@/styles/card.module.css'
import ErrorFetch from '../Layout/ErrorFetch'

export default function ListUserOrganizations() {
  const { data, error } = useSWR('/api/users/orgs', fetcher, {
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
        {!data.creatorOrg.length && (
          <Link href="/organizations" passHref>
            <a>Create your first organization.</a>
          </Link>
        )}
        {data.creatorOrg.map((org) => (
          <OrganizationCard
            key={org._id}
            name={org.name}
            tagline={org.tagline}
            image={org.imageURL}
          />
        ))}
      </div>
      <h3 className={styles.subtitle}>Admined</h3>
      <div className={cardstyles.grid}>
        {!data.adminOrgs.length && (
          <p>You are not an Admin of any organization.</p>
        )}
        {data.adminOrgs.map((org) => (
          <OrganizationCard
            key={org._id}
            name={org.name}
            tagline={org.tagline}
            image={org.imageURL}
          />
        ))}
      </div>
      <h3 className={styles.subtitle}>Joined</h3>
      <div className={cardstyles.grid}>
        {!data.memberOrgs.length && (
          <Link href="/organizations" passHref>
            <a>Join your first organization.</a>
          </Link>
        )}
        {data.memberOrgs.map((org) => (
          <OrganizationCard
            key={org._id}
            name={org.name}
            tagline={org.tagline}
            image={org.imageURL}
          />
        ))}
      </div>
    </div>
  )
}
