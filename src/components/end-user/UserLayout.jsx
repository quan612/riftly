import React from 'react'
import { Box, Flex, Container, Heading, ButtonGroup, Button, Text } from '@chakra-ui/react'
import { FloatingFooter } from './FloatingFooter'
import { useRouter } from 'next/router'
import { useWindowSize } from 'react-use'
import { ShortContainer } from '@components/end-user/wrappers'
import { RiftlyLogoWhite, RiftlyLogoWhiteText } from '@components/shared/Logo'
import useDeviceDetect from '@hooks/useDeviceDetect'

function use100vh() {
  const ref = React.useRef()
  const { height } = useWindowSize()

  React.useEffect(() => {
    if (!ref.current) {
      return
    }
    ref.current.style.height = height + 'px'
  }, [height])

  return ref
}

export default function UserLayout({ session, children }) {
  let router = useRouter()

  if (session && session?.user?.isAdmin) {
    return (
      <LayoutWrapper>
        <RiftlyConnectBoard />
      </LayoutWrapper>
    )
  }

  if (session) {
    return (
      <LayoutWrapper>
        <Box position="absolute" w="100%" h="160px" top={0}>
          <Flex h="90%" alignItems="center" justifyContent={'center'}>
            <Box w={{ base: '75px', md: '90px', xl: '105px' }}>
              <RiftlyLogoWhite />
            </Box>
          </Flex>
        </Box>
        <Box
          minW={'100%'}
          w="100%"
          bg={'brand.neutral5'}
          color="#262626"
          borderTopRadius={'16px'}
          position="absolute"
          top={'160px'}
          minH="100vh"
          maxH="auto"
          pb="16px"
          zIndex="2"
        >
          <Container
            position={'relative'}
            maxW="container.sm"
            minW={{ sm: '100%', md: 'container.sm' }}
            padding={{ sm: '0px 16px', md: '0' }}
          >
            <Box
              display={'flex'}
              flexDirection={'column'}
              w="100%"
              position="relative"
              top="-16px"
              gap="16px"
            >
              {children}
            </Box>
          </Container>
          <Box h="75px" minH="75px" bg="brand.neutral5" key="challenges-layout-hack" />
        </Box>
        <FloatingFooter />
      </LayoutWrapper>
    )
  } else {
    // if (router.pathname === '/') {
    //   return (
    //     <LayoutWrapper>
    //       <RiftlyConnectBoard />
    //     </LayoutWrapper>
    //   )
    // } else {
    //   return <LayoutWrapper>{children}</LayoutWrapper>
    // }
    console.log(33)
    return <LayoutWrapper>{children}</LayoutWrapper>
  }
}

export const LayoutWrapper = ({ children }) => {
  const { isMobile } = useDeviceDetect()

  const ref = use100vh()
  return (
    <Box
      w="100%"
      ref={ref}
      display={'flex'}
      position={'relative'}
      flexDirection="column"
      className="layout-wrapper"
    >
      <Box
        position="absolute"
        w="100%"
        h="100%"
        __css={{
          background:
            'linear-gradient(rgba(29, 99, 255, 0.5),  rgba(29, 99, 255, 0.5)), url(/img/user/banner.png)',
        }}
        backgroundPosition="center"
        backgroundSize={'cover'}
        backgroundRepeat="no-repeat"
        display={'flex'}
        flexDirection="column"
        alignItems="center"
        justifyContent={'center'}
      >
        {children}
      </Box>
    </Box>
  )
}

function RiftlyConnectBoard() {
  let router = useRouter()
  return (
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
  )
}
