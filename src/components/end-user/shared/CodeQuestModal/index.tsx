// Modules
import { useState, useCallback } from 'react'

// Components
import ModalWrapper from '../../wrappers/ModalWrapper'
import SubmittableModalContent from './SubmittableModalContent'
import UnclaimableModalContent from '../ModalCommon/UnclaimableModalContent'
import FinishedModalContent from '../ModalCommon/FinishedModalContent'

// Hooks
import { useCodeQuestSubmit } from '@hooks/user/quest'

// Utils
import { debounce } from 'util/index'

// Types
import { Quest } from 'models/quest'

enum ViewStatus {
  SUBMITTABLE = 1,
  SUBMITTED = 2,
  OVERDUE = 3,
  UNCLAIMABLE = 4,
}

interface ICodeQuestModal {
  currentQuest: Quest
  isOpen: boolean
  onClose: () => void
}

const CodeQuestModal = ({ isOpen, onClose, currentQuest }: ICodeQuestModal) => {
  const [codeQuestData, isSubmittingQuest, submit] = useCodeQuestSubmit()
  const [inputError, setInputError] = useState(null)
  const [inputCode, setInputCode] = useState('')
  const [currentView, setView] = useState(ViewStatus.SUBMITTABLE)

  const handleOnChange = (e, error) => {
    if (error) {
      setInputError(null)
    }
    setInputCode(e.target.value)
  }

  const debouncedChangeHandler = useCallback(debounce(handleOnChange, 300), [])

  const onSubmitCodeQuest = useCallback(async () => {
    if (!inputCode) {
      return
    }
    const { questId } = currentQuest
    const res = await submit({ questId, inputCode })

    if (res.isError) {
      setInputError(res.message)
    } else {
      return setView(ViewStatus.SUBMITTED)
    }
  }, [inputCode, currentQuest])

  const handleOnClose = useCallback(() => {
    setInputError(null)
    onClose()
  }, [setInputError, onClose])

  return (
    <ModalWrapper gap="24px" isOpen={isOpen} onClose={onClose} handleOnClose={handleOnClose}>
      {currentView === ViewStatus.SUBMITTABLE && (
        <SubmittableModalContent
          onSubmitCodeQuest={onSubmitCodeQuest}
          isSubmittingQuest={isSubmittingQuest}
          onChangeInput={(e) => debouncedChangeHandler(e, inputError)}
          inputError={inputError}
          isBtnDisabled={inputCode.length === 0}
        />
      )}

      {currentView === ViewStatus.SUBMITTED && (
        <FinishedModalContent
          text="You got the correct answer, return to challenges to claim your reward."
          handleOnClose={handleOnClose}
        />
      )}

      {currentView === ViewStatus.UNCLAIMABLE && (
        <UnclaimableModalContent error={inputError} handleOnClose={handleOnClose} />
      )}
    </ModalWrapper>
  )
}

export default CodeQuestModal
