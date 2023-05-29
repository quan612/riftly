// Modules
import { AnimatePresence } from 'framer-motion'

// Components
import ButtonSubmit from '../ModalCommon/ButtonSubmit'
import { ChakraBox } from '@theme/additions/framer/FramerChakraComponent'
import ErrorMessage from '../ModalCommon/ErrorMessage'

// UI
import { Heading, Text } from '@chakra-ui/react'

// Types
import { Quest } from 'models/quest'

interface IClaimableModalContent {
  currentQuest: Quest
  error: string
  isSubmittingQuest: boolean
  onSubmitNftQuest: () => void
}

const ClaimableModalContent = (props: IClaimableModalContent) => {
  const { currentQuest, error, isSubmittingQuest, onSubmitNftQuest } = props

  return (
    <AnimatePresence>
      <ChakraBox w="100%" layout key="nft-quest-heading" textAlign="center">
        <Heading color="white" fontSize="xl">
          {currentQuest?.text}
        </Heading>
      </ChakraBox>
      <ChakraBox w="100%" layout key="code-quest-text">
        <Text color="brand.neutral0" align="center" fontSize="md">
          {currentQuest?.description}
        </Text>
      </ChakraBox>

      {error && <ErrorMessage error={error} />}
      <ChakraBox w="100%" key="nft-quest-submit" layout>
        <ButtonSubmit isLoading={isSubmittingQuest} onClick={onSubmitNftQuest} title="Submit" />
      </ChakraBox>
    </AnimatePresence>
  )
}

export default ClaimableModalContent
