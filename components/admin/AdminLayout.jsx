import React from "react";
import AdminNavbar from "./Navbar";

import { Box, Flex } from "@chakra-ui/react";
import AdminNavigation from "./nav";

export default function AdminLayout({ children }) {
    return (
        <Flex
            minHeight="100vh"
            height="100vh"
            w="100%"
            zIndex="3"
            flexDirection={{
                base: "column",
                xl: "column",
            }}
            alignItems={{
                base: "start",
                xl: "start",
            }}
            // px={{ base: "30px", md: "50px" }}
        >
            {/* <AdminNavbar /> */}
            <AdminNavigation />
            <Flex
                minW="100%"
                w="100%"
                // height="calc(100vh - 200px)"
                // minH="100%"
                // height="100%"
                mt="30px"
                justifyContent={"center"}
            >
                <Flex
                    flexDirection={{
                        base: "column",
                        xl: "column",
                    }}
                    w={{ base: "100%", md: "100%", lg: "85%", xl: "75%" }}
                >
                    {children}
                </Flex>
            </Flex>
        </Flex>
    );
}
