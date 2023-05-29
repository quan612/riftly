// UI
import { Button } from '@chakra-ui/react'

interface IButtonSubmit {
  disabled?: boolean
  isLoading?: boolean
  onClick: () => void
  title: string
}

const ButtonSubmit = ({ disabled = false, isLoading = false, onClick, title }: IButtonSubmit) => (
  <Button
    borderRadius="24px"
    disabled={disabled}
    isLoading={isLoading}
    onClick={onClick}
    variant="blue"
    w="100%"
  >
    {title}
  </Button>
)

export default ButtonSubmit
