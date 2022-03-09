import React, { useState } from 'react'
import useSWR from 'swr'
import Loader from '../Layout/Skeleton'
import Fetcher from '@/lib/fetcher'
import OpportunityCard from './OpportunityCard'
import NotFound from '../notFound'
import ErrorFetch from '../Layout/ErrorFetch'
import formstyles from '@/styles/form.module.css'
import cardstyles from '@/styles/card.module.css'
import { SearchIcon } from '../Icons'
import { LayoutGroup, motion } from 'framer-motion'

export default function ListAllOpportunities() {
    const { data, error } = useSWR('/api/opportunities', Fetcher, {
        refreshInterval: 1000,
    })
    const [searchValue, setSearchValue] = useState('')
    if (error) {
        return <ErrorFetch placeholder="opportunities" />
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
                placeholder="Search by professor, opportunity type or details"
                className={formstyles.search}
              />
    
              <SearchIcon />
            </div>
            <Loader />
          </>
        )
      }

      const filteredOpportunities = Object(data.opportunities).filter(
          (opportunity) =>
            opportunity.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            opportunity.author.toLowerCase().includes(searchValue.toLowerCase()) ||
            opportunity.details.toLowerCase().includes(searchValue.toLowerCase()) ||
            opportunity.tags.some((tag) =>
                tag.text.toLowerCase().includes(searchValue.toLowerCase())
            )
      )
      return (
        <div>
            {data.opportunities.length === 0 ? (
            <div className={formstyles.notFound}>
                <p>No opportunities today!</p>
            </div>
            ) : (
            <div className={formstyles.searchwrapper}>
                <input
                autoComplete="off"
                aria-label="Enabled Searchbar"
                type="text"
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search by professor, opportunity type, or details"
                className={formstyles.search}
                />
                <SearchIcon />
            </div>
            )}
    
            {!filteredOpportunities.length && data.opportunities.length !== 0 && (
            <NotFound placeholder="opportunity" />
            )}
            <LayoutGroup>
                <motion.div layout layoutId="listcards" className={cardstyles.gridtall}>
                {filteredOpportunities.map((newOpportunity) => (
                    <OpportunityCard
                    key={newOpportunity._id}
                    opId={newOpportunity._id}
                    authorId={newOpportunity.authorId}
                    author={newOpportunity.author}
                    email={newOpportunity.email}
                    name={newOpportunity.name}
                    details={newOpportunity.details}
                    endDate={newOpportunity.endDate}
                    tags={newOpportunity.tags}
                    />
                ))}
                </motion.div>
            </LayoutGroup>
           
            
           
      </div>
    )
}