// Modules
import { AnimatePresence } from 'framer-motion'

// Components
import ButtonSubmit from '../ModalCommon/ButtonSubmit'
import { ChakraBox } from '@theme/additions/framer/FramerChakraComponent'
import ErrorMessage from '../ModalCommon/ErrorMessage'

// UI
import { Heading, Text } from '@chakra-ui/react'

interface ILinkableModalContent {
  error: string
  handleUnstoppableLogin: () => void
}

const LinkableModalContent = (props: ILinkableModalContent) => {
  const { error, handleUnstoppableLogin } = props

  return (
    <AnimatePresence>
      <ChakraBox w="100%" layout key="code-quest-heading" textAlign="center">
        <Heading color="white" fontSize="3xl" lineHeight="4xl">
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

      {error && <ErrorMessage error={error} />}
      <ChakraBox w="100%" key="unstoppable-quest-submit" layout>
        <ButtonSubmit onClick={handleUnstoppableLogin} title="Link" />
      </ChakraBox>
    </AnimatePresence>
  )
}

export default LinkableModalContent
