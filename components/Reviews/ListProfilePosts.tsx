import useSWR from 'swr'
import Link from 'next/link'
import fetcher from '@/lib/fetcher'
import { useSession } from 'next-auth/react'
import ReviewPostCard from '@/components/Reviews/ReviewPostCard'
import TimeAgo from 'react-timeago'
import styles from '@/styles/reviewposts.module.css'

const Skeleton = () => {
  return (
    <div className={styles.card}>
      <p className={styles.dummydescription}></p>
      <p className={styles.dummydescription}></p>
      <p className={styles.dummydescription}></p>
      <span className={styles.dummyauthor}>
        <p className={styles.dummytitle}></p>
      </span>
    </div>
  )
}

export default function ListReviewPosts() {
  const { data, error } = useSWR('/api/reviewposts/userfetch', fetcher, {
    refreshInterval: 1000,
  })
  const { data: session } = useSession()
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
      {data.reviewPosts.length === '' && (
        <Link href="/reviews">Write your first review!</Link>
      )}
      {data.reviewPosts.map((post) => (
        <ReviewPostCard
          key={post._id}
          reviewPostId={post._id}
          reviewee={post.reviewee}
          reviewPost={post.reviewPost}
          reviewProfessor={post.reviewProfessor}
          course={post.course}
          taken={post.taken}
          difficulty={post.difficulty}
          anonymous={post.anonymous}
          timestamp={<TimeAgo date={post.createdAt} />}
        />
      ))}
    </div>
  )
}