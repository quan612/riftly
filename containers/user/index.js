import {
  Heading,
  Box,
  Flex,
  Container,
} from "@chakra-ui/react";

export const ShortContainer = ({ children }) => {
  return (
    <Flex w="100%" alignItems="center" justifyContent={"center"} mt={{ base: "0.25rem", lg: "0px" }}>
      <Box
        className="short-container"

        w={"container.sm"}
        maxW="container.sm"
        bg={"brand.neutral4"}
        color="#262626"
        height={{ base: "auto", lg: "429px" }}
        borderRadius="16px"
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        zIndex="2"
        me={{ base: "24px", xl: "0px" }}
        ms={{ base: "24px", xl: "0px" }}
        p={"3rem 56px"}
      >
        <Flex
          w="100%"
          h="100%"
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"space-around"}
          gap={{ base: "16px", md: "48px" }}
        >
          {children}
        </Flex>
      </Box>
    </Flex>
  );
};

export const TallContainer = ({ children }) => {
  return (
    <Flex w="100%" alignItems="center" justifyContent={"center"} mt={{ base: "0.25rem", lg: "0px" }}>
      <Box
        className="tall-container"

        w={"container.sm"}
        maxW="container.sm"
        bg={"brand.neutral4"}
        color="#262626"
        height={{ base: "auto", lg: "536px" }}
        borderRadius="16px"
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        me={{ base: "24px", xl: "0px" }}
        ms={{ base: "24px", xl: "0px" }}
        p={{ base: "24px", md: "3rem" }}

      >
        <Flex
          w={{ base: "100%", sm: "63.5%" }} //120 / 640 of container.sm
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"space-around"}
          gap={{ base: "16px", lg: "24px" }}
        >
          {children}
        </Flex>
      </Box>
    </Flex>
  );
};