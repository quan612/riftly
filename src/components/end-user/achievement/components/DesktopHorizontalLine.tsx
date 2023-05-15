// UI
import { Box } from '@chakra-ui/react'

interface IDesktopHorizontalLine {
  bg: string
}

const DesktopHorizontalLine = ({ bg }: IDesktopHorizontalLine) => (
  <Box
    alignItems="center"
    className="horizontal-line"
    display="flex"
    justifyContent="center"
    left="3rem"
    position="absolute"
    w="100%"
    zIndex={-1}
  >
    <Box w="100%" height="1px" bg={bg} />
  </Box>
)

export default DesktopHorizontalLine
