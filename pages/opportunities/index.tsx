import { useSession } from 'next-auth/react'
import Page from '@/components/Layout/Page'
import styles from '@/styles/events.module.css'
import { LottieWrapper } from '@/components/LottieWrapper'
import { GreenTip } from '@/components/Layout/Tips'
import animationData from '@/lotties/teamblue.json'
import OpportunityForm from '@/components/Events/OpportunityForm'
import Accordion from '@/components/Layout/Accordion'

export default function OpportunitiesPage() {
  const { data: session } = useSession()

  return (
    <Page
      title="Opportunities"
      tip={
        <GreenTip header="Your Resume">
          Opportunities posted by professors are a great way to get things on
          your resume! Don&#39;t be afraid to apply, you might surprise
          yourself.
        </GreenTip>
      }
    >
      <div className={styles.hero}>
        <div className={styles.content}>
          <div className={styles.text}>
            <h1>Opportunities</h1>
            <p>
              This is where you&#39;ll be able to see all opportunities posted
              and offered by professors. Opportunities are sorted by the cut off
              date and time.
            </p>
          </div>
          <div className={styles.animationWrapper}>
            <LottieWrapper animationData={animationData} />
          </div>
        </div>
      </div>

      {session &&
        session.user.role &&
        session.user.orgRole &&
        session.user.role.includes('professor') &&
        session.user.orgRole.includes('none') && (
          <>
            <Accordion heading="Post Opportunity">
              <OpportunityForm
                authorId={session.user.id}
                author={session.user.name}
                email={session.user.email}
              />
            </Accordion>
          </>
        )}
    </Page>
  )
}
