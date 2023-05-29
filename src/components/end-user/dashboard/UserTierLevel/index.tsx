// Modules
import { useEffect, useState, forwardRef, MutableRefObject } from 'react'
import { Session } from 'next-auth'

// Components
import UserTierLevel from './components/UserTierLevel'

// Hooks
import { useUserRewardQuery } from '@hooks/user/reward'
import usePrevious from './usePrevious'

// Utils
import { getPoints, getLevel } from './helpers'
import { getUserName } from 'util/index'

// UI
import { useDisclosure } from '@chakra-ui/react'

// Types
import { TierType } from './types'

interface IUserTierLevel {
  session: Session
}

const UserTierLevelContainer = forwardRef(
  ({ session }: IUserTierLevel, levelProgress: MutableRefObject<number>) => {
    const [userRewards, userRewardLoading] = useUserRewardQuery(session)
    const [avatar] = useState<string>(session?.user?.avatar)

    const [tier, tierSet] = useState<TierType>(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    let levelUpTimeout

    const previousData = usePrevious(userRewards || null)
    const isFirstRender = previousData === undefined
    const shouldAnimateInitialRender = (isFirstRender && !userRewards) || previousData === null

    useEffect(() => {
      return () => {
        clearTimeout(levelUpTimeout)
      }
    }, [])

    useEffect(() => {
      if (userRewards && userRewards.length >= 0) {
        if (userRewards.length === 0) {
          tierSet({
            currentLevel: 1,
            nextLevel: 2,
            currentPoint: 0,
          })
          return
        }

        const currentReward = userRewards[0]
        if (!tier) {
          const currentPoint = currentReward.quantity
          const currentLevel = getLevel(currentPoint)
          const currentLevelPoint = getPoints(currentLevel)
          const nextLevelPoint = getPoints(currentLevel + 1)

          const progress =
            ((currentPoint - currentLevelPoint) / (nextLevelPoint - currentLevelPoint)) * 100

          const newTier = {
            currentLevel,
            nextLevel: currentLevel + 1,
            currentPoint,
          }

          levelProgress.current = progress
          tierSet((prev) => newTier)

          return
        }

        const newPoint = currentReward.quantity
        const currentLevel = getLevel(tier.currentPoint)
        const currentLevelPoint = getPoints(currentLevel)
        const nextLevelPoint = getPoints(currentLevel + 1)
        const progress =
          ((newPoint - currentLevelPoint) / (nextLevelPoint - currentLevelPoint)) * 100

        let newTier
        if (newPoint > nextLevelPoint) {
          levelProgress.current = 100
          levelUpTimeout = setTimeout(() => {
            onOpen()

            const currentLevelPoint = getPoints(currentLevel + 1)
            const nextLevelPoint = getPoints(tier.currentLevel + 2)
            const newProgress =
              ((newPoint - currentLevelPoint) / (nextLevelPoint - currentLevelPoint)) * 100
            levelProgress.current = newProgress
            newTier = {
              currentLevel: currentLevel + 1,
              nextLevel: currentLevel + 2,
              currentPoint: newPoint,
            }
            tierSet(newTier)
            clearTimeout(levelUpTimeout)
          }, 1350)
        } else {
          levelProgress.current = progress
          newTier = {
            currentLevel: currentLevel,
            nextLevel: currentLevel + 1,
            currentPoint: newPoint,
          }
          tierSet(newTier)
        }
      }
    }, [userRewards])

    return (
      <UserTierLevel
        avatar={avatar}
        isOpenModal={isOpen}
        levelProgress={levelProgress}
        onCloseModal={onClose}
        shouldAnimateInitialRender={shouldAnimateInitialRender}
        tier={tier}
        userName={getUserName(session)}
        userRewards={userRewards}
      />
    )
  },
)

export default UserTierLevelContainer
