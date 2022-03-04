import useSWR from 'swr'
import Link from 'next/link'
import fetcher from '@/lib/fetcher'
import ReviewCard from '@/components/Reviews/ReviewCard'
import ErrorFetch from '../Layout/ErrorFetch'
import Loader from '@/components/Layout/Skeleton'
import cardstyles from '@/styles/card.module.css'

export default function ListReviews() {
  const { data, error } = useSWR('/api/users/reviews', fetcher, {
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
      {data.reviews.length === 0 && (
        <Link href="/courses">Write your first review!</Link>
      )}
      <div className={cardstyles.gridtall}>
        {data.reviews.map((post) => (
          <ReviewCard
            key={post._id}
            reviewId={post._id}
            authorId={post.authorId}
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
