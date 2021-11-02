import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import ReviewPostCard from '@/components/Reviews/ReviewPostCard'
import TimeAgo from 'react-timeago'
import Loader from '@/components/Skeleton'

// Component: ListReviewPosts({course})
// Params: course
// Purpose: To list the review posts specific to 
// the course on that route. This component live updates every second

export default function ListReviewPosts({ course }) {
  const { data, error } = useSWR(`/api/reviewposts/${course}`, fetcher, {
    refreshInterval: 1000,
  })
  if (error) {
    return (
      <p>
        Oops. Looks like the reviews are not being fetched right now. If this
        persists, please let us know.
      </p>
    )
  }
  if (!data) {
    return <Loader />
  }
  return (
    <div>
      {data.reviewPosts.length === 0  && (
        <p>Be the first one to write a review!</p>
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
