import Head from 'next/head'
import React from 'react'
import dynamic from 'next/dynamic'
const PersonalInfoPageComponent = dynamic(() =>
  import('@components/end-user/personal-info/PersonalInfo'),
)

const transition = { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }
const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1, transition },
  exit: { opacity: 0, transition: { duration: 1, ...transition } },
}

function PersonalInfoPage({ session }) {
  return (
    <>
      <Head>
        <title>Riftly Challenger</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Riftly Challenger" />
        <meta property="og:description" content="Complete quests, earn Point, unlock prizes" />

        <meta property="og:site_name" content="Riftly"></meta>
        <meta property="keywords" content="Riftly" />


        <link rel="icon" href="/Sparkle.svg" />
      </Head>

      <ChakraBox initial="hidden" animate="enter" exit="exit" variants={variants}>
        <Flex flexDirection="column" gap="16px">
          <PersonalInfoPageComponent session={session} />
        </Flex>
      </ChakraBox>
    </>
  )
}

export default PersonalInfoPage

import { getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { Flex } from '@chakra-ui/react'
import { ChakraBox } from '@theme/additions/framer/FramerChakraComponent'
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
