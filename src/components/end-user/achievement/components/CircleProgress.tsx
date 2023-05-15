// UI
import { Box, useTheme } from '@chakra-ui/react'

interface ICircleProgress {
  progress: number
}

const CircleProgress = ({ progress }: ICircleProgress) => {
  const theme = useTheme()

  return (
    <>
      <Box position="absolute" boxSize="80px">
        <svg width="80" height="80" viewBox="0 0 80 80" preserveAspectRatio="xMinYMin meet">
          <circle
            cx="50%"
            cy="50%"
            fill="none"
            r="42%"
            stroke={theme.colors.white}
            strokeWidth="12"
          />
        </svg>
      </Box>

      <svg
        height="80"
        preserveAspectRatio="xMinYMin meet"
        style={{ zIndex: 2 }}
        viewBox="0 0 80 80"
        width="80"
      >
        <circle
          cx="40"
          cy="40"
          fill="none"
          r="34"
          stroke={theme.colors.brand.cyan}
          strokeDasharray="213.52"
          strokeDashoffset={` ${213.52 - (213.52 * progress) / 100}`}
          strokeWidth="12"
          transform="rotate(-90 40 40)"
        />
      </svg>
    </>
  )
}

export default CircleProgress
