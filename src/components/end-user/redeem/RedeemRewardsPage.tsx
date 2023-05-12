import React, { useState, useCallback } from 'react'
import {
  Heading,
  Box,
  Flex,
  Link,
  Button,
  Image,
  useToast,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'

import { HeadingLg, HeadingSm, TextSm } from '@components/shared/Typography'
import { ChakraBox } from '@theme/additions/framer/FramerChakraComponent'
import useDeviceDetect from '@hooks/useDeviceDetect'

import { AnimatePresence } from 'framer-motion'
import { RiftlyIcon } from '@components/shared/Icons'

import { useUserRewardQuery } from '@hooks/user/reward'
import {
  useERC1155RedeemMutation,
  useOffChainShopItemRedeemMutation,
  useOnChainShopItemRedeemMutation,
  useShopItemQuery,
} from '@hooks/user/shop'
import Loading from '@components/shared/LoadingContainer/Loading'

import { ItemType, ContractType } from '@prisma/client'
import { CURRENT_NETWORK } from 'const/GlobalData'

const RedeemRewardsPage = ({ session }) => {
  const { isMobile } = useDeviceDetect()
  const { data: shopItems, isLoading: isFetchingShopItems } = useShopItemQuery()

  return (
    <>
      {isFetchingShopItems && <Loading />}
      <ChakraBox
        position={'relative'}
        h={'128px'}
        maxH="128px"
        key="balance-info"
        exit={{ opacity: 0, transition: { duration: 0.65 } }}
      >
        <BalanceInfo session={session} />
      </ChakraBox>
      <AnimatePresence>
        {shopItems?.length > 0 && (
          <ChakraBox
            display="flex"
            flexDirection={'column'}
            exit={{ opacity: 0, transition: { duration: 0.65 } }}
            gap={'16px'}
          >
            <Heading color="white" fontWeight="600" size="md">
              Redeem Rewards
            </Heading>

            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} w="auto" gap="16px">
              {shopItems.map((item, index) => {
                return (
                  <Flex
                    key={index}
                    w="100%"
                    justifyContent="center"
                    className="redeem-card-wrapper"
                  >
                    <RewardCard image={item.image || '/img/user/feature-1.png'} item={item} />
                  </Flex>
                )
              })}
            </SimpleGrid>
          </ChakraBox>
        )}
      </AnimatePresence>
    </>
  )
}

export default RedeemRewardsPage

const BalanceInfo = ({ session }) => {
  const [userRewards, userRewardLoading] = useUserRewardQuery(session)
  return (
    <ChakraBox
      minW="100%"
      minH="128px"
      h="100%"
      position={'absolute'}
      display="flex"
      justifyContent={'center'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, zIndex: 1 }}
      exit={{ opacity: 0, zIndex: 0 }}
    >
      <Box
        display={'flex'}
        alignItems={'center'}
        minH="100%"
        w="50%"
        bg={'brand.blue'}
        borderRadius="16px"
      >
        <Box
          display="flex"
          flex="1"
          h="80%"
          maxH={'80%'}
          alignItems="center"
          justifyContent={'space-evenly'}
          flexDirection="column"
        >
          <Heading size="sm" color="#fff">
            Available Balance
          </Heading>
          <Flex gap="16px" alignItems="center">
            <Box maxH="24px" h="33%" position={'relative'} boxSize="24px">
              <RiftlyIcon fill={'#fff'} />
            </Box>
            <Heading size="lg" color="#fff">
              {userRewards?.length > 0 && userRewards[0].quantity + ' '}
            </Heading>
          </Flex>
        </Box>
      </Box>
    </ChakraBox>
  )
}

const RewardCard = ({ image, item }) => {
  const toast = useToast()
  const { title, description, cost, redeemAvailable } = item

  const [offchainRedeemData, isRedeemingOffchain, offChainRedeemAsync] =
    useOffChainShopItemRedeemMutation()
  const [onchainRedeemData, isRedeemingOnchain, onChainRedeemAsync] =
    useOnChainShopItemRedeemMutation()

    const [erc1155RedeemData, isRedeemingERC1155, erc1155RedeemAsync] =
    useERC1155RedeemMutation()
    

  const handleRedeem = useCallback(async (item) => {
    const { itemType, contract, id, title, contractType, description } = item

    let res;

    try {
      switch (itemType) {
        case ItemType.OFFCHAIN:
          res = await offChainRedeemAsync({ id })
          break
        case ItemType.ONCHAIN:
          if(contractType === ContractType.ERC1155){
            res = await erc1155RedeemAsync({ id })
          }else {
            res = await onChainRedeemAsync({ id })
          }
         
          break
        default:
          throw new Error(`Invalid item type`)
      }

      if (res.isError) {
        toast({
          title: 'Exception',
          description: `${res.message}`,
          position: 'top-right',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      } else {
        if (itemType === ItemType.OFFCHAIN) {
          toast({
            title: 'Successful',
            description: `Item ${title} has been redeemed`,
            position: 'top-right',
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
        } else {
          toast({
            title: 'Success',
            position: 'top-right',
            status: 'success',
            duration: 6000,
            isClosable: false,
            render: () => (
              <Box color="white" p={3} bg="green.300" borderRadius={'16px'}>
                <HeadingLg color="green.600">Successful</HeadingLg>
                <Link
                  // href={`${CURRENT_NETWORK.explorer}/tx/${res?.message}`}
                  href={`${res?.message}`}
                  target="_blank"
                  color="black"
                  fontSize={'lg'}
                >
                  Transaction sent. Check here.
                </Link>
              </Box>
            ),
          })
        }
      }
    } catch (error) {
      toast({
        title: 'Exception',
        description: `${error.message}`,
        position: 'top-right',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }, [])

  return (
    <Box
      bg={'brand.neutral4'}
      borderRadius="16px"
      h="259px"
      w="100%"
      minW="200px"
      className="redeem-card"
      display={'flex'}
    >
      <Flex direction="column" h="100%" w="100%">
        <Box position="relative" h="96px" minH="96px">
          <Image boxSize={'100%'} src={image} borderTopRadius="16px" fit={'cover'} />
        </Box>
        <Flex flexDirection="column" justify="space-between" py="3" px="3" w="100%" flex="1">
          <Flex justify="space-between">
            {/* BODY */}
            <Flex className="shop-item-body" direction="column" gap="5px" noOfLines={2}>
              <HeadingSm color={'white'} fontWeight="bold">
                {title}
              </HeadingSm>

              <TextSm color="whiteAlpha.700" opacity="0.64" fontWeight="400" noOfLines={2}>
                 {description} 
              </TextSm>
              <TextSm color="white" noOfLines={2} fontStyle="italic">
                {/* {description} */}
                Available: {redeemAvailable}
              </TextSm>
            </Flex>
          </Flex>
          {/* FOOTER */}
          <Flex align="start" alignItems={'center'} justify="space-between" mt="12px">
            <Flex alignItems={'center'} gap="5px">
              <Box maxH="24px" h="33%" position={'relative'} boxSize="16px">
                <RiftlyIcon fill={'#1D63FF'} />
              </Box>
              <HeadingLg fontWeight="700" color={'white'}>
                {cost}
              </HeadingLg>
            </Flex>

            <Button
              variant="blue"
              onClick={() => handleRedeem(item)}
              isLoading={isRedeemingOffchain || isRedeemingOnchain}
              disabled={isRedeemingOffchain || isRedeemingOnchain}
            >
              Redeem
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}
