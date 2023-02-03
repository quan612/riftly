import { Icon, Tooltip } from "@chakra-ui/react"
import { BsInfoCircle } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import { BsCheckLg } from "react-icons/bs";

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