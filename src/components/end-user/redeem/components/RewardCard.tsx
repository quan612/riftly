// Modules
import { useCallback } from 'react'
import { ItemType, ContractType } from '@prisma/client'

// Components
import { HeadingLg, HeadingSm, TextSm } from '@components/shared/Typography'
import { RiftlyIcon } from '@components/shared/Icons'

// Hooks
import {
  useERC1155RedeemMutation,
  useOffChainShopItemRedeemMutation,
  useOnChainShopItemRedeemMutation,
} from '@hooks/user/shop'

// Types
import { ShopItem } from 'models/shop-item'

// UI
import { Box, Flex, Link, Button, Image, useToast } from '@chakra-ui/react'

interface IRewardCard {
  image: string
  item: ShopItem
}

const RewardCard = ({ image, item }: IRewardCard) => {
  const toast = useToast()
  const { title, description, cost, redeemAvailable } = item

  const [offchainRedeemData, isRedeemingOffchain, offChainRedeemAsync] =
    useOffChainShopItemRedeemMutation()
  const [onchainRedeemData, isRedeemingOnchain, onChainRedeemAsync] =
    useOnChainShopItemRedeemMutation()

  const [erc1155RedeemData, isRedeemingERC1155, erc1155RedeemAsync] = useERC1155RedeemMutation()

  const handleRedeem = useCallback(async () => {
    const { itemType, id, title, contractType } = item

    let res

    try {
      switch (itemType) {
        case ItemType.OFFCHAIN:
          res = await offChainRedeemAsync({ id })
          break
        case ItemType.ONCHAIN:
          if (contractType === ContractType.ERC1155) {
            res = await erc1155RedeemAsync({ id })
          } else {
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
              <Box color="white" p={3} bg="green.300" borderRadius="16px">
                <HeadingLg color="green.600">Successful</HeadingLg>
                <Link
                  // href={`${CURRENT_NETWORK.explorer}/tx/${res?.message}`}
                  href={`${res?.message}`}
                  target="_blank"
                  color="black"
                  fontSize="lg"
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
  }, [item])

  const isLoading = isRedeemingOffchain || isRedeemingOnchain || isRedeemingERC1155

  return (
    <Box
      bg="brand.neutral4"
      borderRadius="16px"
      className="redeem-card"
      display="flex"
      h="259px"
      minW="200px"
      w="100%"
    >
      <Flex direction="column" h="100%" w="100%">
        <Box position="relative" h="96px" minH="96px">
          <Image boxSize="100%" src={image} borderTopRadius="16px" fit="cover" />
        </Box>
        <Flex flexDirection="column" justify="space-between" py="3" px="3" w="100%" flex="1">
          <Flex justify="space-between">
            {/* BODY */}
            <Flex className="shop-item-body" direction="column" gap="5px" noOfLines={2}>
              <HeadingSm color="white" fontWeight="bold">
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
          <Flex align="start" alignItems="center" justify="space-between" mt="12px">
            <Flex alignItems="center" gap="5px">
              <Box maxH="24px" h="33%" position="relative" boxSize="16px">
                <RiftlyIcon />
              </Box>
              <HeadingLg fontWeight="700" color="white">
                {cost}
              </HeadingLg>
            </Flex>

            <Button
              disabled={isLoading}
              isLoading={isLoading}
              onClick={handleRedeem}
              variant="blue"
            >
              Redeem
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}

export default RewardCard
