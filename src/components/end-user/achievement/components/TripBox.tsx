// Modules
import { useQueryClient } from 'react-query'

// Components
import { HeadingSm, TextSm } from '@components/shared/Typography'

// UI
import { Box, Button, Flex, useTheme, useToast } from '@chakra-ui/react'

// Hooks
import useGetColor from '../useGetColor'

// Types
import { AchievementType } from '../types'

interface ITripBox {
  id: string
  item: AchievementType
}

const TripBox = ({ id, item }: ITripBox) => {
  const toast = useToast()
  const queryClient = useQueryClient()
  const theme = useTheme()

  const { getColor } = useGetColor()

  const getClaimButton = () => {
    if (!item) return null
    const { isClaimed, isLocked } = item

    if (isClaimed) {
      return (
        <Button flex="1" size="md" variant="ghost-base" disabled>
          Claimed
        </Button>
      )
    }
    if (!isClaimed && !isLocked) {
      return (
        <Button flex="1" size="sm" variant="cyan" transitionDuration="0.5s" onClick={() => {}}>
          Claim
        </Button>
      )
    }
    if (isLocked) {
      return (
        <Button flex="1" size="md" variant="ghost-base" disabled>
          Locked
        </Button>
      )
    }
  }

  return (
    <Box
      alignItems="center"
      bg="brand.neutral4"
      border="1px solid"
      borderColor={getColor(item)}
      borderRadius="16px"
      display="flex"
      h={{ base: '112px', md: '96px' }}
      justifyContent="center"
      key={id}
      maxH={{ base: '112px', md: '96px' }}
      position="relative"
      w="100%"
    >
      <Box display="flex" flex="1" h="100%">
        <Box
          alignItems="center"
          className="user-achievement-claim"
          display="flex"
          flex="1"
          flexDirection="row"
          h="100%"
          px={{ base: '12px', md: '16px' }}
        >
          <Box h="60%" display="flex" flex="1">
            <Flex flexDirection="row" justifyContent="space-between" flex="1" alignItems="center">
              <Flex display="flex" flexDirection="column" w="80%">
                <>
                  <HeadingSm color={theme.colors.white}>{item.text}</HeadingSm>
                  <TextSm
                    fontWeight="400"
                    color="whiteAlpha.700"
                    // opacity="0.64"
                    noOfLines={2}
                  >
                    {item.description}
                  </TextSm>
                </>
              </Flex>
              <Flex
                alignItems="center"
                flex="1"
                h="100%"
                maxWidth="20%"
                minW="80px"
                position="relative"
              >
                {getClaimButton()}
              </Flex>
            </Flex>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default TripBox
