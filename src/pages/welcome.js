import Head from 'next/head'
import React from 'react'
import dynamic from 'next/dynamic'

import { ButtonGroup, Box, Flex, Heading, Text, Button } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ShortContainer } from '@components/end-user/wrappers'
import { RiftlyLogoWhiteText } from '@components/shared/Logo'

function WelcomePage() {
  const router = useRouter()
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


      <ShortContainer>
        <Box
          w={{ base: '100px', md: '150px' }}
          display={'flex'}
          alignItems="center"
          justifyContent={'center'}
        >
          <Box display={'flex'} alignItems="center">
            <RiftlyLogoWhiteText />
          </Box>
        </Box>

        <Flex flexDirection={'column'} alignItems={'center'}>
          <Heading size="lg" color="#fff" mb="16px">
            Welcome to Riftly
          </Heading>
          <Text fontSize="lg" color={'brand.neutral1'} textAlign="center">
            Join Riftly or sign in to continue
          </Text>
        </Flex>
        <ButtonGroup
          w="100%"
          gap="16px"
          display={'flex'}
          flexDirection={{ base: 'column', md: 'row' }}
          justifyContent="center"
          alignItems="center"
        >
          <Button
            w={{ base: '100%', md: '192pz' }}
            onClick={() => router.push('/user/sign-up')}
            size="lg"
            variant="blue"
          >
            Get Started
          </Button>

          <Button
            w={{ base: '100%', md: '192pz' }}
            onClick={() => router.push('/user/sign-in')}
            size="lg"
            variant="signIn"
          >
            Sign In
          </Button>
        </ButtonGroup>
      </ShortContainer>
    </>
  )
}

export default WelcomePage