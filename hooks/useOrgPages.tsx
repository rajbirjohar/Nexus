import fetcher from '@/lib/fetcher'
import useSWRInfinite from 'swr/infinite'

export function useOrgPages({ org = '', limit = 10 } = {}) {
  const { data, error, size, ...props } = useSWRInfinite(
    (index, previousPageData) => {
      if (previousPageData && previousPageData.organizations.length === 0)
        return null

      const searchParams = new URLSearchParams()
      searchParams.set('limit', limit.toString())
      searchParams.set('org', org.toString())

      if (index !== 0) {
        const before =
          previousPageData.organizations[
            previousPageData.organizations.length - 1
          ].name.toString()

        searchParams.set('before', before.toString())
      }

      return `/api/organizations?${searchParams.toString()}`
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
    isEmpty || (data && data[data.length - 1]?.organizations?.length < limit)

  return {
    data,
    error,
    size,
    isLoadingMore,
    isReachingEnd,
    ...props,
  }
}
