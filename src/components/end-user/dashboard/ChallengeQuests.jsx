import React, { useEffect, useState, useCallback, useRef, useContext } from 'react'

import { Heading, Box, Flex, Text, Button, useToast } from '@chakra-ui/react'
import { ChakraBox } from '@theme/additions/framer/FramerChakraComponent'

import { AnimatePresence } from 'framer-motion'
import { useQueryClient } from 'react-query'

import { HeadingLg, HeadingSm, TextSm } from '@components/shared/Typography'

import { RiftlyIcon } from '@components/shared/Icons'
import Loading from '@components/shared/LoadingContainer/Loading'

import { useUserQuestClaim, useUserQuestQuery } from '@hooks/user/quest'
import { UserQuestContext } from '@context/UserQuestContext'

const ChallengeQuests = () => {
  const [filterCompleted, filterCompletedSet] = useState(false)
  const trackFirstRender = useRef(true)

  const { data: userQuests, isLoading: isFetchingUserQuests } = useUserQuestQuery()

  return (
    <Box display="flex" flexDirection={'column'} gap={'16px'} position={'relative'} minH="auto">
      {isFetchingUserQuests && <Loading />}
      <ChallengesHeader filterCompleted={filterCompleted} filterCompletedSet={filterCompletedSet} />

      <Box h="auto" display={'flex'} flexDirection={'column'} gap={'16px'}>
        {userQuests &&
          userQuests.length > 0 &&
          userQuests
            ?.filter((q) => {
              if (filterCompleted) {
                return q.hasClaimed === true
              } else {
                return q.hasClaimed === false
              }
            })
            .map((quest, index) => {
              return (
                <Box
                  key={quest.id}
                  h={{ base: '112px', md: '96px' }}
                  maxH={{ base: '112px', md: '96px' }}
                  w="100%"
                  bg="brand.neutral4"
                  border="1px solid"
                  borderColor="brand.neutral3"
                  borderRadius={'16px'}
                >
                  <Box display="flex" flexDirection={'row'} w="100%">
                    <UserQuestBox quest={quest} filterCompleted={filterCompleted} key={index} />
                  </Box>
                </Box>
              )
            })}
      </Box>
    </Box>
  )
}

export default ChallengeQuests

const ChallengesHeader = ({ filterCompleted, filterCompletedSet }) => {
  return (
    <Box display={'flex'} justifyContent="space-between">
      <Heading color="white" fontWeight="600" size="md">
        Challenges
      </Heading>
      <Box display={'flex'} align="end">
        <Box
          display={'flex'}
          flexDirection="row"
          border={'1px solid'}
          bg="brand.neutral4"
          p="3px"
          w="200px"
          h="32px"
          borderRadius="48px"
        >
          <Flex
            w="100%"
            justifyContent={filterCompleted ? 'flex-end' : 'flex-start'}
            onClick={() => filterCompletedSet(!filterCompleted)}
            alignItems="center"
            position="relative"
          >
            <>
              <ChakraBox
                layoutId="challenges-filter"
                w="50%"
                h="100%"
                bg="brand.neutral3"
                borderRadius="48px"
              />
              <Box
                h="100%"
                w="50%"
                position={'absolute'}
                top="0"
                left="0"
                alignItems={'center'}
                display="flex"
                _hover={{
                  cursor: 'pointer',
                }}
                key="new"
              >
                <Text
                  transitionDuration="1s"
                  color={!filterCompleted ? 'white' : 'whiteAlpha.500'}
                  w="100%"
                  align={'center'}
                  fontSize="xs"
                >
                  New
                </Text>
              </Box>
              <Box
                h="100%"
                w="50%"
                position={'absolute'}
                top="0"
                right="0"
                alignItems={'center'}
                display="flex"
                _hover={{
                  cursor: 'pointer',
                }}
                key="completed"
              >
                <Text
                  transitionDuration="1s"
                  color={filterCompleted ? 'white' : 'whiteAlpha.500'}
                  w="100%"
                  align={'center'}
                  fontSize="xs"
                >
                  Completed
                </Text>
              </Box>
            </>
            {/* </AnimateSharedLayout> */}
          </Flex>
        </Box>
      </Box>
    </Box>
  )
}

const UserQuestBox = ({ quest, filterCompleted }) => {
  const { isSubmittingQuest, doQuest } = useContext(UserQuestContext)

  const [, isClaimingUserQuest, onUserQuestClaim] = useUserQuestClaim()
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
    try {
      let res = await onUserQuestClaim({ questId })
      if (res.isError) {
        throw res.message
      }
      showScoreSet(true)
      scorePopupTimeout = setTimeout(() => {
        showScoreSet(false)
        clearTimeout(scorePopupTimeout)
      }, 750)

      invalidCacheTimeout = setTimeout(() => {
        queryClient.invalidateQueries('user-reward-query')
        queryClient.invalidateQueries('user-query-user-quest')
        disableBtnSet(false)
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
  })

  return (
    <>
      <Box
        className="reward-quantity-per-quest"
        w="96px"
        h={{ base: '112px', md: '96px' }}
        borderRight={'1px solid'}
        borderRightColor={'brand.neutral3'}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          h="60%"
          display="flex"
          flexDirection={'column'}
          justifyContent="space-evenly"
          alignItems={'center'}
        >
          <Box maxH="36px" h="33%" position={'relative'} boxSize="20px">
            <RiftlyIcon fill={filterCompleted ? '#132436' : '#1D63FF'} />
          </Box>
          <HeadingLg color={filterCompleted ? 'whiteAlpha.400' : '#fff'}>
            {quest.quantity}
          </HeadingLg>
        </Box>
      </Box>

      <Box display="flex" flex="1">
        <Box
          className="user-quest-claim"
          h="100%"
          display="flex"
          flexDirection={'row'}
          flex="1"
          px={{ base: '12px', md: '16px' }}
          alignItems="center"
        >
          <Box h="60%" display={'flex'} flex="1">
            <Flex flexDirection="row" justifyContent={'space-between'} flex="1" alignItems="center">
              <Flex display={'flex'} flexDirection="column" flex="80%" me="2px">
                {!filterCompleted && (
                  <>
                    <HeadingSm color="#fff" noOfLines={2}>
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
                position="relative"
                h="100%"
                alignItems={'center'}
                // flex="20%"
              >
                {filterCompleted && (
                  <Text
                    color="brand.neutral0"
                    opacity={0.4}
                    fontWeight="600"
                    fontSize={{ base: 'sm', md: 'md' }}
                  >
                    Completed
                  </Text>
                )}
                {!filterCompleted && (
                  <AnimatePresence>
                    {showScore && (
                      <ChakraBox
                        key={quest.id}
                        position={'absolute'}
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
                          size="xl"
                          color="brand.cyan"
                          fontWeight={'700'}
                          textAlign="center"
                        >
                          +{quest.quantity}
                        </Text>
                      </ChakraBox>
                    )}
                    <Button
                      variant={quest.isClaimable ? 'cyan' : 'blue'}
                      transitionDuration={'0.5s'}
                      onClick={() => {
                        if (!quest.isClaimable) {
                          doQuest(quest)
                        } else {
                          const { questId } = quest
                          onClaimQuest(questId)
                        }
                      }}
                      isLoading={isSubmittingQuest || isClaimingUserQuest}
                      disabled={disableBtn}
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
