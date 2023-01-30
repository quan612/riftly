import Link from "next/link";
import { useRouter } from "next/router";

import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react";


const routes = [
  {
    name: "User Rewards",
    path: "/admin/search"
  },
  {
    name: "User Stats",
    path: "/admin/search-stats"
  }, {
    name: "User Quests",
    path: "/admin/search-user-quests"
  }
]

function SearchMenu() {

  let activeBg = useColorModeValue("white", "orange.700");
  let inactiveBg = useColorModeValue("white", "navy.700");
  let activeColor = useColorModeValue("gray.700", "white");
  let inactiveColor = useColorModeValue("gray.400", "white");
  let sidebarActiveShadow = useColorModeValue(
    "0px 7px 11px rgba(0, 0, 0, 0.04)",
    "none"
  );
  const router = useRouter();

  const activeRoute = (routeName) => {
    return router.pathname === routeName ? "active" : "";
  };

  return (
    <Box>
      <Flex>

        {routes.map((route, key) => {
          return (
            <Box key={key}>
              <Link href={route.path}>
                {activeRoute(route.path) === "active" ? (
                  <Button
                    boxSize="initial"
                    justifyContent="flex-start"
                    alignItems="center"
                    bg={activeBg}
                    boxShadow={sidebarActiveShadow}
                    mb={{
                      xl: "6px",
                    }}
                    mx={{
                      xl: "auto",
                    }}
                    ps={{
                      sm: "10px",
                      xl: "16px",
                    }}
                    py="12px"
                    borderRadius="15px"
                    _hover="none"
                    w="100%"
                    _active={{
                      bg: "inherit",
                      transform: "none",
                      borderColor: "transparent",
                    }}
                    _focus={{
                      boxShadow: "none",
                    }}
                  >
                    {/* <Flex> */}
                    {/* {typeof prop.icon === "string" ? (
                  <Icon>{prop.icon}</Icon>
                ) : (
                  <IconBox
                    bg="blue.500"
                    color="white"
                    h="30px"
                    w="30px"
                    me="12px"
                  >
                    {prop.icon}
                  </IconBox>
                )}*/}
                    <Text color={activeColor} my="auto" fontSize="sm">
                      {route.name}
                    </Text>
                    {/* </Flex> */}
                  </Button>
                ) : (
                  <Button
                    boxSize="initial"
                    justifyContent="flex-start"
                    alignItems="center"
                    bg="transparent"
                    mb={{
                      xl: "6px",
                    }}
                    mx={{
                      xl: "auto",
                    }}
                    py="12px"
                    ps={{
                      sm: "10px",
                      xl: "16px",
                    }}
                    borderRadius="15px"
                    _hover="none"
                    w="100%"
                    _active={{
                      bg: "inherit",
                      transform: "none",
                      borderColor: "transparent",
                    }}
                    _focus={{
                      boxShadow: "none",
                    }}
                  >
                    <Flex>
                      {/* {typeof prop.icon === "string" ? (
                <Icon>{prop.icon}</Icon>
              ) : (
                <IconBox
                  bg={inactiveBg}
                  color="blue.500"
                  h="30px"
                  w="30px"
                  me="12px"
                >
                  {prop.icon}
                </IconBox>
              )} */}
                      <Text color={inactiveColor} my="auto" fontSize="sm">
                        {/* {document.documentElement.dir === "rtl"
                  ? prop.rtlName
                  : prop.name} */}
                        {route.name}
                      </Text>
                    </Flex>
                  </Button>)}
              </Link>
            </Box>
          )
        })}

      </Flex>
    </Box>
  );
}
export default SearchMenu;
