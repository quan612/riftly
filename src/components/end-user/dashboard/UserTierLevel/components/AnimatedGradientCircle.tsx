// Modules
import { motion } from 'framer-motion'

// Components
import LinearGradient from './LinearGradient'

// UI
import { useTheme } from '@chakra-ui/react'

const AnimatedGradientCircle = () => {
  const theme = useTheme()

  return (
    <motion.svg
      animate={{ rotate: 360 }}
      fill="none"
      height="84px"
      style={{ position: 'absolute' }}
      transition={{
        repeat: Infinity,
        ease: 'linear',
        duration: 1.5,
      }}
      viewBox="0 0 84 84"
      width="84px"
    >
      <circle
        cx="42"
        cy="42"
        r="38"
        fill={theme.colors.brand.neutral5}
        stroke="url(#paint0_linear_13425_1016)"
        strokeWidth="7.5"
      />
      <LinearGradient />
    </motion.svg>
  )
}

export default AnimatedGradientCircle
