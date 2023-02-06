import { Icon, Tooltip } from "@chakra-ui/react"
import { BsInfoCircle } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { BsCheckLg } from "react-icons/bs";
import { BsTwitter, BsDiscord, BsGoogle } from "react-icons/bs";
import { RiWallet3Fill } from "react-icons/ri";

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

export const WalletConnectIcon = () => {

  return <Icon transition="0.8s" color="orange.300" as={RiWallet3Fill}></Icon>
}