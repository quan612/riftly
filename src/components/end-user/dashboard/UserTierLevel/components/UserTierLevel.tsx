// Modules
import { MutableRefObject } from 'react'

// Components
import { ChakraBox } from '@theme/additions/framer/FramerChakraComponent'
import { TextMd } from '@components/shared/Typography'
import UserTierAvatar from './UserTierAvatar'
import LevelUpModal from './LevelUpModal'
import GradientCircle from './GradientCircle'
import { RiftlyIcon } from '@components/shared/Icons'

// UI
import { Heading, Box, Flex, Text, useTheme } from '@chakra-ui/react'

// Types
import { TierType, UserRewards } from '../types'

interface IUserTierLevel {
  avatar: string
  isOpenModal: boolean
  levelProgress: MutableRefObject<number>
  onCloseModal: () => void
  shouldAnimateInitialRender: boolean
  tier: TierType
  userName: string
  userRewards: UserRewards[]
}

const UserTierLevel = (props: IUserTierLevel) => {
  const {
    avatar,
    isOpenModal,
    levelProgress,
    onCloseModal,
    shouldAnimateInitialRender,
    tier,
    userName,
    userRewards,
  } = props

  const theme = useTheme()

  return (
    <Box
      bg="brand.neutral4"
      border="1px solid"
      borderColor="brand.neutral3"
      borderRadius="16px"
      display="flex"
      h="100%"
      minH="128px"
      minW="100%"
      position="relative"
    >
      <Box display="flex" alignItems="center" minH="100%" flex="1" zIndex={2}>
        <UserTierAvatar avatar={avatar} />

        <Box
          alignItems="center"
          display="flex"
          flex="1"
          h="100%"
          justifyContent="center"
          maxW="100%"
        >
          <Flex className="user-quest-wrapper" h="70%" display="flex" flex="1" px="2px" maxW="100%">
            <Box
              display="flex"
              h="100%"
              flexDirection="column"
              flex="1"
              pe={{ base: '12px', lg: '24px' }}
              justifyContent="space-evenly"
              maxW="100%"
            >
              <Flex flex="1" alignItems="center" className="progress-info" maxW="100%">
                <Flex
                  display="flex"
                  flex="1"
                  flexDirection="column"
                  h="100%"
                  justifyContent="center"
                  maxW="100%"
                  pr={{ lg: '1rem' }}
                >
                  <Text
                    color={theme.colors.white}
                    fontSize={{ base: 'md', lg: 'xl' }}
                    fontWeight="700"
                    maxW={{ base: '40vw', md: 'none' }}
                    noOfLines={1}
                  >
                    {userName}
                    {/* momoyanglonghere@gmail.com */}
                  </Text>
                  <Box display="flex" flexDirection="row" gap="8px" alignItems="center" h="auto">
                    <Box maxH="24px" h="33%" position="relative" boxSize="14px">
                      <RiftlyIcon fill={theme.colors.brand.blue} />
                    </Box>

                    <TextMd as="span" color="whiteAlpha.700" opacity="0.64">
                      {userRewards?.length > 0 && userRewards[0].quantity + ' '}
                      Reward Points
                    </TextMd>
                  </Box>
                </Flex>

                <Box w="48px" className="circle-level">
                  <Flex
                    alignItems="center"
                    flex="1"
                    h="100%"
                    justifyContent="center"
                    position="relative"
                    w="100%"
                  >
                    <GradientCircle />
                    <Heading fontWeight="700" size="lg" color={theme.colors.white}>
                      {tier && tier.currentLevel}
                      {/* 5 */}
                    </Heading>
                  </Flex>
                </Box>
              </Flex>
              <Flex flex="1" maxH="16px" className="progress-bar">
                <Box
                  bg="brand.neutral5"
                  borderRadius="16px"
                  overflow="hidden"
                  pos="relative"
                  w="100%"
                >
                  <ChakraBox
                    initial={{
                      width: shouldAnimateInitialRender ? 0 : `${levelProgress?.current}%`,
                    }}
                    animate={{
                      width: `${levelProgress?.current}%`,
                    }}
                    // @ts-ignore
                    transition={{
                      type: 'spring',
                      stiffness: 67,
                      damping: 15,
                      restDelta: 0.001,
                      mass: 0.75,
                    }}
                    bg="brand.blue"
                    borderRadius="16px"
                    position="absolute"
                    top="0"
                    h="100%"
                  />
                  <Text position="absolute" fontSize="xs" color="whiteAlpha.500" top="0" left="4px">
                    TIER {tier && tier.currentLevel}
                  </Text>
                  <Text
                    color="whiteAlpha.500"
                    fontSize="xs"
                    position="absolute"
                    right="4px"
                    top="0"
                  >
                    TIER {tier && tier.nextLevel}
                  </Text>
                </Box>
              </Flex>
            </Box>
          </Flex>
        </Box>
      </Box>

      <LevelUpModal tier={tier} isOpen={isOpenModal} onClose={onCloseModal} />
    </Box>
  )
}

export default UserTierLevel
