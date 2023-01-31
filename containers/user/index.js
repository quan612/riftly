
import {
  Heading,
  Box,
  Flex,

  Container,

} from "@chakra-ui/react";

export const ShortContainer = ({ children }) => {
  return (
    <Container
      maxW="container.sm"
      bg={"brand.neutral4"}
      color="#262626"
      height={"429px"}
      borderRadius="16px"
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      zIndex="2"
      me={{ base: "16px", md: "0px" }}
      ms={{ base: "16px", md: "0px" }}
    >
      <Flex
        w="66%"
        h="80%"
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"space-around"}
      >
        {children}
      </Flex>
    </Container>
  );
};

export const TallContainer = ({ children }) => {
  return (
    <Container
      maxW="container.sm"
      bg={"brand.neutral4"}
      color="#262626"
      height={"536px"}
      borderRadius="16px"
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Flex
        w="66%"
        h="80%"
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"space-around"}
        gap="24px"
      >
        {children}
      </Flex>
    </Container>
  );
};