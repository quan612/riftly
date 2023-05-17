// Modules
import Image from 'next/image'

// Components
import Body from './Body'
import Footer from './Footer'

// UI
import { Box, Flex } from '@chakra-ui/react'

const FeatureCard = ({ quest }) => {
  const { text, description } = quest

  return (
    <Box bg={'brand.neutral4'} borderRadius="16px" h="259px" w="auto" minW="200px" maxW="33%">
      <Flex direction={{ base: 'column' }} h="100%">
        <Box position="relative" h="99px" borderTopRadius="16px">
          <Image
            height="99px"
            objectFit={'cover'}
            src={quest?.image}
            style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
            width="200px"
          />
        </Box>
        <Flex flexDirection="column" pt="16px" px="12px" flex="1" gap="4px">
          <Body text={text} description={description} />
          <Footer quest={quest} />
        </Flex>
      </Flex>
    </Box>
  )
}
export default FeatureCard
