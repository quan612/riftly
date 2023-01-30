import React, { useRef, useEffect } from "react";

import { Box, Flex } from "@chakra-ui/react";
import SearchMenu from "@components/layout/SearchMenu";

function AdminSearchLayout({ children }) {
    const ref = useRef(null);

    return (
        <Box ref={ref} h="calc(100vh - 200px)">
            <SearchMenu />
            {children}
        </Box>
    );
}

export default AdminSearchLayout;
