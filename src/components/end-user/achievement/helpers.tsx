// UI
import { useTheme } from '@chakra-ui/react'

// Types
import { AchievementType } from './types'

export const getColor = (achievement: AchievementType) => {
  const theme = useTheme()

  if (!achievement) return theme.colors.white

  const { isClaimed, isLocked } = achievement

  if (isClaimed) {
    return theme.colors.brand.blue
  }
  if (!isClaimed && !isLocked) {
    return theme.colors.brand.cyan
  }
  if (isLocked) {
    return theme.colors.white
  }
}
