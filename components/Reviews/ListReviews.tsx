import React, { useState } from 'react'
import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import ReviewCard from '@/components/Reviews/ReviewCard'
import NotFound from '../notFound'
import TimeAgo from 'react-timeago'
import ErrorFetch from '../Layout/ErrorFetch'
import Loader from '@/components/Layout/Skeleton'
import cardstyles from '@/styles/card.module.css'
import formstyles from '@/styles/form.module.css'
import { SearchIcon } from '../Icons'

export default function ListReviews({ courseId }) {
  const { data, error } = useSWR(`/api/reviews/${courseId}`, fetcher, {
    refreshInterval: 1000,
  })
  const [searchValue, setSearchValue] = useState('')
  if (error) {
    return <ErrorFetch placeholder="reviews" />
  }
  if (!data) {
    return <Loader />
  }
  const filteredReviews = Object(data.reviews).filter(
    (review) =>
      review.professor.toLowerCase().includes(searchValue.toLowerCase()) ||
      review.review.toLowerCase().includes(searchValue.toLowerCase()) ||
      review.taken.toLowerCase().includes(searchValue.toLowerCase())
  )
  return (
    <div>
      {data.reviews.length === 0 ? (
        <div className={formstyles.notFound}>
          <p>Be the first one to write a review!</p>
        </div>
      ) : (
        <div className={formstyles.searchwrapper}>
          <input
            autoComplete="off"
            aria-label="Enabled Searchbar"
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Quarter, professor or review"
            className={formstyles.search}
          />
          <SearchIcon />
        </div>
      )}

      {!filteredReviews.length && data.reviews.length !== 0 && (
        <NotFound placeholder="review" />
      )}

      <div className={cardstyles.gridtall}>
        {filteredReviews.map((post) => (
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
            timestamp={<TimeAgo date={post.createdAt} />}
          />
        ))}
      </div>
    </div>
  )
}
