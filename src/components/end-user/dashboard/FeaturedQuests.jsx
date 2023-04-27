import React, { useEffect, useState, useCallback, useContext } from 'react'
import { Heading, Box, Flex, Button, useToast } from '@chakra-ui/react'
import { HeadingLg, HeadingSm, TextSm } from '@components/shared/Typography'
import { ChakraBox } from '@theme/additions/framer/FramerChakraComponent'
import { AnimatePresence } from 'framer-motion'
import { RiftlyIcon } from '@components/shared/Icons'
import { useUserFeatureQuestQuery, useUserQuestClaim } from '@hooks/user/quest'
import { useQueryClient } from 'react-query'
import { UserQuestContext } from '@context/UserQuestContext'
import { QUERY_USER_REWARD } from '@hooks/user/reward'

import Image from 'next/image'
const FeatureQuests = () => {
  const { data: featureQuests, isLoading: isFetchingFeatureQuests } = useUserFeatureQuestQuery()

  return (
    <>
      <AnimatePresence>
        {featureQuests && featureQuests?.length > 0 && (
          <ChakraBox display="flex" flexDirection={'column'} exit={{ opacity: 0 }} gap={'16px'}>
            <Heading color="white" fontWeight="600" size="md">
              Featured
            </Heading>

            <Box
              display={'flex'}
              overflowX={'auto'}
              position="relative"
              gap="16px"
              overflowY={'none'}
            >
              {featureQuests.map((quest, index) => {
                return <FeatureCard key={quest.id} quest={quest} />
              })}
            </Box>
          </ChakraBox>
        )}
      </AnimatePresence>
    </>
  )
}

export default FeatureQuests

const FeatureCard = ({ quest }) => {
  const { text, description } = quest

  return (
    <Box bg={'brand.neutral4'} borderRadius="16px" h="259px" w="auto" minW="200px" maxW="33%">
      <Flex direction={{ base: 'column' }} h="100%">
        <Box position="relative" h="99px" borderTopRadius="16px">
          <Image
            src={quest?.image}
            height="99px"
            width="200px"
            borderTopRadius="16px"
            objectFit={'cover'}
            style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
          />
        </Box>
        <Flex flexDirection="column" pt="16px" px="12px" flex="1" gap="4px">
          <Body text={text} description={description} />
          <Footer quest={quest} />
        </Flex>
      </Flex>
    </Box>
  )
}

const Body = ({ text, description }) => {
  return (
    <Flex justify="space-between">
      <Flex direction="column" gap="5px">
        <HeadingSm color={'white'} fontWeight="bold" noOfLines={'2'}>
          {text}
        </HeadingSm>

        <TextSm color="whiteAlpha.700" opacity="0.64" fontWeight="400" noOfLines={'2'}>
          {description}
        </TextSm>
      </Flex>
    </Flex>
  )
}

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
      let res = await onUserQuestClaim({ questId })
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
  })
  return (
    <Flex align="start" alignItems={'center'} justify="space-between" mt="auto" pb="6px">
      <Flex alignItems={'center'} gap="5px">
        <Box maxH="24px" h="33%" position={'relative'} boxSize="16px">
          <RiftlyIcon fill={'#1D63FF'} />
        </Box>
        <HeadingLg fontWeight="700" color={'white'}>
          {quantity}
        </HeadingLg>
      </Flex>

      <Button
        maxW="95px"
        variant={isClaimable ? 'cyan' : 'blue'}
        borderRadius="48px"
        px="12px"
        py="5px"
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
