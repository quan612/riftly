import React, { useState, useCallback, useRef } from 'react'
import {
  Heading,
  Box,
  Flex,
  Text,
  Button,
  useDisclosure,
  Divider,
  ButtonGroup,
  HStack,
  Image,
  Input,
} from '@chakra-ui/react'
import { WalletAuthQuestModal, WalletSignInModal } from '../shared'

import {
  DiscordIcon,
  GoogleIcon,
  MetamaskIcon,
  TwitterIcon,
  WalletConnectIcon,
} from '@components/shared/Icons'
import { useRouter } from 'next/router'

import { ShortContainer } from '@components/end-user/wrappers'

import { signIn } from 'next-auth/react'
import axios from 'axios'
import { ChakraBox } from '@theme/additions/framer/FramerChakraComponent'
import { getTwitterAuthLink, getDiscordAuthLink } from '@util/index'
import Loading from '@components/shared/LoadingContainer/Loading'
import { debounce, sleep } from 'util/index'
import Enums from '@enums/index'

import * as gtag from '@lib/ga/gtag'

const NON_EMAIL = 1
const EMAIL = 2
const FORGOT_PASSWORD = 3
const SIGN_UP_SUCCESS = 4

export const SignInSignUpWrapper = ({ isSignIn = false }) => {
  const router = useRouter()
  const walletSignInModal = useDisclosure()
  const walletSignUpModal = useDisclosure()
  const [view, setView] = useState(NON_EMAIL)

  const inputRefs = {
    emailRef: useRef(''),
    passwordRef: useRef(''),
  }

  return (
    <>
      {walletSignInModal?.isOpen && (
        <WalletSignInModal
          isOpen={walletSignInModal.isOpen}
          onClose={() => {
            walletSignInModal.onClose()
          }}
        />
      )}

      {walletSignUpModal?.isOpen && (
        <WalletAuthQuestModal
          isSignUp={true}
          isOpen={walletSignUpModal.isOpen}
          onClose={() => {
            walletSignUpModal.onClose()
          }}
        />
      )}
      {view === NON_EMAIL && (
        <>
          <Flex
            flexDirection={'column'}
            gap="8px"
            justify="flex-start"
            w="100%"
            justifyContent={'flex-start'}
          >
            <Heading fontSize="24px" color="#fff" fontWeight={'700'}>
              {isSignIn ? 'Welcome Back!' : "Let's get started"}
            </Heading>
            <Text fontSize="md" color={'brand.neutral1'}>
              {isSignIn
                ? 'Sign in with your credentials'
                : 'Create an account with your preferred method'}
            </Text>
          </Flex>
          <ButtonGroup
            spacing={{ base: '12px', lg: '16px' }}
            w="100%"
            justifyContent={'space-between'}
          >
            <Button
              onClick={async () => {
                if (isSignIn) {
                  signIn('discord', {
                    callbackUrl: `${window.location.origin}`,
                  })
                } else {
                  if (typeof window !== 'undefined' && window.gtag) {
                    console.log('Discord sign up tracked')
                    gtag.event({
                      action: 'sign_up_success',
                      method: Enums.DISCORD,
                      label: 'Discord signs up successfully',
                    })
                  }
                  let discordLink = await getDiscordAuthLink()
                  return window.open(discordLink, '_self')
                }
              }}
              variant="discord"
              w={'47%'}
            >
              <HStack>
                <DiscordIcon />
                <Text>Discord</Text>
              </HStack>
            </Button>

            <Button
              onClick={async () => {
                if (isSignIn) {
                  signIn('twitter', {
                    callbackUrl: `${window.location.origin}`,
                  })
                } else {
                  if (typeof window !== 'undefined' && window.gtag) {
                    console.log('Twitter sign up tracked')
                    gtag.event({
                      action: 'sign_up_success',
                      method: Enums.TWITTER,
                      label: 'Twitter signs up successfully',
                    })
                  }
                  let twitterLink = await getTwitterAuthLink()
                  return window.open(twitterLink, '_self')
                }
              }}
              variant="twitter"
              w={'47%'}
            >
              <HStack>
                <TwitterIcon />
                <Text>Twitter</Text>
              </HStack>
            </Button>
          </ButtonGroup>
          <ButtonGroup
            spacing={{ base: '12px', lg: '16px' }}
            w="100%"
            justifyContent={'space-between'}
          >
            <Button
              onClick={() => {
                if (isSignIn) {
                  // signIn("google",{
                  //   callbackUrl: `${window.location.origin}`,
                  // });
                  // signIn("twitter");
                } else {
                  if (typeof window !== 'undefined' && window.gtag) {
                    console.log('Discord sign up tracked')
                    gtag.event({
                      action: 'sign_up_success',
                      method: Enums.DISCORD,
                      label: 'Discord signs up successfully',
                    })
                  }
                  // let twitterLink = await getTwitterAuthLink();
                  // return window.open(twitterLink, "_self");
                }
              }}
              disabled={true}
              variant="google"
              w={'47%'}
            >
              <HStack>
                <GoogleIcon />
                <Text>Google</Text>
              </HStack>
            </Button>

            <Button
              onClick={() => {
                if (isSignIn) {
                  walletSignInModal.onOpen()
                } else {
                  walletSignUpModal.onOpen()
                }
              }}
              variant="wallet"
              w={'47%'}
            >
              <HStack>
                <MetamaskIcon /> <Text>Wallet</Text>
              </HStack>
            </Button>
          </ButtonGroup>
          <Flex w="100%" justifyContent={'center'}>
            <Flex w="33%" alignItems={'center'}>
              <Divider color={'#597BA1'} opacity={'1'} />
            </Flex>

            <Heading w="33%" color="#fff" align={'center'} fontSize={{ base: '18px', lg: '24px' }}>
              or
            </Heading>
            <Flex w="33%" alignItems={'center'}>
              <Divider color={'#597BA1'} opacity={'1'} />
            </Flex>
          </Flex>
          <Flex
            w="100%"
            justifyContent={'center'}
            flexDirection="column"
            alignItems={'center'}
            gap={{ base: '16px', lg: '24px' }}
          >
            <Input
              variant={'riftly'}
              type="text"
              size="lg"
              placeholder="Email"
              ref={inputRefs.emailRef}
              defaultValue={inputRefs.emailRef.current.value}
            />
            <Button
              w="100%"
              variant="blue"
              size="lg"
              fontSize="18px"
              onClick={() => {
                setView(EMAIL)
              }}
            >
              Continue
            </Button>
            <Button
              variant="ghost-blue"
              fontSize="18px"
              onClick={() => {
                router.push('/welcome')
              }}
            >
              Back
            </Button>
          </Flex>
        </>
      )}
      {view === EMAIL && <EmailWrapper isSignIn={isSignIn} setView={setView} ref={inputRefs} />}
      {view === FORGOT_PASSWORD && <ForgotPassword setView={setView} />}
      {view === SIGN_UP_SUCCESS && (
        <ShortContainer>
          <Image
            src="/img/user/riftly-success.gif"
            boxSize={{ sm: '40px', md: '60px', lg: '80px' }}
          />
          <Text color="#fff" exit={{ opacity: 0 }} align="center" fontSize="lg">
            Sign up successful. Redirecting to dashboard.
          </Text>
        </ShortContainer>
      )}
    </>
  )
}

export const EmailWrapper = React.forwardRef(({ isSignIn = false, setView }, ref) => {
  let router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const [error, errorSet] = useState(null)

  const emailSignIn = async () => {
    const { emailRef, passwordRef } = ref
    let email = emailRef.current.value
    let password = passwordRef.current.value
    if (!email || !password) {
      return errorSet('Email or password cannot be blank')
    }
    errorSet(null)

    try {
      setLoading(true)
      await sleep(1000)
      let signInRes = await signIn('email', {
        // redirect: false,

        redirect: false,
        email,
        password,
        callbackUrl: `${window.location.origin}`,
      })

      if (signInRes?.error) {
        setLoading(false)
        if (signInRes?.error !== 'Pending Sign Up') {
          errorSet(signInRes.error)
        } else {
          router.push(`/sms-verification?account=${email}&type=${Enums.EMAIL}`)
        }
      } else {
        router.push('/')
      }
    } catch (error) {
      errorSet(error.message)
      setLoading(false)
    }
  }
  const emailSignUp = async () => {
    const { emailRef, passwordRef } = ref

    let email = emailRef.current.value
    let password = passwordRef.current.value
    if (!email || !password) {
      return errorSet('Email or password cannot be blank')
    }
    errorSet(null)
    let payload = {
      email: ref.emailRef.current.value,
      password: ref.passwordRef.current.value,
    }

    setLoading(true)
    await sleep(1000)
    try {
      let signUpRes = await axios.post(`/api/user/email-sign-up`, payload).then((r) => r.data)

      if (signUpRes.isError) {
        errorSet(signUpRes.message)
        setLoading(false)
      } else {
        setView(SIGN_UP_SUCCESS)

        await signIn('email', {
          redirect: false,
          email,
          password,
        })
        router.push('/')
      }
    } catch (error) {
      errorSet(error.message)
      setLoading(false)
    }
  }

  return (
    <>
      {isLoading && <Loading />}
      <Flex
        flexDirection={'column'}
        gap="24px"
        justify="flex-start"
        w="100%"
        justifyContent={'flex-start'}
      >
        <Heading fontSize="24px" color="#fff" fontWeight={'700'}>
          {isSignIn ? 'Continue with your email' : 'Sign up with your email'}
        </Heading>

        <Input
          ref={ref.emailRef}
          defaultValue={ref.emailRef.current.value}
          variant={'riftly'}
          type="text"
          size="lg"
          placeholder="Email"
        />
        <Input
          ref={ref.passwordRef}
          variant={'riftly'}
          type="password"
          size="lg"
          placeholder="Password"
        />
        <Button
          w="100%"
          variant="blue"
          size="lg"
          fontSize="18px"
          onClick={() => {
            if (isSignIn) {
              emailSignIn()
            } else {
              emailSignUp()
            }
          }}
        >
          {isSignIn ? 'Sign In' : 'Create Account'}
        </Button>

        <Button variant="ghost-blue" fontSize="18px" onClick={() => setView(NON_EMAIL)}>
          Back
        </Button>

        {error && (
          <ChakraBox color="red.300" key="email-sign-up-error" exit={{ opacity: 0 }}>
            {error}
          </ChakraBox>
        )}

        {isSignIn && (
          <Flex justifyContent={'space-between'}>
            <Text
              fontSize="md"
              color="brand.neutral1"
              onClick={() => setView(FORGOT_PASSWORD)}
              _hover={{
                cursor: 'pointer',
              }}
            >
              Forgot password?
            </Text>
          </Flex>
        )}
      </Flex>
    </>
  )
})

const ForgotPassword = ({ setView }) => {
  const [error, errorSet] = useState(null)
  const [email, emailSet] = useState('')
  const [password, passwordSet] = useState('')

  const handleEmailChange = (e, error) => {
    if (error) {
      errorSet(null)
    }

    emailSet(e.target.value)
  }

  const handlePasswordChange = (e, error) => {
    if (error) {
      errorSet(null)
    }

    passwordSet(e.target.value)
  }

  const handleReset = async () => {
    const payload = {
      email,
      password,
    }

    const resetPassword = await axios.post(`/api/user/password-reset`, payload).then((r) => r.data)

    if (resetPassword.isError) {
      errorSet(resetPassword.message)
    } else {
      // setView(RESET_PASSWORD_SUCCESS)
    }
  }

  const debouncedEmailChangeHandler = useCallback(debounce(handleEmailChange, 300), [])
  const debouncedPasswordChangeHandler = useCallback(debounce(handlePasswordChange, 300), [])
  return (
    <ShortContainer>
      <Heading color="brand.neutral0" fontWeight="bold" exit={{ opacity: 0 }}>
        Password Reset
      </Heading>

      <Input
        variant={'riftly'}
        type="text"
        size="lg"
        placeholder="Email"
        onChange={(e) => debouncedEmailChangeHandler(e, error)}
      />
      <Input
        variant={'riftly'}
        type="password"
        size="lg"
        placeholder="New Password"
        onChange={(e) => debouncedPasswordChangeHandler(e, error)}
      />
      <Button variant="blue" fontSize="18px" onClick={() => handleReset()}>
        Reset Password
      </Button>
    </ShortContainer>
  )
}
