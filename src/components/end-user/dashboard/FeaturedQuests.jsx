import React, { useEffect, useState, useCallback, useContext } from 'react'
import { Heading, Box, Flex, Button, Image, useToast } from '@chakra-ui/react'
import { HeadingLg, HeadingSm, TextSm } from '@components/shared/Typography'
import { ChakraBox } from '@theme/additions/framer/FramerChakraComponent'
import { AnimatePresence } from 'framer-motion'
import { RiftlyIcon } from '@components/shared/Icons'
import { useUserFeatureQuestQuery, useUserQuestClaim } from '@hooks/user/quest'
import { useQueryClient } from 'react-query'
import { UserQuestContext } from '@context/UserQuestContext'

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
        <Box position="relative" h="37%" minH={'37%'} maxH="37%!important">
          <Image
            boxSize={'100px'}
            src={quest?.image}
            w={{ base: '100%', '3xl': '100%' }}
            borderTopRadius="16px"
            fit={'fill'}
          />
        </Box>
        <Flex flexDirection="column" justify="space-between" h="63%" py="4" px="4">
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
        <HeadingSm color={'white'} fontWeight="bold">
          {text}
        </HeadingSm>

        <TextSm color="whiteAlpha.700" opacity="0.64" fontWeight="400">
          {description}
        </TextSm>
      </Flex>
    </Flex>
  )
}

const Footer = ({ quest }) => {
  const { isClaimable, questId, quantity } = quest

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

  const claimQuest = useCallback(async (questId) => {
    disableBtnSet(true)
    try {
      let res = await onUserQuestClaim({ questId })
      if (res.isError) {
        throw res.message
      }

      invalidCacheTimeout = setTimeout(() => {
        queryClient.invalidateQueries('user-reward-query')
        queryClient.invalidateQueries('user-query-user-quest')
        queryClient.invalidateQueries('user-query-feature-quest')
        disableBtnSet(false)
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
    <Flex align="start" alignItems={'center'} justify="space-between" mt="25px">
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
        isLoading={isClaimingUserQuest || isSubmittingQuest}
        disabled={disableBtn}
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
