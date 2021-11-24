import React, { useState } from 'react'
import Image from 'next/image'
import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import OrganizationCard from '@/components/Organizations/OrganizationCard'
import Loader from '@/components/Skeleton'
import styles from '@/styles/organizations.module.css'
import cardstyles from '@/styles/card.module.css'
import formstyles from '@/styles/form.module.css'

// Component: ListOrganizations()
// Params: None
// Purpose: To list all OrganizationCard({key, organizationId, organizationName, organizationDescription, organizer})
// components via mapping from useSWR hook at orgfetch api

export default function ListOrganizations() {
  const { data, error } = useSWR('/api/organizations/orgfetch', fetcher, {
    refreshInterval: 1000,
  })
  const [searchValue, setSearchValue] = useState('')
  if (error) {
    return (
      <div className={styles.serverdown}>
        <p>
          Oops. Looks like the organizations are not being fetched right now. If
          this persists, please let us know.
        </p>
        <Image
          src={'/assets/server.svg'}
          height={500}
          width={500}
          alt="Server Down Image"
        />
      </div>
    )
  }
  if (!data) {
    return <Loader />
  }
  const filteredOrgs = Object(data.organizations).filter((organization) =>
    organization.organizationName
      .toLowerCase()
      .includes(searchValue.toLowerCase())
  )
  return (
    <div>
      {data.organizations.length === 0 ? (
        <div className={styles.noreviews}>
          <p>Create the first organization!</p>

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
            aria-label="Enabled Searchbar"
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search by name."
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
      <div className={cardstyles.grid}>
        {!filteredOrgs.length && data.organizations.length !== 0 && (
          <>
            <p>
              No organizations found!
              <br />
              <cite>— Robert</cite>
            </p>
          </>
        )}
        {filteredOrgs.map((organization) => (
          <OrganizationCard
            key={organization._id}
            organizationId={organization._id}
            organizationName={organization.organizationName}
            organizationTagline={organization.organizationTagline}
          />
        ))}
      </div>
    </div>
  )
}
