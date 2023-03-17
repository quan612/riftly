import React, { useEffect } from 'react'
import Head from 'next/head'

import dynamic from 'next/dynamic'

import UserQuestProvider from '@context/UserQuestContext'

const RiftlyIndividualQuestBoardComponent = dynamic(() =>
  import('@components/end-user/dashboard/RiftlyIndividualQuestBoard'),
)

const transition = { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }
const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1, transition },
  exit: { opacity: 0, transition: { duration: 0.2, ...transition } },
}

function Home({ session }) {
  return (
    <>
      <Head>
        <title>Riftly Challenger</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Riftly Challenger" />
        <meta property="og:description" content="Complete quests, earn Point, unlock prizes" />
        {/* <meta
          property="og:image"
          content="https://anomuragame.com/DeepSeaChallengerThumbnail_2.png"
        /> */}
        <meta property="og:site_name" content="Riftly"></meta>
        <meta property="keywords" content="Riftly" />

        {/* <meta name="twitter:card" content="summary_large_image" /> */}
        {/* <meta
          property="twitter:image"
          content="https://anomuragame.com/DeepSeaChallengerThumbnail_2.png"
        /> */}
        <link rel="icon" href="/faviconShell.png" />
      </Head>
      <UserQuestProvider>
        <ChakraBox initial="hidden" animate="enter" exit="exit" variants={variants}>
          <Flex flexDirection="column" gap="16px">
            <RiftlyIndividualQuestBoardComponent session={session} />
          </Flex>
        </ChakraBox>
      </UserQuestProvider>
    </>
  )
}
Home.requireUser = true
export default Home

import { getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { ChakraBox } from '@theme/additions/framer/FramerChakraComponent'
import { Flex } from '@chakra-ui/react'


export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)


  if (!session || session?.user?.isAdmin) {
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
