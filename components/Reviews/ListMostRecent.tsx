import useSWR from 'swr'
import Link from 'next/link'
import fetcher from '@/lib/fetcher'
import RecentReviewPostCard from '@/components/Reviews/RecentReviewPostCard'
import TimeAgo from 'react-timeago'
import ErrorFetch from '../Layout/ErrorFetch'
import Loader from '@/components/Layout/Skeleton'
import cardstyles from '@/styles/card.module.css'

export default function ListMostRecent() {
  const { data, error } = useSWR(`/api/reviewposts`, fetcher, {
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
      {data.posts.length === 0 && (
        <Link href="/courses">Write your first review!</Link>
      )}
      <div className={cardstyles.gridtall}>
        {data.posts.map((post) => (
          <RecentReviewPostCard
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
