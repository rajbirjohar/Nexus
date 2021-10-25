import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import ReviewPostCard from '@/components/Reviews/ReviewPostCard'
import TimeAgo from 'react-timeago'
import styles from '@/styles/posts.module.css'

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

export default function ListReviewPosts() {
  const { data, error } = useSWR('/api/reviewposts', fetcher, {
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
      {data.reviewPosts.map((entry) => (
        <ReviewPostCard
          key={entry._id}
          reviewPostId={entry._id}
          reviewee={entry.reviewee}
          reviewPost={entry.reviewPost}
          reviewProfessor={entry.reviewProfessor}
          course={entry.course}
          difficulty={entry.difficulty}
          anonymous={entry.anonymous}
          timestamp={<TimeAgo date={entry.createdAt} />}
        />
      ))}
    </div>
  )
}
