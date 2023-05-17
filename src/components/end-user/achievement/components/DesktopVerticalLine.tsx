// UI
import { Box, useTheme } from '@chakra-ui/react'

// Utils
import { getColor } from '@components/end-user/achievement/helpers'

// Types
import { AchievementType } from '../types'

export interface IDesktopVerticalLine {
  achievement: AchievementType
  achievementsArray: AchievementType[]
  index: number
}

const DesktopVerticalLine = ({ index, achievementsArray, achievement }: IDesktopVerticalLine) => {
  const theme = useTheme();
  const bgColor = getColor(theme, achievement)
  return (
  <Box
    bg={index === achievementsArray.length - 1 ? 'brand.neutral3' : bgColor } //getColor(achievement)
    className="desktop-vertical-line"
    display="block"
    h="160px"
    left="39.5px"
    position="absolute"
    top="32px"
    w="1px"
    zIndex="0"
  />
)}

export default DesktopVerticalLine
