import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import Post from '@/components/Post'
import TimeAgo from 'react-timeago'
import styles from '@/styles/form.module.css'

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

export default function Entries() {
  const { data, error } = useSWR('/api/posts', fetcher, {
    refreshInterval: 1000,
  })
  if (error) {
    return (
      <p>
        Oops. Looks like my database is not being fetched right now. If this
        persists, please let me know.
      </p>
    )
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
      {data.entries.map((entry) => (
        <Post
          key={entry._id}
          entryId={entry._id}
          name={entry.name}
          entry={entry.entry}
          timestamp={<TimeAgo date={entry.createdAt} />}
        />
      ))}
    </div>
  )
}
