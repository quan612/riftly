import React, { useRef } from 'react'

import { AnimatePresence } from 'framer-motion'

import UserTierLevel from './UserTierLevel'
import FeatureQuests from './FeaturedQuests'
import ChallengeQuests from './ChallengeQuests'

const RiftlyIndividualQuestBoard = ({ session }) => {
  let levelProgress = useRef(0)

  return (
    <>
      {/* To avoid challenges header to jump around */}
      <AnimatePresence initial={false}>
        <UserTierLevel ref={levelProgress} session={session} key="user-tier" />
        <FeatureQuests key="feature" />
        <ChallengeQuests key="challenge" />
      </AnimatePresence>
    </>
  )
}

export default RiftlyIndividualQuestBoard
