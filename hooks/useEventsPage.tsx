import fetcher from '@/lib/fetcher'
import useSWRInfinite from 'swr/infinite'

export function useEventsPages({ route = '', event = '', limit = 10 } = {}) {
  const { data, error, size, ...props } = useSWRInfinite(
    (index, previousPageData) => {
      if (previousPageData && previousPageData.events.length === 0) return null

      const searchParams = new URLSearchParams()
      searchParams.set('limit', limit.toString())
      searchParams.set('event', event.toString())

      if (index !== 0) {
        // using oldest posts startDate date as cursor
        // We want to fetch posts which has a date that is
        // after (hence the .getTime()) the last post's startDate
        const before = new Date(
          new Date(
            previousPageData.events[previousPageData.events.length - 1].startDate
          ).getTime()
        )

        searchParams.set('before', before.toJSON())
      }

      return `${route}?${searchParams.toString()}`
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
    isEmpty || (data && data[data.length - 1]?.events?.length < limit)

  return {
    data,
    error,
    size,
    isLoadingMore,
    isReachingEnd,
    ...props,
  }
}
