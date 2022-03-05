import React, { useState } from 'react'
import ReviewCard from '@/components/Reviews/ReviewCard'
import NotFound from '../notFound'
import cardstyles from '@/styles/card.module.css'
import formstyles from '@/styles/form.module.css'
import { SearchIcon } from '../Icons'
import { useReviewPages } from '../../hooks/useReviewPages'
import { DebounceInput } from 'react-debounce-input'
import Loader from '../Layout/Skeleton'

export default function ListReviews({ courseId }) {
  const [search, setSearch] = useState('')
  const { data, size, setSize, isLoadingMore, isReachingEnd } = useReviewPages({
    courseId: courseId,
    review: search,
  })

  const reviews = data
    ? data.reduce((acc, val) => [...acc, ...val.reviews], [])
    : []

  return (
    <section>
      <div className={formstyles.searchwrapper}>
        <DebounceInput
          autoComplete="off"
          aria-label="Enabled Searchbar"
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Quarter, professor or review"
          className={formstyles.search}
        />
        <SearchIcon />
      </div>
      <div className={cardstyles.gridtall}>
        {reviews.map((review) => (
          <ReviewCard
            key={review._id}
            reviewId={review._id}
            authorId={review.authorId}
            author={review.author}
            course={review.course}
            review={review.review}
            professor={review.professor}
            taken={review.taken}
            difficulty={review.difficulty}
            anonymous={review.anonymous}
            timestamp={review.createdAt}
          />
        ))}
      </div>
      {isLoadingMore ? (
        <Loader />
      ) : isReachingEnd ? (
        <p className={formstyles.end}>You&#39;ve reached the end 🎉</p>
      ) : (
        <span className={formstyles.load}>
          <button disabled={isLoadingMore} onClick={() => setSize(size + 1)}>
            Load more
          </button>
        </span>
      )}
    </section>
  )
}
