import React, { useState } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import OrganizationCard from '@/components/Organizations/OrganizationCard'
import Loader from '@/components/Layout/Skeleton'
import NotFound from '../notFound'
import ErrorFetch from '../Layout/ErrorFetch'
import cardstyles from '@/styles/card.module.css'
import formstyles from '@/styles/form.module.css'
import { SearchIcon } from '../Icons'

export default function ListOrganizations() {
  const { data, error } = useSWR('/api/organizations', fetcher, {
    refreshInterval: 1000,
  })
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')
  if (error) {
    return <ErrorFetch placeholder="organizations" />
  }
  if (!data) {
    return (
      <>
        <div className={formstyles.searchwrapper}>
          <input
            autoComplete="off"
            aria-label="Disabled Searchbar"
            type="text"
            disabled
            placeholder='Search clubs ex. "Nexus"'
            className={formstyles.search}
          />
          <SearchIcon />
        </div>
        <Loader />
      </>
    )
  }
  const filteredOrgs = Object(data.organizations).filter((organization) =>
    organization.name
      .toLowerCase()
      .includes(searchValue.toLowerCase())
  )

  const allOrgNames = data.organizations.map(
    (organization) => organization.name
  )
  // Fun little function that randomly selects
  // an organization from all available orgs
  // (kinda like Google's "Im feeling lucky" button)
  // Thanks Tricia <3 for the idea
  // This implementation ensures that there
  // will be no repeated names selected
  function imFeelingLucky(array) {
    let copyOfArray = array.slice(0)
    return function () {
      if (copyOfArray.length < 1) {
        copyOfArray = array.slice(0)
      }
      const index = Math.floor(Math.random() * copyOfArray.length)
      const orgName = copyOfArray[index]
      copyOfArray.splice(index, 1)
      router.push(`/organizations/${orgName}`)
    }
  }

  return (
    <div>
      {data.organizations.length === 0 ? (
        <p>Create the first organization!</p>
      ) : (
        <>
          <span className={formstyles.actions}>
            <button
              className={formstyles.lucky}
              onClick={imFeelingLucky(allOrgNames)}
            >
              I&#39;m feeling lucky
            </button>
          </span>
          <div className={formstyles.searchwrapper}>
            <input
              autoComplete="off"
              aria-label="Enabled Searchbar"
              type="text"
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder='Search clubs ex. "Nexus"'
              className={formstyles.search}
            />
            <SearchIcon />
          </div>
        </>
      )}
      {!filteredOrgs.length && data.organizations.length !== 0 && (
        <NotFound placeholder="organization" />
      )}
      <div className={cardstyles.grid}>
        {filteredOrgs.map((organization) => (
          <OrganizationCard
            key={organization._id}
            name={organization.name}
            tagline={organization.tagline}
            image={organization.imageURL}
          />
        ))}
      </div>
    </div>
  )
}
