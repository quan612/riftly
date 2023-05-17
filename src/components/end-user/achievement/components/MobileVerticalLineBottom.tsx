// UI
import { Box, useTheme } from '@chakra-ui/react'

// Utils
import { getColor } from '@components/end-user/achievement/helpers'

// Types
import { IDesktopVerticalLine } from './DesktopVerticalLine'

interface IMobileVerticalLineBottom extends IDesktopVerticalLine {}

const MobileVerticalLineBottom = (props: IMobileVerticalLineBottom) => {
  const { index, achievementsArray, achievement } = props
const theme = useTheme()
const bgColor = getColor(theme, achievement)
  return (
    <Box
      className="middle-vertical-line-below-circle"
      display="flex"
      justifyContent="center"
      position="absolute"
      zIndex="-1"
    >
      <Box
        bg={index === achievementsArray.length - 1 ?  'brand.neutral3' : bgColor} //getColor(achievement)
        h="120px"
        position="absolute"
        w="1px"
      />
    </Box>
  )
}

export default MobileVerticalLineBottom
