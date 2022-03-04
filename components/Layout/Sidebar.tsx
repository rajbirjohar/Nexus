import useSWRImmutable from 'swr/immutable'
import Fetcher from '@/lib/fetcher'
import styles from '@/styles/layout.module.css'
import NotFound from '../notFound'
import Link from 'next/link'

export default function Sidebar() {
  const { data, error } = useSWRImmutable('/api/sidebar', Fetcher, {
    // We only want to fetch every 5 minutes
    refreshInterval: 1000 * 60 * 5,
  })
  if (error) {
    return <NotFound placeholder="Discover" />
  }
  if (!data) {
    return (
      <aside className={styles.sidebar}>
        <h3>Searching Deep Space</h3>
      </aside>
    )
  }

  return (
    <aside className={styles.sidebar}>
      <h3>Discover</h3>
      {data.discover.map((discover) => (
        <li className={styles.side} key={discover._id}>
          <Link
            href={`/organizations/${discover.orgName}/${discover._id}`}
            passHref
          >
            <h4 className={styles.sidetitle}>{discover.name}</h4>
          </Link>
          <p className={`${styles.sidedetails} ${'clamp-2'}`}>
            {discover.details.replace(/(<([^>]+)>)/gi, ' ')}
          </p>
        </li>
      ))}
    </aside>
  )
}
