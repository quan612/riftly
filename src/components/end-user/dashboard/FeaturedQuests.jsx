import React, { useCallback, useRef } from 'react'
import { Heading, Box, Flex, Button, Image, useToast, useDisclosure } from '@chakra-ui/react'
import { HeadingLg, HeadingSm, TextSm } from '@components/shared/Typography'
import { ChakraBox } from '@theme/additions/framer/FramerChakraComponent'
import { AnimatePresence } from 'framer-motion'
import { RiftlyIcon } from '@components/shared/Icons'
import { useUserFeatureQuestQuery, useUserQuestClaim, useUserQuestSubmit } from '@hooks/user/quest'
import { useRouter } from 'next/router'
import Enums from '@enums/index'
import { doQuestUtility } from '../shared/doQuestUtility'
import { CodeQuestModal, NftOwnerQuestModal, WalletAuthQuestModal } from '../shared'
import { useQueryClient } from 'react-query'

const FeatureQuests = () => {
  const { data: featureQuests, isLoading: isFetchingFeatureQuests } = useUserFeatureQuestQuery()
  const [submitQuestData, isSubmittingQuest, onSubmit] = useUserQuestSubmit()
  const [claimUserQuestData, isClaimingUserQuest, onClaim] = useUserQuestClaim()
  const queryClient = useQueryClient()
  let scorePopupTimeout, invalidCacheTimeout

  const codeQuestModal = useDisclosure()
  const codeQuestRef = useRef({})

  const walletAuthQuestModal = useDisclosure()

  const nftOwnQuestModal = useDisclosure()
  const nftOwnQuestRef = useRef({})

  const router = useRouter()
  const toast = useToast()
  console.log(featureQuests)

  const doQuest = useCallback(async (quest) => {
    try {
      switch (quest.type.name) {
        case Enums.CODE_QUEST:
          codeQuestRef.current = quest
          codeQuestModal.onOpen()
          break
        case Enums.WALLET_AUTH:
          walletAuthQuestModal.onOpen()
          break
        case Enums.OWNING_NFT_CLAIM:
          nftOwnQuestRef.current = quest
          nftOwnQuestModal.onOpen()
          break

        default:
          await doQuestUtility(router, quest, onSubmit)
      }
    } catch (error) {
      console.log(error)
      toast({
        title: 'Exception',
        description: `Catch error at quest: ${quest.text}. Please contact admin.`,
        position: 'top-right',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }, [])

  const claimQuest = useCallback(async (questId) => {
    // disableBtnSet(true)
    try {
      let res = await onClaim({ questId })
      if (res.isError) {
        throw res.message
      }
      // showScoreSet(true)
      // scorePopupTimeout = setTimeout(() => {
      //   showScoreSet(false)
      //   clearTimeout(scorePopupTimeout)
      // }, 500)

      invalidCacheTimeout = setTimeout(() => {
        queryClient.invalidateQueries('user-reward-query')
        queryClient.invalidateQueries('user-query-user-quest')
        // disableBtnSet(false)
        // clearTimeout(invalidCacheTimeout)
      }, 2000)
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
      // disableBtnSet(false)
    }
  })

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
                return (
                  <FeatureCard
                    key={quest.id}
                    quest={quest}
                    doQuest={doQuest}
                    claimQuest={claimQuest}
                  />
                  // <Box bg={"brand.neutral4"} borderRadius="16px" h="259px" minW="200px"></Box>
                )
              })}
            </Box>
          </ChakraBox>
        )}
      </AnimatePresence>
      {codeQuestRef?.current && (
        <CodeQuestModal
          isOpen={codeQuestModal.isOpen}
          onClose={() => {
            codeQuestRef.current = {}
            codeQuestModal.onClose()
          }}
          currentQuest={codeQuestRef.current}
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

      {nftOwnQuestRef?.current && (
        <NftOwnerQuestModal
          isOpen={nftOwnQuestModal.isOpen}
          onClose={() => {
            nftOwnQuestRef.current = {}
            nftOwnQuestModal.onClose()
          }}
          currentQuest={nftOwnQuestRef.current}
        />
      )}
    </>
  )
}

export default FeatureQuests

const FeatureCard = ({ quest, doQuest, claimQuest }) => {
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
          <Footer quest={quest} doQuest={doQuest} claimQuest={claimQuest} />
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

const Footer = ({ quest, doQuest, claimQuest }) => {
  const { isClaimable, questId, quantity } = quest
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
