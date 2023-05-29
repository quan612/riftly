// Modules
import { ChangeEvent } from 'react'
import { AnimatePresence } from 'framer-motion'

// Components
import { ChakraBox } from '@theme/additions/framer/FramerChakraComponent'
import ButtonSubmit from '../ModalCommon/ButtonSubmit'
import ErrorMessage from '../ModalCommon/ErrorMessage'

// UI
import { Heading, Text, Input } from '@chakra-ui/react'

interface ISubmittableModalContent {
  inputError: string | null
  isBtnDisabled: boolean
  isSubmittingQuest: boolean
  onChangeInput: (e: ChangeEvent<HTMLInputElement>) => void
  onSubmitCodeQuest: () => void
}

const SubmittableModalContent = (props: ISubmittableModalContent) => {
  const { inputError, isBtnDisabled, isSubmittingQuest, onChangeInput, onSubmitCodeQuest } = props

  return (
    <AnimatePresence>
      <ChakraBox w="100%" layout key="code-quest-heading" textAlign="center">
        <Heading color="white" fontSize="3xl" lineHeight="4xl">
          What's the answer to this easy question?
        </Heading>
      </ChakraBox>
      <ChakraBox w="100%" layout key="code-quest-text">
        <Text color="brand.neutral0" align="center" fontSize="md">
          Enter the code below to see if it's correct
        </Text>
      </ChakraBox>
      <ChakraBox w="100%" layout key="code-quest-input">
        <Input onChange={onChangeInput} placeholder="ENTER CODE" type="text" variant="riftly" />
      </ChakraBox>
      {inputError && <ErrorMessage error={inputError} />}
      <ChakraBox w="100%" key="code-quest-submit" layout>
        <ButtonSubmit
          disabled={isBtnDisabled}
          isLoading={isSubmittingQuest}
          onClick={onSubmitCodeQuest}
          title="Submit"
        />
      </ChakraBox>
    </AnimatePresence>
  )
}

export default SubmittableModalContent
