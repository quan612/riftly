// UI
import { Heading } from '@chakra-ui/react'

interface IBlockTitle {
  title: string
}

const BlockTitle = ({ title }: IBlockTitle) => (
  <Heading color="white" fontWeight="600" size="md">
    {title}
  </Heading>
)

export default BlockTitle
