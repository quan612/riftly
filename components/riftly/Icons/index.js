import { Icon, Tooltip, Flex } from "@chakra-ui/react"
import { BsInfoCircle } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { BsCheckLg } from "react-icons/bs";
import { BsTwitter, BsDiscord, BsGoogle } from "react-icons/bs";
import { RiWallet3Fill } from "react-icons/ri";

export const IconBox = (props) => {
  const { icon, ...rest } = props;

  return (
    <Flex
      alignItems={"center"}
      justifyContent={"center"}
      borderRadius={"8px"}
      {...rest}
    >
      {icon}
    </Flex>
  );
}



export const RiftlyIcon = ({ fill = "#1D63FF" }) => {
  return (
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 70 70"
      fill="none"
    >
      <defs></defs>
      <g>
        <path
          fill={fill}
          className="cls-1"
          d="m70,35c0,2.76-2.24,5-5,5-13.81,0-25,11.19-25,25,0,2.76-2.24,5-5,5s-5-2.24-5-5c0-13.81-11.19-25-25-25-2.76,0-5-2.24-5-5s2.24-5,5-5c13.81,0,25-11.2,25-25,0-2.76,2.24-5,5-5s5,2.24,5,5c0,13.8,11.19,25,25,25,2.76,0,5,2.24,5,5Z"
        />
      </g>
    </svg>
  );
};

export const MetamaskIcon = ({ width = "24px", height = "24px" }) => {
  return (
    <Icon color="orange.300">
      <svg
        width={width}
        height={height}
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M28.4231 1.18018L16.7891 9.82018L18.9401 4.72218L28.4231 1.18018Z"
          fill="#E2761B"
          stroke="#E2761B"
          strokeWidth="0.117"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.56489 1.18018L13.1049 9.90218L11.0599 4.72218L1.56489 1.18018ZM24.2369 21.2092L21.1389 25.9562L27.7689 27.7802L29.6739 21.3142L24.2369 21.2092ZM0.337891 21.3142L2.23189 27.7802L8.86189 25.9562L5.76189 21.2092L0.337891 21.3142Z"
          fill="#E4761B"
          stroke="#E4761B"
          strokeWidth="0.117"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.48689 13.1882L6.63989 15.9822L13.2229 16.2752L12.9889 9.20116L8.48689 13.1882ZM21.4999 13.1882L16.9399 9.11816L16.7889 16.2742L23.3599 15.9822L21.4999 13.1882ZM8.86089 25.9562L12.8129 24.0262L9.39989 21.3622L8.86189 25.9572L8.86089 25.9562ZM17.1749 24.0272L21.1379 25.9562L20.5889 21.3612L17.1749 24.0272Z"
          fill="#E4761B"
          stroke="#E4761B"
          strokeWidth="0.117"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21.1391 25.9559L17.1751 24.0259L17.4911 26.6109L17.4551 27.6979L21.1391 25.9559ZM8.86108 25.9559L12.5451 27.6979L12.5211 26.6109L12.8131 24.0269L8.86108 25.9559Z"
          fill="#D7C1B3"
          stroke="#D7C1B3"
          strokeWidth="0.117"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.6029 19.6541L9.30591 18.6841L11.6329 17.6191L12.6029 19.6541ZM17.3849 19.6541L18.3549 17.6191L20.6949 18.6831L17.3849 19.6531V19.6541Z"
          fill="#233447"
          stroke="#233447"
          strokeWidth="0.117"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.86094 25.9559L9.42294 21.2089L5.76294 21.3139L8.86094 25.9559ZM20.5769 21.2089L21.1379 25.9559L24.2369 21.3139L20.5769 21.2089ZM23.3599 15.9819L16.7889 16.2749L17.3969 19.6539L18.3669 17.6189L20.7059 18.6829L23.3599 15.9829V15.9819ZM9.30494 18.6829L11.6429 17.6189L12.6029 19.6539L13.2219 16.2739L6.63894 15.9819L9.30494 18.6829Z"
          fill="#CD6116"
          stroke="#CD6116"
          strokeWidth="0.117"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.63989 15.9819L9.39989 21.3609L9.30589 18.6829L6.63989 15.9829V15.9819ZM20.7059 18.6829L20.5889 21.3609L23.3599 15.9819L20.7059 18.6829ZM13.2229 16.2739L12.6029 19.6539L13.3749 23.6409L13.5499 18.3909L13.2229 16.2749V16.2739ZM16.7889 16.2739L16.4729 18.3789L16.6129 23.6409L17.3969 19.6539L16.7889 16.2739Z"
          fill="#E4751F"
          stroke="#E4751F"
          strokeWidth="0.117"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.3969 19.6541L16.6129 23.6411L17.1749 24.0271L20.5889 21.3611L20.7059 18.6831L17.3959 19.6531L17.3969 19.6541ZM9.30591 18.6831L9.39891 21.3611L12.8139 24.0271L13.3739 23.6411L12.6029 19.6541L9.30591 18.6841V18.6831Z"
          fill="#F6851B"
          stroke="#F6851B"
          strokeWidth="0.117"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.4551 27.6981L17.4911 26.6111L17.1981 26.3531H12.7901L12.5211 26.6111L12.5451 27.6981L8.86108 25.9561L10.1481 27.0081L12.7551 28.8211H17.2331L19.8531 27.0081L21.1381 25.9561L17.4551 27.6981Z"
          fill="#C0AD9E"
          stroke="#C0AD9E"
          strokeWidth="0.117"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.175 24.0271L16.613 23.6411H13.375L12.813 24.0271L12.521 26.6111L12.79 26.3531H17.198L17.49 26.6111L17.175 24.0271Z"
          fill="#161616"
          stroke="#161616"
          strokeWidth="0.117"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M28.914 10.3822L29.908 5.61118L28.423 1.18018L17.175 9.52818L21.501 13.1882L27.616 14.9772L28.973 13.3982L28.388 12.9782L29.323 12.1242L28.598 11.5622L29.534 10.8492L28.914 10.3822ZM0.092041 5.61118L1.08604 10.3812L0.455041 10.8492L1.39004 11.5622L0.677041 12.1242L1.61204 12.9772L1.02704 13.3982L2.37204 14.9772L8.48704 13.1872L12.813 9.52718L1.56604 1.18018L0.092041 5.61018V5.61118Z"
          fill="#763D16"
          stroke="#763D16"
          strokeWidth="0.117"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M27.6159 14.9772L21.5009 13.1872L23.3609 15.9822L20.5889 21.3612L24.2369 21.3142H29.6739L27.6159 14.9772ZM8.48689 13.1882L2.37189 14.9772L0.337891 21.3142H5.76289L9.39889 21.3612L6.63889 15.9822L8.48689 13.1882ZM16.7889 16.2742L17.1749 9.52817L18.9519 4.72217H11.0599L12.8129 9.52817L13.2229 16.2742L13.3629 18.4022L13.3749 23.6412H16.6129L16.6369 18.4032L16.7889 16.2752V16.2742Z"
          fill="#F6851B"
          stroke="#F6851B"
          strokeWidth="0.117"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Icon>
  );
};

export const WalletConnectIcon = ({ width = "24px", height = "24px" }) => {
  return (
    <Icon>
      <svg
        width={width}
        height={height}
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        <clipPath id="a">
          <path d="m0 0h400v400h-400z" />
        </clipPath>
        <g clipPath="url(#a)">
          <circle cx="200" cy="200" fill="#f1f3f3" r="199.5" stroke="#fff" />
          <path
            d="m122.519 148.965c42.791-41.729 112.171-41.729 154.962 0l5.15 5.022c2.14 2.086 2.14 5.469 0 7.555l-17.617 17.18c-1.07 1.043-2.804 1.043-3.874 0l-7.087-6.911c-29.853-29.111-78.253-29.111-108.106 0l-7.59 7.401c-1.07 1.043-2.804 1.043-3.874 0l-17.617-17.18c-2.14-2.086-2.14-5.469 0-7.555zm191.397 35.529 15.679 15.29c2.14 2.086 2.14 5.469 0 7.555l-70.7 68.944c-2.139 2.087-5.608 2.087-7.748 0l-50.178-48.931c-.535-.522-1.402-.522-1.937 0l-50.178 48.931c-2.139 2.087-5.608 2.087-7.748 0l-70.7015-68.945c-2.1396-2.086-2.1396-5.469 0-7.555l15.6795-15.29c2.1396-2.087 5.6085-2.087 7.7481 0l50.1789 48.932c.535.522 1.402.522 1.937 0l50.177-48.932c2.139-2.087 5.608-2.087 7.748 0l50.179 48.932c.535.522 1.402.522 1.937 0l50.179-48.931c2.139-2.087 5.608-2.087 7.748 0z"
            fill="#1D63FF"
          />
        </g>
      </svg>
    </Icon>
  );
};

export const RiftlyTooltip = ({ placement = "top", label }) => {
  return (
    <Tooltip
      placement={placement}
      label={label}
    >
      <span>
        <Icon
          as={BsInfoCircle}
          ms={"5px"}
        />
      </span>
    </Tooltip>
  )
}

export const RiftlyEditIcon = ({ onClick }) => {
  return (
    <Icon
      transition="0.8s"
      color="green.300"
      boxSize={5}
      as={BiEdit}
      _hover={{
        cursor: "pointer",
      }}
      onClick={onClick}
    />
  )
}

export const RiftlyCheckMark = () => {
  return (
    <Icon
      transition="0.8s"
      color="green.300"
      as={BsCheckLg}
    />
  )
}


export const DiscordIcon = () => {
  return <Icon transition="0.8s" color="purple.300" as={BsDiscord} />
}

export const TwitterIcon = () => {
  return <Icon transition="0.8s" color="blue.300" as={BsTwitter} />
}

export const GoogleIcon = () => {
  return <Icon transition="0.8s" color="red.300" as={BsGoogle}></Icon>
}

export const SettingsIcon = ({
  // displayName: "SettingsIcon",
  // viewBox: "0 0 24 24",
  // // path can also be an array of elements, if you have multiple paths, lines, shapes, etc.
  // path: (
  //   <g>
  //     <path d='M0,0h24v24H0V0z' fill='none' />
  //     <path
  //       fill='currentColor'
  //       d='M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z'
  //     />
  //   </g>
  // ),
}) => {

  return <svg
    width={width}
    height={height}
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  ></svg>
};

// export const WalletConnectIcon = () => {

//   return <Icon transition="0.8s" color="orange.300" as={RiWallet3Fill}></Icon>
// }