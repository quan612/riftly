import React, { useState } from "react";

import { Box, Flex, Portal, useDisclosure, useColorMode, Stack } from "@chakra-ui/react";
import AdminNavigation from "./nav";
import MainPanel from "./layout/MainPanel";
import PanelContent from "./layout/PanelContent";
import PanelContainer from "./layout/PanelContainer";
import routes from "./routes";
import AdminNavbar from "./nav/AdminNavbar";
import Sidebar from "./left-side-bar/Sidebar";
import { RiftlyLogoWhite, RiftlyLogoWhiteText } from "@components/riftly/Logo";

export default function AdminLayout({ session, children }) {
    const [fixed, setFixed] = useState(false);
    const { colorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const getActiveRoute = (routes) => {
        let activeRoute = "Default Brand Text";
        // for (let i = 0; i < routes.length; i++) {
        //     if (routes[i].collapse) {
        //         let collapseActiveRoute = getActiveRoute(routes[i].views);
        //         if (collapseActiveRoute !== activeRoute) {
        //             return collapseActiveRoute;
        //         }
        //     } else if (routes[i].category) {
        //         let categoryActiveRoute = getActiveRoute(routes[i].views);
        //         if (categoryActiveRoute !== activeRoute) {
        //             return categoryActiveRoute;
        //         }
        //     }
        //     // else {
        //     //     if (
        //     //         window &&
        //     //         window?.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        //     //     ) {
        //     //         return routes[i].name;
        //     //     }
        //     // }
        // }
        // return activeRoute;
    };
    // This changes navbar state(fixed or not)
    const getActiveNavbar = (routes) => {
        let activeNavbar = false;
        for (let i = 0; i < routes.length; i++) {
            if (routes[i].category) {
                let categoryActiveNavbar = getActiveNavbar(routes[i].children);
                if (categoryActiveNavbar !== activeNavbar) {
                    return categoryActiveNavbar;
                }
            }
            //  else {
            //     if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
            //         if (routes[i].secondaryNavbar) {
            //             return routes[i].secondaryNavbar;
            //         }
            //     }
            // }
        }
        return activeNavbar;
    };
    // console.log(routes);
    return (
        <Box
        // minHeight="100vh"
        // height="100vh"
        // w="100%"
        // zIndex="3"
        // flexDirection="column"
        // alignItems="start"
        >
            {/* <AdminNavigation /> */}
            {/* <Flex minW="100%" w="100%" mt="30px" justifyContent={"center"}>
                <Flex
                    flexDirection={{
                        base: "column",
                        xl: "column",
                    }}
                    w={{ base: "100%", md: "100%", lg: "85%", xl: "75%" }}
                >
                    {children}
                </Flex>
            </Flex> */}

            <Sidebar
                routes={routes}
                logo={
                    <Stack direction="row" spacing="12px" align="center" justify="center">
                        <RiftlyLogoWhiteText />
                    </Stack>
                }
                display="none"
                session={session}
                // {...rest}
            />

            <MainPanel
                w={{
                    base: "100%",
                    xl: "calc(100% - 275px)",
                }}
            >
                <Portal>
                    <AdminNavbar
                        onOpen={onOpen}
                        brandText={getActiveRoute(routes)}
                        secondary={getActiveNavbar(routes)}
                        fixed={fixed}
                        // {...rest}
                    />
                </Portal>

                <PanelContent>
                    <PanelContainer>
                        {/* <Switch>
                {getRoutes(routes)}
                <Redirect from='/admin' to='/admin/dashboard' />
              </Switch> */}
                        <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
                            {children}
                        </Flex>
                    </PanelContainer>
                </PanelContent>

                {/* <Footer /> */}
                {/* <Portal>
          <FixedPlugin
            secondary={getActiveNavbar(routes)}
            fixed={fixed}
            onOpen={onOpen}
          />
        </Portal>
        <Configurator
          secondary={getActiveNavbar(routes)}
          isOpen={isOpen}
          onClose={onClose}
          isChecked={fixed}
          onSwitch={(value) => {
            setFixed(value);
          }}
        /> */}
            </MainPanel>
        </Box>
    );
}
