import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import OrganizationCard from '@/components/Organizations/OrganizationCard'
import Loader from '@/components/Skeleton'

export default function ListOrganizations() {
  const { data, error } = useSWR('/api/organizations/orgfetch', fetcher, {
    refreshInterval: 1000,
  })
  if (error) {
    return <p>Database is not working.</p>
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
          organizationDescription={organization.organizationDescription}
          organizer={organization.organizer}
        />
      ))}
    </div>
  )
}
