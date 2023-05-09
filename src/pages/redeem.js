import Head from 'next/head'
import React from 'react'
import dynamic from 'next/dynamic'
const RedeemRewardsPageComponent = dynamic(() =>
  import('@components/end-user/redeem/RedeemRewardsPage'),
)
const transition = { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }
const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1, transition },
  exit: { opacity: 0, transition: { duration: 1, ...transition } },
}

function RedeemPage({ session }) {
  return (
    <>

      <ChakraBox initial="hidden" animate="enter" exit="exit" variants={variants}>
        <Flex flexDirection="column" gap="16px">
          <RedeemRewardsPageComponent session={session} />
        </Flex>
      </ChakraBox>
    </>
  )
}

RedeemPage.requireUser = true
export default RedeemPage

import { getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { ChakraBox } from '@theme/additions/framer/FramerChakraComponent'
import { Flex } from '@chakra-ui/react'

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/welcome',
        permanent: false,
      },
    }
  }
  return {
    props: {
      session,
    },
  }
}
