// UI
import { Input } from '@chakra-ui/react'

interface IConnectionInput {
  value: string
}

const ConnectionInput = (props: IConnectionInput) => {
  const { value } = props

  return <Input type="text" fontSize="md" variant="riftly" ms="4px" disabled value={value} />
}

export default ConnectionInput
