import Head from 'next/head'
import React from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { RiftlyLogoWhiteText } from '@components/shared/Logo'
import { SignInSignUpWrapper } from '@components/end-user/wrappers/SignInSignUpWrapper'
import { TallContainer } from '@components/end-user/wrappers'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

function SignUp() {
  const { data: session, status } = useSession()
  const router = useRouter()
  React.useEffect(() => {
    if (session && !session?.isAdmin) {
      router.push('/')
    }
  }, [session])
  return (
    <>
      <Head>
        <title>Riftly Challenger</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="DeepSea Challenger" />
        <meta property="og:description" content="Complete quests, earn $SHELL, unlock prizes" />
        <meta
          property="og:image"
          content="https://anomuragame.com/DeepSeaChallengerThumbnail_2.png"
        />
        <meta property="og:site_name" content="Anomura: The Cove's DeepSea Challenger"></meta>
        <meta property="keywords" content="Anomura, NFT, Game, DeepSea Challenger" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:image"
          content="https://anomuragame.com/DeepSeaChallengerThumbnail_2.png"
        />
        <link rel="icon" href="/Sparkle.svg" />
      </Head>

      <Box
        position="relative"
        top="0"
        flex="1"
        w={{ base: '28%', md: '179px' }}
        // h={{ base: "15%", md: "198px" }}
        display={'flex'}
        justifyContent={'center'}
      >
        <Box
          display={'flex'}
          justifyContent={'center'}
          alignItems="center"
          w={{ base: '40%', lg: '58%' }}
        >
          <RiftlyLogoWhiteText />
        </Box>
      </Box>

      <TallContainer>
        <SignInSignUpWrapper isSignIn={false} />
      </TallContainer>
      <Flex flex="1"></Flex>
    </>
  )
}

export default SignUp
