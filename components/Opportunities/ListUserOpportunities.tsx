import useSWR from 'swr'
import Link from 'next/link'
import fetcher from '@/lib/fetcher'
import OpportunityCard from './OpportunityCard'
import ErrorFetch from '../Layout/ErrorFetch'
import Loader from '@/components/Layout/Skeleton'
import cardstyles from '@/styles/card.module.css'
import { LayoutGroup, motion } from 'framer-motion'
import formstyles from '@/styles/form.module.css'


export default function ListUserOpportunities() {
  const { data, error } = useSWR('/api/opportunities/useropportunityfetch', fetcher, {
    refreshInterval: 1000,
  })
  if (error) {
    return <ErrorFetch placeholder="opportunities" />
  }
  if (!data) {
    return <Loader />
  }
  return (
    <div>
      {data.opportunities.length === 0 && (
            <div className={formstyles.notFound}>
                <p>No opportunities today!</p>
            </div>
      )}
      <LayoutGroup>
        <motion.div layout="position" className={cardstyles.gridtall}>
          {data.opportunities.map((newOpportunity) => (
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
