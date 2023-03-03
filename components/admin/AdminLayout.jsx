import React, { useState } from "react";

import { Box, Flex, Portal, useDisclosure, useColorMode, Stack } from "@chakra-ui/react";
import MainPanel from "./layout/MainPanel";
import PanelContent from "./layout/PanelContent";
import PanelContainer from "./layout/PanelContainer";
import routes from "./routes";

import { RiftlyLogoWhiteText } from "@components/shared/Logo";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("./left-side-bar/Sidebar"), { ssr: false });
const AdminNavbar = dynamic(() => import("./nav/AdminNavbar"), { ssr: false });

export default function AdminLayout({ session, children }) {
    const [fixed, setFixed] = useState(false);
    const { colorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();

    const getActiveRoute = (routes) => {
        let activeRoute = "";

        for (let i = 0; i < routes.length; i++) {
            // new
            if (routes[i].category) {
                let categoryActiveRoute = getActiveRoute(routes[i].children);
                if (categoryActiveRoute !== activeRoute) {
                    return categoryActiveRoute;
                }
            }

            if (typeof window !== "undefined" && window?.location.pathname === routes[i].path) {
                return routes[i].name;
            }
        }
        return activeRoute;
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

    return (
        <Box
        // minHeight="100vh"
        // height="100vh"
        // w="100%"
        // zIndex="3"
        // flexDirection="column"
        // alignItems="start"
        >
            {session && (
                <Sidebar
                    routes={routes}
                    logo={
                        <Stack direction="row" spacing="12px" align="center" justify="center">
                            <RiftlyLogoWhiteText />
                        </Stack>
                    }
                    display="none"
                    session={session}
                />
            )}

            <MainPanel
                w={{
                    base: "100%",
                    xl: "calc(100% - 260px)",
                }}
            >
                {/* <Portal> */}
                <AdminNavbar
                    onOpen={onOpen}
                    brandText={getActiveRoute(routes)}
                    secondary={getActiveNavbar(routes)}
                    fixed={fixed}
                    session={session}
                />
                {/* </Portal> */}

                <PanelContent>
                    <PanelContainer>
                        <Flex direction="column" pt={{ base: "75px", md: "100px" }}>
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
