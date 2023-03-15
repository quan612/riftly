import React, { useEffect, useState, useContext, useCallback } from 'react'
import { Heading, Text, Button, Image } from '@chakra-ui/react'
import { ChakraBox } from '@theme/additions/framer/FramerChakraComponent'
import { AnimatePresence } from 'framer-motion'
import { useNftOwningQuestSubmit } from '@hooks/user/quest'

import ModalWrapper from '../wrappers/ModalWrapper'
const CLAIMABLE = 0
const CLAIMED = 1
const UNCLAIMABLE = 2

const NftOwnerQuestModal = ({ isOpen, onClose, currentQuest }) => {
  const [nftQuestData, isSubmittingQuest, submit] = useNftOwningQuestSubmit()
  const [error, errorSet] = useState(null)
  const [currentView, setView] = useState(CLAIMABLE)

  async function onSubmitNftQuest() {
    const { questId } = currentQuest
    let res = await submit({ questId })

    if (res.isError) {
      errorSet(res.message)
    } else {
      return setView(CLAIMED)
    }
  }

  const handleOnClose = () => {
    errorSet(null)
    onClose()
  }

  return (
    <ModalWrapper gap="24px" isOpen={isOpen} onClose={onClose} handleOnClose={handleOnClose}>
      {currentView === CLAIMABLE && (
        <AnimatePresence mode="popLayout">
          <ChakraBox w="100%" layout key="nft-quest-heading">
            <Heading color="white" fontSize={'xl'} align="center">
              {currentQuest.text}
            </Heading>
          </ChakraBox>
          <ChakraBox w="100%" layout key="code-quest-text">
            <Text color="brand.neutral0" align="center" fontSize="md">
              {currentQuest.description}
            </Text>
          </ChakraBox>

          {error && (
            <ChakraBox layout color="red.300" key="nft-quest-error" exit={{ opacity: 0 }}>
              {error}
            </ChakraBox>
          )}
          <ChakraBox w="100%" key="nft-quest-submit" layout>
            <Button
              variant="blue"
              onClick={onSubmitNftQuest}
              w="100%"
              borderRadius="24px"
              isLoading={isSubmittingQuest}
            >
              Submit
            </Button>
          </ChakraBox>
        </AnimatePresence>
      )}
      {currentView === CLAIMED && (
        <>
          <Image
            src="/img/user/riftly-success.gif"
            boxSize={{ sm: '40px', md: '60px', lg: '80px' }}
          />

          <Heading color="white" fontSize={'xl'} align="center" w="100%">
            Congrats!
          </Heading>

          <Text color="brand.neutral0" align="center" fontSize="md" w="100%">
            You own the Nft, return to challenges to claim your reward.
          </Text>

          <Button w="100%" variant="blue" onClick={handleOnClose} borderRadius="24px">
            Back to Challenges
          </Button>
        </>
      )}
      {currentView === UNCLAIMABLE && (
        <AnimatePresence mode="popLayout">
          <ChakraBox layout color="red.300" key="code-quest-error" exit={{ opacity: 0 }}>
            {error}
          </ChakraBox>
          <Button variant="blue" onClick={handleOnClose} w="100%" borderRadius="24px">
            Back to Challenges
          </Button>
        </AnimatePresence>
      )}
    </ModalWrapper>
  )
}

export default NftOwnerQuestModal
