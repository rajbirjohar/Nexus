import React, { useState } from 'react'
import Image from 'next/image'
import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import ReviewPostCard from '@/components/Reviews/ReviewPostCard'
import NotFound from '../notFound'
import TimeAgo from 'react-timeago'
import ErrorFetch from '../ErrorFetch'
import Loader from '@/components/Skeleton'
import cardstyles from '@/styles/card.module.css'
import formstyles from '@/styles/form.module.css'

// Component: ListReviewPosts({course})
// Params: course
// Purpose: To list the review posts specific to
// the course on that route. This component live updates every second

export default function ListReviewPosts({ courseId }) {
  const { data, error } = useSWR(`/api/reviewposts/${courseId}`, fetcher, {
    refreshInterval: 1000,
  })
  const [searchValue, setSearchValue] = useState('')
  if (error) {
    return <ErrorFetch placeholder="reviews" />
  }
  if (!data) {
    return <Loader />
  }
  const filteroseReviews = Object(data.reviewPosts).filter(
    (reviewPost) =>
      reviewPost.reviewProfessor
        .toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      reviewPost.reviewPost.toLowerCase().includes(searchValue.toLowerCase()) ||
      reviewPost.taken.toLowerCase().includes(searchValue.toLowerCase())
  )
  return (
    <div>
      {data.reviewPosts.length === 0 ? (
        <div className={formstyles.notFound}>
          <p>Be the first one to write a review!</p>

          <Image
            src={'/assets/post2.svg'}
            height={300}
            width={300}
            alt="Post Image"
          />
        </div>
      ) : (
        <div className={formstyles.searchWrapper}>
          <input
            autoComplete="off"
            aria-label="Enabled Searchbar"
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Quarter, professor or review"
            className={formstyles.search}
          />
          <svg className={formstyles.searchIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </svg>
        </div>
      )}
      {!filteroseReviews.length && data.reviewPosts.length !== 0 && (
        <NotFound placeholder="review" />
      )}
      <div className={cardstyles.gridtall}>
        {filteroseReviews.map((post) => (
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
