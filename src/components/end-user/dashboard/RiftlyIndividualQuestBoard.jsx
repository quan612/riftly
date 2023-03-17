import React, { useRef, useContext } from 'react'

import { AnimatePresence } from 'framer-motion'

import UserTierLevel from './UserTierLevel'
import FeatureQuests from './FeaturedQuests'
import ChallengeQuests from './ChallengeQuests'
import { UserQuestContext } from '@context/UserQuestContext'
import { CodeQuestModal, NftOwnerQuestModal, WalletAuthQuestModal } from '../shared'
import UnstoppableQuestModal from '../shared/UnstoppableQuestModal'

const RiftlyIndividualQuestBoard = ({ session }) => {
  let levelProgress = useRef(0)
  const {
    codeQuestModal,
    walletAuthQuestModal,
    nftOwnQuestModal,
    unstoppableQuestModal,
    questSelected,
  } = useContext(UserQuestContext)
  console.log(session)
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
          onClose={() => codeQuestModal.onClose()}
          currentQuest={questSelected}
        />
      )}

      {walletAuthQuestModal.isOpen && (
        <WalletAuthQuestModal
          isOpen={walletAuthQuestModal.isOpen}
          onClose={() => {
            walletAuthQuestModal.onClose()
          }}
        />
      )}
      {nftOwnQuestModal.isOpen && (
        <NftOwnerQuestModal
          isOpen={nftOwnQuestModal.isOpen}
          onClose={() => nftOwnQuestModal.onClose()}
          currentQuest={questSelected}
        />
      )}
      {unstoppableQuestModal.isOpen && (
        <UnstoppableQuestModal
          isOpen={unstoppableQuestModal.isOpen}
          onClose={() => unstoppableQuestModal.onClose()}
          currentQuest={questSelected}
        />
      )}
    </>
  )
}

export default RiftlyIndividualQuestBoard
