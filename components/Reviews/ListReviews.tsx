import React, { useState } from 'react'
import ReviewCard from '@/components/Reviews/ReviewCard'
import NotFound from '../notFound'
import cardstyles from '@/styles/card.module.css'
import formstyles from '@/styles/form.module.css'
import { SearchIcon } from '../Icons'
import { useReviewPages } from '../../hooks/useReviewPages'

export default function ListReviews({ courseId }) {
  const [searchValue, setSearchValue] = useState('')
  const { data, size, setSize, isLoadingMore, isReachingEnd } = useReviewPages({
    courseId: courseId,
  })

  const reviews = data
    ? data.reduce((acc, val) => [...acc, ...val.reviews], [])
    : []

  const filteredReviews = Object(reviews).filter(
    (review: Review) =>
      review.professor.toLowerCase().includes(searchValue.toLowerCase()) ||
      review.review.toLowerCase().includes(searchValue.toLowerCase()) ||
      review.taken.toLowerCase().includes(searchValue.toLowerCase())
  )

  return (
    <section>
      {!reviews.length ? (
        <div className={formstyles.notFound}>
          <p>Write the first review!</p>
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
      {!filteredReviews.length && reviews.length !== 0 && (
        <NotFound placeholder="review" />
      )}
      <div className={cardstyles.gridtall}>
        {filteredReviews.map((review) => (
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
        {isReachingEnd ? (
          <p className={formstyles.end}>You&#39;ve reached the end 🎉</p>
        ) : (
          <span className={formstyles.load}>
            <button disabled={isLoadingMore} onClick={() => setSize(size + 1)}>
              Load more
            </button>
          </span>
        )}
      </div>
    </section>
  )
}
