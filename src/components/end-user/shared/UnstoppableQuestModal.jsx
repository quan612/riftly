import React, { useState, useContext, useCallback } from 'react'
import { Heading, Text, Button, Image, Input } from '@chakra-ui/react'

import { ChakraBox } from '@theme/additions/framer/FramerChakraComponent'

const LINKABLE = 0
const SUBMITTABLE = 1
const SUBMITTED = 2
const OVERDUE = 3
const ERROR = 4

import { AnimatePresence } from 'framer-motion'
import { debounce } from 'util/index'
import ModalWrapper from '../wrappers/ModalWrapper'

import UAuth from '@uauth/js'
import { useUnstoppableAuthQuestSubmit } from '@hooks/user/quest'
const { default: Resolution } = require('@unstoppabledomains/resolution')
const resolution = new Resolution()

const uauth = new UAuth({
  clientID: process.env.NEXT_PUBLIC_UNSTOPPABLE_CLIENT_ID,
  redirectUri: process.env.NEXT_PUBLIC_UNSTOPPABLE_REDIRECT_URI,
  scope: 'openid wallet',
})

const UnstoppableQuestModal = ({ isOpen, onClose, currentQuest }) => {
  const [error, errorSet] = useState(null)
  const [currentView, setView] = useState(LINKABLE)
  const [uauthUser, setUauthUser] = useState(null)
  const [questData, isSubmittingQuest, submitQuest] = useUnstoppableAuthQuestSubmit()

  const handleOnClose = useCallback(() => {
    errorSet(null)
    onClose()
  }, [])

  const handleUnstoppableLogin = useCallback(async () => {
    // let auth = "quan612.crypto";
    errorSet(null)
    try {
      const authorization = await uauth.loginWithPopup()
      console.log(authorization)
      // let test = await resolution.owner(auth);
      if (authorization) {
        let user = await uauth.user()
        console.log(user)
        setUauthUser(user.sub)
        setView(SUBMITTABLE)
      } else {
        // console.log(authorization);
        errorSet('something wrong')
      }
    } catch (error) {
      errorSet(error.message)
    }
  }, [])

  async function handleOnSubmit() {
    /** Submit this quest */
    const { questId, type, rewardTypeId, quantity, extendedQuestData } = submissionQuest
    if (!uauthUser) {
      return
    }
    let payload = {
      questId,
      uauthUser,
    }
    let res = await submitQuest(payload)

    if (res?.isError) {
      setError(res.message)
    } else {
      setView(SUBMITTED)
    }
  }

  return (
    <ModalWrapper gap="24px" isOpen={isOpen} onClose={onClose} handleOnClose={handleOnClose}>
      {currentView === LINKABLE && (
        <AnimatePresence mode="popLayout">
          <ChakraBox w="100%" layout key="code-quest-heading">
            <Heading color="white" fontSize={'3xl'} lineHeight="4xl" align="center">
              Welcome to Unstoppable Quest
            </Heading>
          </ChakraBox>
          <ChakraBox w="100%" layout key="code-quest-text">
            <Text color="brand.neutral0" align="center" fontSize="md">
              Link your Unstoppable Domain
            </Text>
            <Text color="brand.neutral0" align="center" fontSize="md">
              You should be able to get a free domain on linking step.
            </Text>
          </ChakraBox>

          {error && (
            <ChakraBox layout color="red.300" key="unstoppable-quest-error" exit={{ opacity: 0 }}>
              {error}
            </ChakraBox>
          )}
          <ChakraBox w="100%" key="unstoppable-quest-submit" layout>
            <Button
              variant="blue"
              onClick={handleUnstoppableLogin}
              w="100%"

              // isLoading={isSubmittingQuest}
            >
              Link
            </Button>
          </ChakraBox>
        </AnimatePresence>
      )}
      {currentView === SUBMITTABLE && (
        <AnimatePresence mode="popLayout">
          <ChakraBox w="100%" layout key="code-quest-heading">
            <Heading color="white" fontSize={'3xl'} lineHeight="4xl" align="center">
              {uauthUser} has been authenticated
            </Heading>
          </ChakraBox>
          <ChakraBox w="100%" layout key="code-quest-text">
            <Text color="brand.neutral0" align="center" fontSize="md">
              Submit Unstoppable Authenticate Quest
            </Text>
          </ChakraBox>

          {error && (
            <ChakraBox layout color="red.300" key="unstoppable-quest-error" exit={{ opacity: 0 }}>
              {error}
            </ChakraBox>
          )}
          <ChakraBox w="100%" key="unstoppable-quest-submit" layout>
            <Button
              variant="blue"
              onClick={handleOnSubmit}
              w="100%"

              // isLoading={isSubmittingQuest}
            >
              Link
            </Button>
          </ChakraBox>
        </AnimatePresence>
      )}

      {currentView === SUBMITTED && (
        <AnimatePresence mode="popLayout">
          <Image
            src="/img/user/riftly-success.gif"
            boxSize={{ sm: '40px', md: '60px', lg: '80px' }}
          />

          <ChakraBox w="100%" layout key="unstoppable-quest-heading">
            <Heading color="white" fontSize={'xl'} align="center">
              Congrats!
            </Heading>
          </ChakraBox>
          <ChakraBox w="100%" layout key="unstoppable-quest-text">
            <Text color="brand.neutral0" align="center" fontSize="md">
              You linked an unstoppable domain, return to challenges to claim your reward.
            </Text>
          </ChakraBox>

          <ChakraBox w="100%" key="unstoppable-quest-submit" layout>
            <Button variant="blue" onClick={handleOnClose} w="100%">
              Back to Challenges
            </Button>
          </ChakraBox>
        </AnimatePresence>
      )}
    </ModalWrapper>
  )
}

export default UnstoppableQuestModal