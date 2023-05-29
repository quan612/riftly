// Modules
import { AnimatePresence } from 'framer-motion'

// Components
import ButtonSubmit from './ButtonSubmit'
import ErrorMessage from '@components/end-user/shared/ModalCommon/ErrorMessage'

interface IUnclaimableModalContent {
  error: string | null
  handleOnClose: () => void
}

const UnclaimableModalContent = (props: IUnclaimableModalContent) => {
  const { error, handleOnClose } = props

  return (
    <AnimatePresence>
      <ErrorMessage error={error} />
      <ButtonSubmit onClick={handleOnClose} title="Back to Challenges" />
    </AnimatePresence>
  )
}

export default UnclaimableModalContent
