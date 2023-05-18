// UI
import { Button } from '@chakra-ui/react'

interface IConnectionButton {
  disabled?: boolean
  onClick: () => void
  title: string
}

const ConnectionButton = (props: IConnectionButton) => {
  const { disabled = false, onClick, title } = props

  return (
    <Button onClick={onClick} variant="outline" w="100%" disabled={disabled}>
      {title}
    </Button>
  )
}

export default ConnectionButton
