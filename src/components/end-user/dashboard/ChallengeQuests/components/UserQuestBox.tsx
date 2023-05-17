// Modules
import { useEffect, useState, useCallback, useContext } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useQueryClient } from 'react-query'

// UI
import { Box, Flex, Text, Button, useToast, useTheme } from '@chakra-ui/react'
import { ChakraBox } from '@theme/additions/framer/FramerChakraComponent'

// Components
import { HeadingLg, HeadingSm, TextSm } from '@components/shared/Typography'
import { RiftlyIcon } from '@components/shared/Icons'

// Hooks
import { QUERY_USER_QUEST, useUserQuestClaim, useUserQuestQuery } from '@hooks/user/quest'
import { QUERY_USER_REWARD } from '@hooks/user/reward'

// Store
import { UserQuestContext } from '@context/UserQuestContext'

interface IUserQuestBox {
  filterCompleted: boolean
  // TODO: add type for quest
  quest?: any
}

const UserQuestBox = ({ quest, filterCompleted }: IUserQuestBox) => {
  const { isSubmittingQuest, isSubmittingDaily, doQuest } = useContext(UserQuestContext)

  const theme = useTheme()

  const [, isClaimingUserQuest, onUserQuestClaim] = useUserQuestClaim()
  const { data: userQuests, isLoading: isFetchingUserQuests } = useUserQuestQuery()
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

  const onClaimQuest = useCallback(async (questId) => {
    disableBtnSet(true)
    try {
      const res = await onUserQuestClaim({ questId })
      if (res.isError) {
        throw res.message
      }
      showScoreSet(true)
      scorePopupTimeout = setTimeout(() => {
        showScoreSet(false)
        clearTimeout(scorePopupTimeout)
      }, 750)

      invalidCacheTimeout = setTimeout(async () => {
        await Promise.all([
          queryClient.invalidateQueries(QUERY_USER_REWARD),
          queryClient.invalidateQueries(QUERY_USER_QUEST),
        ])

        clearTimeout(invalidCacheTimeout)
      }, 2000)
    } catch (error) {
      console.log(error)
      toast({
        title: 'Exception',
        description: `Catch error at quest Id: ${questId}. Please contact admin.`,
        position: 'top-right',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }, [])

  const getButtonState = useCallback(() => {
    if (disableBtn) return true
    if (isClaimingUserQuest || isSubmittingQuest || isFetchingUserQuests || isSubmittingDaily)
      return true
    return false
  }, [disableBtn, isClaimingUserQuest, isSubmittingQuest, isFetchingUserQuests, isSubmittingDaily])

  return (
    <>
      <Box
        alignItems="center"
        borderRight="1px solid"
        borderRightColor="brand.neutral3"
        className="reward-quantity-per-quest"
        display="flex"
        h={{ base: '112px', md: '96px' }}
        justifyContent="center"
        w="96px"
      >
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          h="60%"
          justifyContent="space-evenly"
        >
          <Box maxH="36px" h="33%" position="relative" boxSize="20px">
            <RiftlyIcon
              fill={filterCompleted ? theme.colors.brand.neutral5 : theme.colors.brand.blue}
            />
          </Box>
          <HeadingLg color={filterCompleted ? 'whiteAlpha.400' : theme.colors.white}>
            {quest.quantity}
          </HeadingLg>
        </Box>
      </Box>

      <Box display="flex" flex="1">
        <Box
          alignItems="center"
          className="user-quest-claim"
          display="flex"
          flex="1"
          flexDirection="row"
          h="100%"
          px={{ base: '12px', md: '16px' }}
        >
          <Box h="60%" display="flex" flex="1">
            <Flex flexDirection="row" justifyContent="space-between" flex="1" alignItems="center">
              <Flex display="flex" flexDirection="column" flex="80%" me="2px">
                {!filterCompleted && (
                  <>
                    <HeadingSm color={theme.colors.white} noOfLines={2}>
                      {quest.text}
                    </HeadingSm>
                    <TextSm color="whiteAlpha.700" opacity={0.64} noOfLines={2}>
                      {quest.description}
                    </TextSm>
                  </>
                )}
                {filterCompleted && (
                  <>
                    <HeadingSm color="whiteAlpha.400">{quest.text}</HeadingSm>
                    <TextSm color="whiteAlpha.400" noOfLines={2}>
                      {quest.description}
                    </TextSm>
                  </>
                )}
              </Flex>
              <Flex
                alignItems="center"
                h="100%"
                position="relative"
                // flex="20%"
              >
                {filterCompleted && (
                  <Text
                    color="brand.neutral0"
                    fontSize={{ base: 'sm', md: 'md' }}
                    fontWeight="600"
                    opacity={0.4}
                  >
                    Completed
                  </Text>
                )}
                {!filterCompleted && (
                  <AnimatePresence>
                    {showScore && (
                      <ChakraBox
                        key={quest.id}
                        position="absolute"
                        top="-4"
                        left="0"
                        variants={{
                          hidden: {
                            opacity: 0,
                            y: 20,
                          },
                          visible: {
                            opacity: 1,
                            y: -5,
                            transition: {
                              duration: 1,
                              type: 'spring',
                            },
                          },
                          removed: {
                            opacity: 0,

                            transition: {
                              duration: 2.25,
                            },
                          },
                        }}
                        initial="hidden"
                        animate="visible"
                        exit="removed"
                        w="100%"
                      >
                        <Text
                          className="score"
                          color="brand.cyan"
                          fontWeight="700"
                          size="xl"
                          textAlign="center"
                        >
                          +{quest.quantity}
                        </Text>
                      </ChakraBox>
                    )}
                    <Button
                      variant={quest.isClaimable ? 'cyan' : 'blue'}
                      transitionDuration="0.5s"
                      onClick={() => {
                        if (!quest.isClaimable) {
                          doQuest(quest)
                        } else {
                          const { questId } = quest
                          onClaimQuest(questId)
                        }
                      }}
                      isLoading={isSubmittingQuest || isClaimingUserQuest || isSubmittingDaily}
                      disabled={getButtonState()}
                    >
                      {quest.isClaimable ? 'Claim' : 'Start'}
                    </Button>
                  </AnimatePresence>
                )}
              </Flex>
            </Flex>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default UserQuestBox
