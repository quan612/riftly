import React, { useState, useContext, useCallback } from 'react'
import { Heading, Text, Button, Image, Input } from '@chakra-ui/react'

import { ChakraBox } from '@theme/additions/framer/FramerChakraComponent'

const SUBMITTABLE = 1
const SUBMITTED = 2
const OVERDUE = 3
const UNCLAIMABLE = 4

import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion'
import { useCodeQuestSubmit } from '@hooks/user/quest'

import { debounce } from 'util/index'
import ModalWrapper from '../wrappers/ModalWrapper'

const CodeQuestModal = ({ isOpen, onClose, currentQuest }) => {
  const [codeQuestData, isSubmittingQuest, submit] = useCodeQuestSubmit()
  const [inputError, setInputError] = useState(null)
  const [inputCode, setInputCode] = useState('')
  const [currentView, setView] = useState(SUBMITTABLE)

  const handleOnChange = (e, error) => {
    if (error) {
      setInputError(null)
    }
    let text = e.target.value
    setInputCode(text)
  }

  const debouncedChangeHandler = useCallback(debounce(handleOnChange, 300), [])

  async function onSubmitCodeQuest() {
    if (!inputCode) {
      return
    }
    const { questId } = currentQuest
    let res = await submit({ questId, inputCode })

    if (res.isError) {
      setInputError(res.message)
    } else {
      return setView(SUBMITTED)
    }
  }

  const handleOnClose = () => {
    setInputError(null)
    onClose()
  }

  return (
    <ModalWrapper gap="24px" isOpen={isOpen} onClose={onClose} handleOnClose={handleOnClose}>
      {currentView === SUBMITTABLE && (
        <AnimatePresence mode="popLayout">
          <ChakraBox w="100%" layout key="code-quest-heading">
            <Heading color="white" fontSize={'3xl'} lineHeight="4xl" align="center">
              What's the answer to this easy question?
            </Heading>
          </ChakraBox>
          <ChakraBox w="100%" layout key="code-quest-text">
            <Text color="brand.neutral0" align="center" fontSize="md">
              Enter the code below to see if it's correct
            </Text>
          </ChakraBox>
          <ChakraBox w="100%" layout key="code-quest-input">
            <Input
              variant={'riftly'}
              type="text"
              placeholder="ENTER CODE"
              onChange={(e) => debouncedChangeHandler(e, inputError)}
            />
          </ChakraBox>
          {inputError && (
            <ChakraBox layout color="red.300" key="code-quest-error" exit={{ opacity: 0 }}>
              {inputError}
            </ChakraBox>
          )}
          <ChakraBox w="100%" key="code-quest-submit" layout>
            <Button
              variant="blue"
              onClick={onSubmitCodeQuest}
              disabled={inputCode.length === 0}
              w="100%"
              borderRadius="24px"
              isLoading={isSubmittingQuest}
            >
              Submit
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

          <ChakraBox w="100%" layout key="code-quest-heading">
            <Heading color="white" fontSize={'xl'} align="center">
              Congrats!
            </Heading>
          </ChakraBox>
          <ChakraBox w="100%" layout key="code-quest-text">
            <Text color="brand.neutral0" align="center" fontSize="md">
              You got the correct answer, return to challenges to claim your reward.
            </Text>
          </ChakraBox>

          <ChakraBox w="100%" key="code-quest-submit" layout>
            <Button variant="blue" onClick={handleOnClose} w="100%" borderRadius="24px">
              Back to Challenges
            </Button>
          </ChakraBox>
        </AnimatePresence>
      )}
      {currentView === UNCLAIMABLE && (
        <AnimatePresence mode="popLayout">
          <ChakraBox layout color="red.300" key="code-quest-error" exit={{ opacity: 0 }}>
            {inputError}
          </ChakraBox>
          <Button variant="blue" onClick={handleOnClose} w="100%" borderRadius="24px">
            Back to Challenges
          </Button>
        </AnimatePresence>
      )}
    </ModalWrapper>
  )
}

export default CodeQuestModal
