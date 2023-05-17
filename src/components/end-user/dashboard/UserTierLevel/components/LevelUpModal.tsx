// Components
import { ChakraBox } from '@theme/additions/framer/FramerChakraComponent'
import AnimatedGradientCircle from './AnimatedGradientCircle'

// UI
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useTheme,
} from '@chakra-ui/react'

// Types
import { TierType } from '../types'

interface ILevelUpModal {
  isOpen: boolean
  onClose: () => void
  tier: TierType
}

const LevelUpModal = ({ isOpen, onClose, tier }: ILevelUpModal) => {
  const theme = useTheme()

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        bg="brand.neutral3"
        borderRadius="24px"
        h="35%"
        maxH="429px"
        maxW="container.sm"
        me={{ base: '24px', xl: '0px' }}
        ms={{ base: '24px', xl: '0px' }}
        mt="16%"
        transition="1.25s"
        w={{ base: '100%', lg: '33%' }}
      >
        <ModalBody display="flex" alignItems="center" justifyContent="center" w="100%">
          <Flex
            alignItems="center"
            direction="column"
            gap="16px"
            h="100%"
            justifyContent="center"
            position="relative"
            w="80%"
          >
            <Box
              alignItems="center"
              display="flex"
              h="65%"
              justifyContent="center"
              left="0"
              position="absolute"
              top="0"
              w="100%"
              zIndex={3}
            >
              <Image src="/img/user/Level Up_Confetti.gif" w="70%" fit="fill" />
            </Box>
            <ChakraBox
              alignItems="center"
              display="flex"
              justifyContent="center"
              minH="84px"
              position="relative"
              w="100%"
            >
              <Flex
                alignItems="center"
                flex="1"
                height="100%"
                justifyContent="center"
                position="relative"
              >
                <AnimatedGradientCircle />
                <Text
                  color="white"
                  fontSize="2.25rem"
                  fontWeight="700"
                  textShadow={`0px 0px 15px ${theme.colors.white}`}
                  zIndex="2"
                >
                  {tier && tier.currentLevel}
                </Text>
              </Flex>
            </ChakraBox>

            <Heading color="white" fontSize="2xl">
              You leveled up 🎉
            </Heading>
            <Text color="brand.neutral0" align="center">
              Congrats! You are now at{' '}
              <Text as="span" color="brand.cyan">
                Tier {tier && tier.currentLevel}
              </Text>
              . Continue your adventure and earn more rewards!
            </Text>
            <Button variant="blue" mr={3} onClick={onClose} minW="75%" borderRadius="24px">
              Back to Challenges
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default LevelUpModal
