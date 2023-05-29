// Components
import { ChakraBox } from '@theme/additions/framer/FramerChakraComponent'

interface IErrorMessage {
  error: string | null
}

const ErrorMessage = ({ error }: IErrorMessage) => (
  <ChakraBox layout color="red.300" key="code-quest-error" exit={{ opacity: 0 }}>
    {error}
  </ChakraBox>
)

export default ErrorMessage
