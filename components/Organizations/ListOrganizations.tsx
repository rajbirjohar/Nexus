import React, { useState } from 'react'
import OrganizationCard from '@/components/Organizations/OrganizationCard'
import Loader from '@/components/Layout/Skeleton'
import ErrorFetch from '../Layout/ErrorFetch'
import cardstyles from '@/styles/card.module.css'
import formstyles from '@/styles/form.module.css'
import { SearchIcon } from '../Icons'
import { useOrgPages } from '@/hooks/useOrgPages'

export default function ListOrganizations() {
  const [search, setSearch] = useState('')
  const { data, error, size, setSize, isLoadingMore, isReachingEnd } =
    useOrgPages({
      org: search,
    })

  const organizations = data
    ? data.reduce((acc, val) => [...acc, ...val.organizations], [])
    : []

  if (error) {
    return <ErrorFetch placeholder="organizations" />
  }

  return (
    <section>
      <div className={formstyles.searchwrapper}>
        <input
          autoComplete="off"
          aria-label="Enabled Searchbar"
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search club names ex. "Nexus"'
          className={formstyles.search}
        />
        <SearchIcon />
      </div>
      <div className={cardstyles.grid}>
        {organizations.map((org) => (
          <OrganizationCard
            key={org._id}
            name={org.name}
            tagline={org.tagline}
            image={org.imageURL}
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
