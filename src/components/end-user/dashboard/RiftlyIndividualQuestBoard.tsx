// Moules
import { useRef, useContext, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'

// Components
import UserTierLevel from './UserTierLevel'
import FeatureQuests from './FeaturedQuests'
import ChallengeQuests from './ChallengeQuests'
import {
  CodeQuestModal,
  NftOwnerQuestModal,
  WalletAuthQuestModal,
  UnstoppableQuestModal,
} from '../shared'

// Store
import { UserQuestContext } from '@context/UserQuestContext'

const RiftlyIndividualQuestBoard = ({ session }) => {
  const levelProgress = useRef(0)
  const {
    codeQuestModal,
    walletAuthQuestModal,
    nftOwnQuestModal,
    unstoppableQuestModal,
    questSelected,
  } = useContext(UserQuestContext)

  const onCloseCodeQuestModal = useCallback(() => codeQuestModal.onClose(), [codeQuestModal])

  const onCloseNftOwnQuestModal = useCallback(() => nftOwnQuestModal.onClose(), [nftOwnQuestModal])

  const onCloseUnstoppableQuestModal = useCallback(
    () => unstoppableQuestModal.onClose(),
    [unstoppableQuestModal],
  )

  const onCloseWalletAuthQuestModal = useCallback(
    () => walletAuthQuestModal.onClose(),
    [walletAuthQuestModal],
  )

  return (
    <>
      {/* To avoid challenges header to jump around */}
      <AnimatePresence initial={false}>
        <UserTierLevel ref={levelProgress} session={session} key="user-tier" />
        <FeatureQuests key="feature" />
        <ChallengeQuests key="challenge" />
      </AnimatePresence>

      {codeQuestModal && (
        <CodeQuestModal
          isOpen={codeQuestModal.isOpen}
          onClose={onCloseCodeQuestModal}
          currentQuest={questSelected}
        />
      )}

      {walletAuthQuestModal.isOpen && (
        <WalletAuthQuestModal
          isOpen={walletAuthQuestModal.isOpen}
          onClose={onCloseWalletAuthQuestModal}
        />
      )}
      {nftOwnQuestModal.isOpen && (
        <NftOwnerQuestModal
          isOpen={nftOwnQuestModal.isOpen}
          onClose={onCloseNftOwnQuestModal}
          currentQuest={questSelected}
        />
      )}
      {unstoppableQuestModal.isOpen && (
        <UnstoppableQuestModal
          isOpen={unstoppableQuestModal.isOpen}
          onClose={onCloseUnstoppableQuestModal}
          currentQuest={questSelected}
        />
      )}
    </>
  )
}

export default RiftlyIndividualQuestBoard
