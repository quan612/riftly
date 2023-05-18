// UI
import { Icon, useTheme } from '@chakra-ui/react'

interface IUploadIcon {
  handleOnClick: () => void
}

const UploadIcon = ({ handleOnClick }: IUploadIcon) => {
  const theme = useTheme()

  return (
    <Icon
      cursor="pointer"
      fill="none"
      height="100%"
      onClick={handleOnClick}
      viewBox="0 0 40 40"
      width="100%"
    >
      <circle
        cx="20"
        cy="20"
        fill={theme.colors.white}
        r="19"
        stroke={theme.colors.brand.blue}
        strokeWidth="2"
      />
      <g clipPath="url(#clip0_13957_4815)">
        <path
          d="M14.1663 25.0416H26.833V19.5H28.4163V25.8333C28.4163 26.0433 28.3329 26.2446 28.1845 26.3931C28.036 26.5416 27.8346 26.625 27.6247 26.625H13.3747C13.1647 26.625 12.9633 26.5416 12.8149 26.3931C12.6664 26.2446 12.583 26.0433 12.583 25.8333V19.5H14.1663V25.0416ZM22.083 17.125V21.875H18.9163V17.125H14.958L20.4997 11.5833L26.0413 17.125H22.083Z"
          fill={theme.colors.brand.blue}
        />
      </g>
      <defs>
        <clipPath id="clip0_13957_4815">
          <rect width="19" height="19" fill={theme.colors.white} transform="translate(11 10)" />
        </clipPath>
      </defs>
    </Icon>
  )
}

export default UploadIcon
