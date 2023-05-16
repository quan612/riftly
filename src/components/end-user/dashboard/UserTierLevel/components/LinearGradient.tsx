// UI
import { useTheme } from '@chakra-ui/react'

interface ILinearGradient {
  firstColor?: string
  secondColor?: string
}

const LinearGradient = (props: ILinearGradient) => {
  const theme = useTheme()

  const { firstColor = theme.colors.brand.blue, secondColor = theme.colors.brand.cyan } = props

  return (
    <defs>
      <linearGradient
        id="paint0_linear_13425_1016"
        x1="7.25581"
        y1="-3.90698"
        x2="39.0698"
        y2="48"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor={firstColor} />
        <stop offset="1" stopColor={secondColor} />
      </linearGradient>
    </defs>
  )
}

export default LinearGradient
