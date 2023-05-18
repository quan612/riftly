// Modules
import { Session } from 'next-auth'

// Components
import { RiftlyIcon } from '@components/shared/Icons'
import { ChakraBox } from '@theme/additions/framer/FramerChakraComponent'

// Hooks
import { useUserRewardQuery } from '@hooks/user/reward'

// UI
import { Heading, Box, Flex, useTheme } from '@chakra-ui/react'

interface IBalanceInfo {
  session: Session
}

const BalanceInfo = ({ session }: IBalanceInfo) => {
  const [userRewards, userRewardLoading] = useUserRewardQuery(session)

  const theme = useTheme()

  console.log(theme?.colors)

  return (
    <ChakraBox
      animate={{ opacity: 1, zIndex: 1 }}
      display="flex"
      exit={{ opacity: 0, zIndex: 0 }}
      h="100%"
      initial={{ opacity: 0 }}
      justifyContent="center"
      minH="128px"
      minW="100%"
      position="absolute"
    >
      <Box
        alignItems="center"
        bg="brand.blue"
        borderRadius="16px"
        display="flex"
        minH="100%"
        w="50%"
      >
        <Box
          alignItems="center"
          display="flex"
          flex="1"
          flexDirection="column"
          h="80%"
          justifyContent="space-evenly"
          maxH="80%"
        >
          <Heading size="sm" color={theme.colors.white}>
            Available Balance
          </Heading>
          <Flex gap="16px" alignItems="center">
            <Box maxH="24px" h="33%" position="relative" boxSize="24px">
              <RiftlyIcon fill={theme.colors.white} />
            </Box>
            <Heading size="lg" color={theme.colors.white}>
              {userRewards?.length > 0 && userRewards[0].quantity + ' '}
            </Heading>
          </Flex>
        </Box>
      </Box>
    </ChakraBox>
  )
}

export default BalanceInfo
