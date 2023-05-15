// UI
import { Box } from '@chakra-ui/react'

// Utils
import { getColor } from '@components/end-user/achievement/helpers'

// Types
import { IDesktopVerticalLine } from './DesktopVerticalLine'

// Constants
import { achievementsArray } from '../constants'

interface IMobileVerticalTop extends Omit<IDesktopVerticalLine, 'achievementsArray'> {}

const MobileVerticalTop = ({ index, achievement }: IMobileVerticalTop) => (
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
      bg={index === achievementsArray.length - 1 ? 'brand.neutral3' : getColor(achievement)}
      h="160px"
      position="absolute"
      w="1px"
    />
  </Box>
)

export default MobileVerticalTop
