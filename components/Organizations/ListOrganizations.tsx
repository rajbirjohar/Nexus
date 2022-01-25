import React, { useState } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import OrganizationCard from '@/components/Organizations/OrganizationCard'
import Loader from '@/components/Layout/Skeleton'
import NotFound from '../notFound'
import ErrorFetch from '../ErrorFetch'
import styles from '@/styles/organizations.module.css'
import cardstyles from '@/styles/card.module.css'
import formstyles from '@/styles/form.module.css'
import { motion, LayoutGroup } from 'framer-motion'

const list = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

// Component: ListOrganizations()
// Params: None
// Purpose: To list all OrganizationCard({key, organizationId, organizationName, organizationDescription, organizer})
// components via mapping from useSWR hook at orgfetch api

export default function ListOrganizations() {
  const { data, error } = useSWR('/api/organizations/orgfetch', fetcher, {
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
        <div className={formstyles.searchWrapper}>
          <input
            autoComplete="off"
            aria-label="Disabled Searchbar"
            type="text"
            disabled
            placeholder='Search clubs ex. "Nexus"'
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
        <Loader />
      </>
    )
  }
  const filteredOrgs = Object(data.organizations).filter((organization) =>
    organization.organizationName
      .toLowerCase()
      .includes(searchValue.toLowerCase())
  )

  const allOrgNames = data.organizations.map(
    (organization) => organization.organizationName
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
          <div className={formstyles.searchWrapper}>
            <input
              autoComplete="off"
              aria-label="Enabled Searchbar"
              type="text"
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder='Search clubs ex. "Nexus"'
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
        </>
      )}
      {!filteredOrgs.length && data.organizations.length !== 0 && (
        <NotFound placeholder="organization" />
      )}
      <motion.div
        variants={list}
        initial="hidden"
        animate="show"
        className={cardstyles.grid}
      >
        {filteredOrgs.map((organization) => (
          <OrganizationCard
            key={organization._id}
            organizationId={organization._id}
            organizationName={organization.organizationName}
            organizationTagline={organization.organizationTagline}
            organizationImage={organization.organizationImageURL}
          />
        ))}
      </motion.div>
    </div>
  )
}
