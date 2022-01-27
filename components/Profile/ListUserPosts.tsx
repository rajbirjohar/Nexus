import useSWR from 'swr'
import Link from 'next/link'
import fetcher from '@/lib/fetcher'
import ReviewPostCard from '@/components/Reviews/ReviewPostCard'
import TimeAgo from 'react-timeago'
import ErrorFetch from '../Layout/ErrorFetch'
import Loader from '@/components/Layout/Skeleton'
import cardstyles from '@/styles/card.module.css'

export default function ListUserPosts() {
  const { data, error } = useSWR('/api/users/userreviewfetch', fetcher, {
    refreshInterval: 1000,
  })
  if (error) {
    return <ErrorFetch placeholder="reviews" />
  }
  if (!data) {
    return <Loader />
  }
  return (
    <div>
      {data.reviewPosts.length === 0 && (
        <Link href="/courses">Write your first review!</Link>
      )}
      <div className={cardstyles.gridtall}>
        {data.reviewPosts.map((post) => (
          <ReviewPostCard
            key={post._id}
            reviewPostId={post._id}
            creator={post.creator}
            creatorEmail={post.creatorEmail}
            creatorId={post.creatorId}
            courseId={post.courseId}
            course={post.course}
            reviewPost={post.reviewPost}
            reviewProfessor={post.reviewProfessor}
            taken={post.taken}
            difficulty={post.difficulty}
            anonymous={post.anonymous}
            timestamp={<TimeAgo date={post.createdAt} />}
          />
        ))}
      </div>
    </div>
  )
}
