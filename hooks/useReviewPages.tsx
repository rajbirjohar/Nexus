import fetcher from '@/lib/fetcher'
import useSWRInfinite from 'swr/infinite'

export function useReviewPages({ courseId="", limit = 10 } = {}) {
  const { data, error, size, ...props } = useSWRInfinite(
    (index, previousPageData) => {
      // reached the end
      if (previousPageData && previousPageData.reviews.length === 0) return null

      const searchParams = new URLSearchParams()
      searchParams.set('limit', limit.toString())

      if (index !== 0) {
        // using oldest posts createdAt date as cursor
        // We want to fetch posts which has a date that is
        // before (hence the .getTime()) the last post's createdAt
        const before = new Date(
          new Date(
            previousPageData.reviews[
              previousPageData.reviews.length - 1
            ].createdAt
          ).getTime()
        )

        searchParams.set('before', before.toJSON())
      }

      return `/api/reviews/${courseId}?${searchParams.toString()}`
    },
    fetcher,
    {
      refreshInterval: 1000,
      revalidateAll: false,
    }
  )
  const isLoadingInitialData = !data && !error
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.reviews?.length < limit)

  return {
    data,
    error,
    size,
    isLoadingMore,
    isReachingEnd,
    ...props,
  }
}
