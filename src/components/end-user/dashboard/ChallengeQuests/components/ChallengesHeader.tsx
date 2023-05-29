// Modules
import { useCallback } from 'react'

// Components
import { BlockTitle } from '@components/end-user/shared'

// UI
import { Box, Flex, Text } from '@chakra-ui/react'
import { ChakraBox } from '@theme/additions/framer/FramerChakraComponent'

interface IChallengesHeader {
  filterCompleted: boolean
  filterCompletedSet: (filterCompleted: boolean) => void
}

const ChallengesHeader = ({ filterCompleted, filterCompletedSet }: IChallengesHeader) => {
  const onClickFilter = useCallback(() => filterCompletedSet(!filterCompleted), [filterCompleted])

  return (
    <Box display="flex" justifyContent="space-between">
      <BlockTitle title="Challenges" />
      <Flex align="end">
        <Box
          bg="brand.neutral4"
          border="1px solid"
          borderRadius="48px"
          display="flex"
          flexDirection="row"
          h="32px"
          p="3px"
          w="200px"
        >
          <Flex
            alignItems="center"
            justifyContent={filterCompleted ? 'flex-end' : 'flex-start'}
            onClick={onClickFilter}
            position="relative"
            w="100%"
          >
            <>
              <ChakraBox
                bg="brand.neutral3"
                borderRadius="48px"
                h="100%"
                layoutId="challenges-filter"
                w="50%"
              />
              <Box
                alignItems="center"
                display="flex"
                h="100%"
                left="0"
                position="absolute"
                top="0"
                w="50%"
                _hover={{
                  cursor: 'pointer',
                }}
                key="new"
              >
                <Text
                  align="center"
                  color={!filterCompleted ? 'white' : 'whiteAlpha.500'}
                  fontSize="xs"
                  transitionDuration="1s"
                  w="100%"
                >
                  New
                </Text>
              </Box>
              <Box
                alignItems="center"
                display="flex"
                h="100%"
                position="absolute"
                right="0"
                top="0"
                w="50%"
                _hover={{
                  cursor: 'pointer',
                }}
                key="completed"
              >
                <Text
                  align="center"
                  color={filterCompleted ? 'white' : 'whiteAlpha.500'}
                  fontSize="xs"
                  transitionDuration="1s"
                  w="100%"
                >
                  Completed
                </Text>
              </Box>
            </>
            {/* </AnimateSharedLayout> */}
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}

export default ChallengesHeader
