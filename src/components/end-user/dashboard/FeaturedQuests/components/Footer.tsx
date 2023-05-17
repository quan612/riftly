// Moules
import { useEffect, useState, useCallback, useContext } from 'react'
import { useQueryClient } from 'react-query'
// UI
import { Box, Flex, Button, useToast } from '@chakra-ui/react'

// Components
import { HeadingLg } from '@components/shared/Typography'
import { RiftlyIcon } from '@components/shared/Icons'

// Hooks
import { QUERY_USER_REWARD } from '@hooks/user/reward'
import { useUserFeatureQuestQuery, useUserQuestClaim } from '@hooks/user/quest'

// Store
import { UserQuestContext } from '@context/UserQuestContext'

const Footer = ({ quest }) => {
  const { isClaimable, questId, quantity } = quest
  const { isSubmittingQuest, isSubmittingDaily, doQuest } = useContext(UserQuestContext)
  const [, isClaimingUserQuest, onUserQuestClaim] = useUserQuestClaim()
  const { data, isLoading: isFetchingFeatureQuests } = useUserFeatureQuestQuery()

  const toast = useToast()
  const queryClient = useQueryClient()
  let invalidCacheTimeout, scorePopupTimeout

  const [disableBtn, disableBtnSet] = useState(false)
  const [showScore, showScoreSet] = useState(false)

  useEffect(() => {
    return () => {
      clearTimeout(scorePopupTimeout)
      clearTimeout(invalidCacheTimeout)
    }
  }, [])

  const getButtonState = useCallback(() => {
    if (disableBtn) return true
    if (isClaimingUserQuest || isSubmittingQuest || isFetchingFeatureQuests || isSubmittingDaily)
      return true
    return false
  }, [
    disableBtn,
    isClaimingUserQuest,
    isSubmittingQuest,
    isFetchingFeatureQuests,
    isSubmittingDaily,
  ])

  const claimQuest = useCallback(async (questId) => {
    disableBtnSet(true)
    try {
      const res = await onUserQuestClaim({ questId })
      if (res.isError) {
        throw res.message
      }

      invalidCacheTimeout = setTimeout(() => {
        queryClient.invalidateQueries(QUERY_USER_REWARD)
        queryClient.invalidateQueries('user-query-feature-quest')

        clearTimeout(invalidCacheTimeout)
      }, 1000)
    } catch (error) {
      console.log(error)
      toast({
        title: 'Exception',
        description: `Catch error at quest id: ${questId}. Please contact admin.`,
        position: 'top-right',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      disableBtnSet(false)
    }
  }, [])

  return (
    <Flex align="start" alignItems="center" justify="space-between" mt="auto" pb="6px">
      <Flex alignItems="center" gap="5px">
        <Box maxH="24px" h="33%" position="relative" boxSize="16px">
          <RiftlyIcon />
        </Box>
        <HeadingLg fontWeight="700" color="white">
          {quantity}
        </HeadingLg>
      </Flex>

      <Button
        borderRadius="48px"
        maxW="95px"
        px="12px"
        py="5px"
        variant={isClaimable ? 'cyan' : 'blue'}
        isLoading={
          isClaimingUserQuest || isSubmittingQuest || isFetchingFeatureQuests || isSubmittingDaily
        }
        disabled={getButtonState()}
        onClick={() => {
          if (!isClaimable) {
            doQuest(quest)
          } else {
            claimQuest(questId)
          }
        }}
      >
        {isClaimable ? 'Claim' : 'Start'}
      </Button>
    </Flex>
  )
}

export default Footer
