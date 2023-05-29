// Modules
import { AnimatePresence } from 'framer-motion'

// Components
import ButtonSubmit from '../ModalCommon/ButtonSubmit'
import { ChakraBox } from '@theme/additions/framer/FramerChakraComponent'
import ErrorMessage from '../ModalCommon/ErrorMessage'

// UI
import { Heading, Text } from '@chakra-ui/react'

interface ISubmittableModalContent {
  uauthUser: string
  error: string
  isSubmittingQuest: boolean
  handleOnSubmit: () => void
}

const SubmittableModalContent = (props: ISubmittableModalContent) => {
  const { uauthUser, error, isSubmittingQuest, handleOnSubmit } = props

  return (
    <AnimatePresence>
      <ChakraBox w="100%" layout key="code-quest-heading" textAlign="center">
        <Heading color="white" fontSize="3xl" lineHeight="4xl">
          {uauthUser} has been authenticated
        </Heading>
      </ChakraBox>
      <ChakraBox w="100%" layout key="code-quest-text">
        <Text color="brand.neutral0" align="center" fontSize="md">
          Submit Unstoppable Authenticate Quest
        </Text>
      </ChakraBox>

      {error && <ErrorMessage error={error} />}
      <ChakraBox w="100%" key="unstoppable-quest-submit" layout>
        <ButtonSubmit onClick={handleOnSubmit} title="Submit" isLoading={isSubmittingQuest} />
      </ChakraBox>
    </AnimatePresence>
  )
}

export default SubmittableModalContent
