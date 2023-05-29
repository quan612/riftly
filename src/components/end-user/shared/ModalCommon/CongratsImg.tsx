// UI
import { Heading, Image } from '@chakra-ui/react'

// Components
import { ChakraBox } from '@theme/additions/framer/FramerChakraComponent'

const CongratsImg = () => (
  <>
    <Image src="/img/user/riftly-success.gif" boxSize={{ sm: '40px', md: '60px', lg: '80px' }} />
    <ChakraBox w="100%" layout key="code-quest-heading" textAlign="center">
      <Heading color="white" fontSize="xl" w="100%">
        Congrats!
      </Heading>
    </ChakraBox>
  </>
)

export default CongratsImg
