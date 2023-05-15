// Modules
import React from 'react'

// UI
import { useTheme } from '@chakra-ui/react'

interface ICircle {
  color?: string
  height?: number
  style?: React.CSSProperties
  width?: number
}

const Circle = (props: ICircle) => {
  const theme = useTheme()

  const { color = theme.colors.brand.neutral3, height = 65, style = {}, width = 64 } = props

  return (
    <svg style={style} width={width} height={height} viewBox="0 0 64 65" fill="none">
      <path
        d="M32 4C35.6696 4 39.3045 4.73235 42.6978 6.15661C46.0911 7.58091 49.1778 9.66999 51.7803 12.3072C54.3829 14.9445 56.4502 18.0783 57.8615 21.531C59.2729 24.9838 60 28.6863 60 32.4267C60 36.167 59.2729 39.8695 57.8615 43.3223C56.4502 46.775 54.3829 49.9088 51.7803 52.5462C49.1778 55.1833 46.0911 57.2724 42.6978 58.6967C39.3045 60.121 35.6696 60.8533 32 60.8533C28.3304 60.8533 24.6954 60.121 21.3022 58.6967C17.9089 57.2724 14.8222 55.1833 12.2197 52.5461C9.61707 49.9088 7.54981 46.775 6.13846 43.3223C4.72708 39.8695 4 36.167 4 32.4267C4 28.6863 4.72709 24.9838 6.13847 21.531C7.54982 18.0783 9.61708 14.9445 12.2197 12.3072C14.8222 9.66998 17.9089 7.5809 21.3022 6.1566C24.6955 4.73235 28.3304 4 32 4L32 4Z"
        stroke={color}
        strokeWidth="8"
      />
    </svg>
  )
}

export default Circle
