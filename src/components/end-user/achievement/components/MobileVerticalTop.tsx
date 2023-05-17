// UI
import { Box, useTheme } from '@chakra-ui/react'

// Utils
import { getColor } from '@components/end-user/achievement/helpers'

// Types
import { IDesktopVerticalLine } from './DesktopVerticalLine'

// Constants
import { achievementsArray } from '../constants'

interface IMobileVerticalTop extends Omit<IDesktopVerticalLine, 'achievementsArray'> {}

const MobileVerticalTop = ({ index, achievement }: IMobileVerticalTop) => {
  const theme = useTheme()
const bgColor = getColor(theme, achievement)
  return (
  <Box
    alignItems="center"
    className="mobile-middle-vertical-line-top"
    display="flex"
    justifyContent="center"
    position="relative"
    w="100%"
    zIndex="-1"
  >
    <Box
      bg={index === achievementsArray.length - 1 ? 'brand.neutral3' : bgColor}
      h="160px"
      position="absolute"
      w="1px"
    />
  </Box>
)}

export default MobileVerticalTop
