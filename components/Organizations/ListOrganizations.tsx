import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import OrganizationCard from '@/components/Organizations/OrganizationCard'
import TimeAgo from 'react-timeago'
import styles from '@/styles/reviewposts.module.css'

const Skeleton = () => {
  return (
    <div className={styles.skeleton}>
      <p className={styles.dummydescription}></p>
      <br />
      <span className={styles.dummyauthor}>
        <p className={styles.dummytitle}></p>
      </span>
    </div>
  )
}

export default function ListOrganizations() {
  const { data, error } = useSWR('/api/organizations/orgfetch', fetcher, {
    refreshInterval: 1000,
  })
  if (error) {
    return <p>Database is not working.</p>
  }
  if (!data) {
    return (
      <>
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </>
    )
  }
  return (
    <div>
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
