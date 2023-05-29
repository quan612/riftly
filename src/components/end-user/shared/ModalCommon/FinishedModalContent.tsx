// Modules
import { AnimatePresence } from 'framer-motion'

// Components
import { ChakraBox } from '@theme/additions/framer/FramerChakraComponent'
import ButtonSubmit from '../ModalCommon/ButtonSubmit'
import CongratsImg from '../ModalCommon/CongratsImg'

// UI
import { Text } from '@chakra-ui/react'

interface IFinishedModalContent {
  text?: string
  handleOnClose: () => void
}

const FinishedModalContent = (props: IFinishedModalContent) => {
  const { text, handleOnClose } = props

  return (
    <AnimatePresence>
      <CongratsImg />
      <ChakraBox w="100%" layout>
        <Text color="brand.neutral0" align="center" fontSize="md">
          {text}
        </Text>
      </ChakraBox>

      <ChakraBox w="100%" layout>
        <ButtonSubmit onClick={handleOnClose} title="Back to Challenges" />
      </ChakraBox>
    </AnimatePresence>
  )
}

export default FinishedModalContent
