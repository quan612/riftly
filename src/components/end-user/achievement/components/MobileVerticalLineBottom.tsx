// UI
import { Box } from '@chakra-ui/react'

// Hooks
import useGetColor from '../useGetColor'

// Types
import { IDesktopVerticalLine } from './DesktopVerticalLine'

interface IMobileVerticalLineBottom extends IDesktopVerticalLine {}

const MobileVerticalLineBottom = (props: IMobileVerticalLineBottom) => {
  const { index, achievementsArray, achievement } = props

  const { getColor } = useGetColor()

  return (
    <Box
      className="middle-vertical-line-below-circle"
      display="flex"
      justifyContent="center"
      position="absolute"
      zIndex="-1"
    >
      <Box
        bg={index === achievementsArray.length - 1 ? 'brand.neutral3' : getColor(achievement)}
        h="120px"
        position="absolute"
        w="1px"
      />
    </Box>
  )
}

export default MobileVerticalLineBottom
