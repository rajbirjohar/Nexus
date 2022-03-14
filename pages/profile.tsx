import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import Page from '@/components/Layout/Page'
import ListReviews from '@/components/Profile/ListReviews'
import ListUserOrganizations from '@/components/Profile/ListUserOrganizations'
import ListUserOpportunities from '@/components/Opportunities/ListUserOpportunities'
import SetRoleForm from '@/components/Profile/SetRoleForm'
import styles from '@/styles/profile.module.css'
import Tabs from '@/components/Layout/Tabs'

export default function Profile() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/')
      toast.error('Please sign in.')
      // User is not authenticated
    },
  })

  // const changeData = async () => {
  //   const response = await fetch('/api/data', {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //   const data = await response.json()
  //   if (response.status === 200) {
  //     toast.success('Data has been changed.')
  //   } else {
  //     toast.error(
  //       'Uh oh. Something happened. Please contact us if this persists.'
  //     )
  //   }
  //   return data
  // }

  return (
    <Page title="Profile" tip={null}>
      {/* No Roles */}
      {session && session.user.roles && !session.user.roles.length && (
        <SetRoleForm userId={session.user.id} />
      )}

      {status === 'loading' && <h1>Loading</h1>}
      {session && (
        <>
          <h1>Hello {session.user.firstname}</h1>
          <h3>Have an awesome day.</h3>
          {/* <button onClick={() => changeData()}>Change Data</button> */}

          {session.user.roles.includes('professor') && (
            <Tabs
              tabs={[
                {
                  label: 'Organizations',
                  id: 'organizations',
                  component: <ListUserOrganizations />,
                },
                {
                  label: 'Opportunities',
                  id: 'opportunities',
                  component: <ListUserOpportunities />,
                }
              ]}
              layoutId="profile"
            />
          )}

          {session.user.roles.includes('student') && (
            <Tabs
              tabs={[
                {
                  label: 'Organizations',
                  id: 'organizations',
                  component: <ListUserOrganizations />,
                },
                {
                  label: 'Reviews',
                  id: 'reviews',
                  component: <ListReviews />,
                }
              ]}
              layoutId="profile"
            />
          )}
          
          {/* <Tabs
            tabs={[
              {
                label: 'Organizations',
                id: 'organizations',
                component: <ListUserOrganizations />,
              },
              {
                label: 'Reviews',
                id: 'reviews',
                component: <ListReviews />,
              },
              {
                label: 'Opportunities',
                id: 'opportunities',
                component: <ListUserOpportunities />,
              }
            ]}
            layoutId="profile"
          /> */}
        </>
      )}
    </Page>
  )
}
