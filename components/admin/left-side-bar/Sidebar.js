/*eslint-disable*/
import { HamburgerIcon } from "@chakra-ui/icons";
// chakra imports
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  List,
  ListIcon,
  ListItem,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react";
import { IconBox } from "@components/riftly/Icons";
import Link from "next/link";
import { useRouter } from "next/router";
// import {
//   renderThumbDark,
//   renderThumbLight,
//   renderTrack,
//   renderTrackRTL,
//   renderView,
//   renderViewRTL
// } from "components/Scrollbar/Scrollbar";
// import { HSeparator } from "components/Separator/Separator";
// import { SidebarHelp } from "components/Sidebar/SidebarHelp";
import React, { useContext, useEffect, useState, useCallback, useRef } from "react";
import { Web3Context } from "@context/Web3Context";
// import { Scrollbars } from "react-custom-scrollbars";
// import {
//   //  NavLink, 
//   // useLocation
// } from "react-router-dom";


import {
  MdDarkMode,
  MdExpandLess,
  MdExpandMore,
  MdLightMode,
  MdMenu,
} from "react-icons/md";
import AdminLogin from "../AdminLogin";

function Sidebar(props) {
  const { sidebarVariant, session } = props;
  const router = useRouter()
  const [state, setState] = React.useState({});
  const { SignOut } = useContext(Web3Context);

  const mainPanel = React.useRef();
  let variantChange = "0.2s linear";

  const { colorMode } = useColorMode;

  const walletSignInModal = useDisclosure();


  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return router.pathname === routeName ? true : false;
  };

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes) => {
    // Chakra Color Mode
    let activeBg = useColorModeValue("white", "navy.700");
    let inactiveBg = useColorModeValue("white", "navy.700");
    let activeColor = useColorModeValue("gray.700", "white");
    let inactiveColor = useColorModeValue("gray.400", "gray.400");
    let sidebarActiveShadow = "0px 7px 11px rgba(0, 0, 0, 0.04)";
    return routes?.map((prop, key) => {
      // if (prop.redirect) {
      //   return null;
      // }
      // if (prop.category) {
      //   var st = {};
      //   st[prop["state"]] = !state[prop.state];
      //   return (
      //     <>
      //       <Text
      //         color={activeColor}
      //         fontWeight="bold"
      //         mb={{
      //           xl: "6px",
      //         }}
      //         mx="auto"
      //         ps={{
      //           sm: "10px",
      //           xl: "16px",
      //         }}
      //         py="12px"
      //       >
      //         {prop.name}
      //       </Text>
      //       {createLinks(prop.views)}
      //     </>
      //   );
      // }


      if (prop.category) {
        return (
          <Accordion allowMultiple key={key}>
            <AccordionItem key={key} border="none">
              {({ isExpanded }) => (
                <>
                  <AccordionButton
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}>
                    <Text m={0} fontWeight={"bold"} fontSize="lg">
                      {prop.category}
                    </Text>
                    {isExpanded ? <MdExpandLess /> : <MdExpandMore />}
                  </AccordionButton>
                  <AccordionPanel p={0} >
                    <List>
                      {prop.children.map((child) => {
                        // const { label, path, filterParams, Icon } =
                        //   menuItem;

                        const { name, path } = child


                        const isActive = activeRoute(path)

                        return (
                          <ListItem
                            // as={Link}

                            as={Button}
                            variant={"ghost"}
                            w={"full"}
                            borderRadius={"0"}
                            display={"flex"}
                            justifyContent={"start"}
                            p={3}
                            href={"/"}
                            key={name}
                            onClick={() =>
                              // navigateToDiscover(path, filterParams)
                              router.push(path)
                            }
                          >
                            {/* <ListIcon
                             as={() =>
                               Icon({
                                 size: "1.25em",
                                 style: { marginRight: "0.75rem" },
                               })
                             }
                             /> */}
                            <Text mt={-1} ml="1.5rem" color={isActive ? activeColor : inactiveColor} my="auto" fontSize="md">{name}</Text>
                          </ListItem>
                        );
                      })}
                    </List>
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
          </Accordion>
        )
      }

      return (
        // <Link key={key} href={prop.path}>
        //   {activeRoute(prop.layout + prop.path) === "active" ? (
        //     <Button
        //       boxSize="initial"
        //       justifyContent="flex-start"
        //       alignItems="center"
        //       boxShadow={sidebarActiveShadow}
        //       bg={activeBg}
        //       transition={variantChange}
        //       mb={{
        //         xl: "6px",
        //       }}
        //       mx={{
        //         xl: "auto",
        //       }}
        //       ps={{
        //         sm: "10px",
        //         xl: "16px",
        //       }}
        //       py="12px"
        //       borderRadius="15px"
        //       _hover="none"
        //       w="100%"
        //       _active={{
        //         bg: "inherit",
        //         transform: "none",
        //         borderColor: "transparent",
        //       }}
        //       _focus={{
        //         boxShadow: "0px 7px 11px rgba(0, 0, 0, 0.04)",
        //       }}
        //     >
        //       <Flex>
        //         {typeof prop.icon === "string" ? (
        //           <Icon>{prop.icon}</Icon>
        //         ) : (
        //           <IconBox
        //             bg="blue.500"
        //             color="white"
        //             h="30px"
        //             w="30px"
        //             me="12px"
        //             transition={variantChange}
        //           >
        //             {prop.icon}
        //           </IconBox>
        //         )}
        //         <Text color={activeColor} my="auto" fontSize="sm">
        //           {document.documentElement.dir === "rtl"
        //             ? prop.rtlName
        //             : prop.name}
        //         </Text>
        //       </Flex>
        //     </Button>
        //   ) : (
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
            {typeof prop.icon === "string" ? (
              <Icon>{prop.icon}</Icon>
            ) : (
              <IconBox
                bg={inactiveBg}
                color="blue.500"
                h="30px"
                w="30px"
                me="12px"
                transition={variantChange}
              >
                {prop.icon}
              </IconBox>
            )}
            <Text color={inactiveColor} my="auto" fontSize="sm">
              {prop.name}
            </Text>
          </Flex>
        </Button>
        //   )}
        // </Link>

      );
    });
  };
  const { logo, routes } = props;

  var links = <>{createLinks(routes)}</>;
  //  BRAND
  //  Chakra Color Mode
  let sidebarBg = useColorModeValue("white", "navy.800");
  let sidebarRadius = "20px";
  let sidebarMargins = "0px";
  var brand = (
    <Box pt={"25px"} mb="12px">
      {logo}
      {/* <HSeparator my="26px" /> */}
      <Divider mt="1rem" />
    </Box>
  );

  // SIDEBAR
  return (
    <Box ref={mainPanel}>
      <Box display={{ sm: "none", xl: "block" }} position="fixed">
        <Box
          bg={sidebarBg}
          transition={variantChange}
          w="260px"
          maxW="260px"
          ms={{
            sm: "16px",
          }}
          my={{
            sm: "16px",
          }}
          h="calc(100vh - 32px)"
          ps="20px"
          pe="20px"
          m={sidebarMargins}
          filter="drop-shadow(0px 5px 14px rgba(0, 0, 0, 0.05))"
          borderRadius={sidebarRadius}
        >
          {/* <Scrollbars
            autoHide
            renderTrackVertical={
              document.documentElement.dir === "rtl"
                ? renderTrackRTL
                : renderTrack
            }
            renderThumbVertical={useColorModeValue(
              renderThumbLight,
              renderThumbDark
            )}
            renderView={
              document.documentElement.dir === "rtl"
                ? renderViewRTL
                : renderView
            }
          >*/}
          <>
            <Box>{brand}</Box>
            <Stack direction="column" mb="40px">
              <Box>{links}</Box>
            </Stack>
          </>
          {/* <SidebarHelp sidebarVariant={sidebarVariant} /> */}
          {walletSignInModal?.isOpen && (
            <AdminLogin
              isOpen={walletSignInModal.isOpen}
              onClose={() => {
                walletSignInModal.onClose();
              }}
            />
          )}
          {!session ? (
            <Button
              display={{ base: 'none', md: 'inline-flex' }}
              fontSize={'sm'}
              fontWeight={600}
              color={'white'}
              bg={'pink.400'}
              onClick={() => walletSignInModal.onOpen()}
              _hover={{
                bg: 'pink.300',
              }}>
              Connect
            </Button>
          ) : (
            <>
              <Button
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={'sm'}
                fontWeight={600}
                color={'white'}
                bg={'pink.400'}
                onClick={() => SignOut()}
                _hover={{
                  bg: 'pink.300',
                }}>
                Disconnect
              </Button>
            </>
          )}
          {/* </Scrollbars> */}
        </Box>
      </Box>
    </Box>
  );
}

// FUNCTIONS

export function SidebarResponsive(props) {
  // to check for active links and opened collapses
  // let location = useLocation();
  const { logo, routes, colorMode, hamburgerColor, ...rest } = props;

  // this is for the rest of the collapses
  const [state, setState] = React.useState({});
  const mainPanel = React.useRef();
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return true;
    // return location.pathname === routeName ? "active" : "";
  };
  // Chakra Color Mode
  let activeBg = useColorModeValue("white", "navy.700");
  let inactiveBg = useColorModeValue("white", "navy.700");
  let activeColor = useColorModeValue("gray.700", "white");
  let inactiveColor = useColorModeValue("gray.400", "white");
  let sidebarActiveShadow = useColorModeValue(
    "0px 7px 11px rgba(0, 0, 0, 0.04)",
    "none"
  );
  let sidebarBackgroundColor = useColorModeValue("white", "navy.800");

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      if (prop.redirect) {
        return null;
      }
      if (prop.category) {
        var st = {};
        st[prop["state"]] = !state[prop.state];
        return (
          <React.Fragment key={key}>
            <Text
              color={activeColor}
              fontWeight="bold"
              mb={{
                xl: "6px",
              }}
              mx="auto"
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              py="12px"
            >
              {document.documentElement.dir === "rtl"
                ? prop.rtlName
                : prop.name}
            </Text>
            {createLinks(prop.views)}
          </React.Fragment>
        );
      }
      return (
        <Link to={prop.layout + prop.path} key={key} href="/">
          {activeRoute(prop.layout + prop.path) === "active" ? (
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
              <Flex>
                {typeof prop.icon === "string" ? (
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
                )}
                <Text color={activeColor} my="auto" fontSize="sm">
                  {document.documentElement.dir === "rtl"
                    ? prop.rtlName
                    : prop.name}
                </Text>
              </Flex>
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
                {typeof prop.icon === "string" ? (
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
                )}
                <Text color={inactiveColor} my="auto" fontSize="sm">
                  {document.documentElement.dir === "rtl"
                    ? prop.rtlName
                    : prop.name}
                </Text>
              </Flex>
            </Button>
          )}
        </Link>
      );
    });
  };

  var links = <>{createLinks(routes)}</>;

  //  BRAND

  var brand = (
    <Box pt={"35px"} mb="8px">
      {logo}
      {/* <HSeparator my="26px" /> */}
    </Box>
  );

  // SIDEBAR
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  // Color variables
  return (
    <Flex
      display={{ sm: "flex", xl: "none" }}
      ref={mainPanel}
      alignItems="center"
    >
      <HamburgerIcon
        color={hamburgerColor}
        w="18px"
        h="18px"
        ref={btnRef}
        onClick={onOpen}
      />
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={document.documentElement.dir === "rtl" ? "right" : "left"}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent
          w="250px"
          maxW="250px"
          ms={{
            sm: "16px",
          }}
          my={{
            sm: "16px",
          }}
          borderRadius="16px"
          bg={sidebarBackgroundColor}
        >
          <DrawerCloseButton
            _focus={{ boxShadow: "none" }}
            _hover={{ boxShadow: "none" }}
          />
          <DrawerBody maxW="250px" px="1rem">
            <Box maxW="100%" h="100vh">
              <Box>{brand}</Box>
              <Stack direction="column" mb="40px">
                <Box>{links}</Box>
              </Stack>
              {/* <SidebarHelp /> */}
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}

export default Sidebar;
