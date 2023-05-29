// Modules
import { AnimatePresence } from 'framer-motion'
import { Session } from 'next-auth'

// Components
import BalanceInfo from './components/BalanceInfo'
import RewardCard from './components/RewardCard'
import Loading from '@components/shared/LoadingContainer/Loading'
import { ChakraBox } from '@theme/additions/framer/FramerChakraComponent'
import { BlockTitle } from '@components/end-user/shared'

// Hooks
import { useShopItemQuery } from '@hooks/user/shop'

// UI
import { Flex, SimpleGrid } from '@chakra-ui/react'

interface IRedeemRewardsPage {
  session: Session
}

const RedeemRewardsPage = ({ session }: IRedeemRewardsPage) => {
  const { data: shopItems, isLoading: isFetchingShopItems } = useShopItemQuery()

  return (
    <>
      {isFetchingShopItems && <Loading />}
      <ChakraBox
        exit={{ opacity: 0, transition: { duration: 0.65 } }}
        h="128px"
        key="balance-info"
        maxH="128px"
        position="relative"
      >
        <BalanceInfo session={session} />
      </ChakraBox>
      <AnimatePresence>
        {shopItems?.length > 0 && (
          <ChakraBox
            display="flex"
            exit={{ opacity: 0, transition: { duration: 0.65 } }}
            flexDirection="column"
            gap="16px"
          >
            <BlockTitle title="Redeem Rewards" />
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} w="auto" gap="16px">
              {shopItems.map((item, index) => (
                <Flex className="redeem-card-wrapper" justifyContent="center" key={index} w="100%">
                  <RewardCard image={item.image || '/img/user/feature-1.png'} item={item} />
                </Flex>
              ))}
            </SimpleGrid>
          </ChakraBox>
        )}
      </AnimatePresence>
    </>
  )
}

export default RedeemRewardsPage
