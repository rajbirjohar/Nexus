import useSWR from 'swr'
import Link from 'next/link'
import fetcher from '@/lib/fetcher'
import RecentReviewCard from '@/components/Reviews/RecentReviewCard'
import ErrorFetch from '../Layout/ErrorFetch'
import Loader from '@/components/Layout/Skeleton'
import cardstyles from '@/styles/card.module.css'

export default function ListRecentReviews() {
  const { data, error } = useSWR('/api/reviews', fetcher, {
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
        <h3>No recent reviews.</h3>
      )}
      <div className={cardstyles.gridtall}>
        {data.posts.map((post) => (
          <RecentReviewCard
            key={post._id}
            author={post.author}
            course={post.course}
            review={post.review}
            professor={post.professor}
            taken={post.taken}
            difficulty={post.difficulty}
            anonymous={post.anonymous}
            timestamp={post.createdAt}
          />
        ))}
      </div>
    </div>
  )
}
