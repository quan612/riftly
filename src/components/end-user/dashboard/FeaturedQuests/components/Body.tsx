// UI
import { Flex } from '@chakra-ui/react'

// Components
import { HeadingSm, TextSm } from '@components/shared/Typography'

interface IBody {
  description: string
  text: string
}

const Body = ({ text, description }: IBody) => (
  <Flex justify="space-between">
    <Flex direction="column" gap="5px">
      <HeadingSm color="white" fontWeight="bold" noOfLines="2">
        {text}
      </HeadingSm>

      <TextSm color="whiteAlpha.700" opacity="0.64" fontWeight="400" noOfLines="2">
        {description}
      </TextSm>
    </Flex>
  </Flex>
)

export default Body
