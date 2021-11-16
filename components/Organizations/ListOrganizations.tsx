import Image from 'next/image'
import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import OrganizationCard from '@/components/Organizations/OrganizationCard'
import Loader from '@/components/Skeleton'
import styles from '@/styles/organizations.module.css'

// Component: ListOrganizations()
// Params: None
// Purpose: To list all OrganizationCard({key, organizationId, organizationName, organizationDescription, organizer})
// components via mapping from useSWR hook at orgfetch api

export default function ListOrganizations() {
  const { data, error } = useSWR('/api/organizations/orgfetch', fetcher, {
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
    <div>
      {data.organizations.length === 0 && <p>Create the first organization!</p>}
      {data.organizations.map((organization) => (
        <OrganizationCard
          key={organization._id}
          organizationId={organization._id}
          organizationName={organization.organizationName}
          organizationTagline={organization.organizationTagline}
          organizer={organization.organizer}
        />
      ))}
    </div>
  )
}
