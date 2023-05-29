// Modules
import { useCallback, useState } from 'react'

// Components
import ModalWrapper from '../../wrappers/ModalWrapper'
import UnclaimableModalContent from '../ModalCommon/UnclaimableModalContent'
import ClaimableModalContent from './ClaimableModalContent'
import FinishedModalContent from '../ModalCommon/FinishedModalContent'

// Hooks
import { useNftOwningQuestSubmit } from '@hooks/user/quest'

enum ViewStatus {
  CLAIMABLE,
  CLAIMED,
  UNCLAIMABLE,
}

const NftOwnerQuestModal = ({ isOpen, onClose, currentQuest }) => {
  const [nftQuestData, isSubmittingQuest, submit] = useNftOwningQuestSubmit()
  const [error, errorSet] = useState(null)
  const [currentView, setView] = useState(ViewStatus.CLAIMABLE)

  const onSubmitNftQuest = useCallback(async () => {
    const { questId } = currentQuest
    const res = await submit({ questId })

    if (res.isError) {
      errorSet(res.message)
    } else {
      return setView(ViewStatus.CLAIMED)
    }
  }, [currentQuest, submit])

  const handleOnClose = useCallback(() => {
    errorSet(null)
    onClose()
  }, [errorSet, onClose])

  return (
    <ModalWrapper gap="24px" isOpen={isOpen} onClose={onClose} handleOnClose={handleOnClose}>
      {currentView === ViewStatus.CLAIMABLE && (
        <ClaimableModalContent
          currentQuest={currentQuest}
          error={error}
          isSubmittingQuest={isSubmittingQuest}
          onSubmitNftQuest={onSubmitNftQuest}
        />
      )}

      {currentView === ViewStatus.CLAIMED && (
        <FinishedModalContent
          text="You own the Nft, return to challenges to claim your reward."
          handleOnClose={handleOnClose}
        />
      )}
      {currentView === ViewStatus.UNCLAIMABLE && (
        <UnclaimableModalContent error={error} handleOnClose={handleOnClose} />
      )}
    </ModalWrapper>
  )
}

export default NftOwnerQuestModal
