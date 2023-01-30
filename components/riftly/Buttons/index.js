

import {
  Heading,
  Box,
  Flex,
  Link,
  List,
  ListItem,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Image,
  Input,
  CloseButton,
} from "@chakra-ui/react";

export const RiftlyModalCloseButton = ({ onClose }) => {

  return (
    <CloseButton
      onClick={onClose}
      outline={"none"}
      display={"flex"}
      alignItems="center"
      justifyContent="center"
      // flexShrink={0}
      position={"absolute"}
      top={2}
      right={2}
      transition="1s"
      color={"brand.blue"}
      fontSize={{ sm: "7px", md: "8px", lg: "10px" }}
      border="1px solid"
      borderColor={"brand.blue"}
      borderRadius={{ base: "50%", md: "35%" }}
      boxSize={{ sm: "16px", md: "32px", lg: "40px" }}
      _hover={{
        border: "1px solid",
        bg: "brand.blue",
        transition: "1s",
        color: "#fff",
      }}
      _active={{
        outline: "none",
        bg: "brand.blue",
        transition: "1s",
        color: "#fff",
        border: "1px solid",
        borderColor: "#fff",
      }}
      _focus={{
        outline: "none",
        border: "1px solid",
        color: "#fff",
        borderColor: "#fff",
        bg: "brand.blue",
      }}
    />
  )
}