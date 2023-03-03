import React from "react";

import PageViewsChart from "./google/PageViewsChart";
import UsersByChart from "./google/UsersByChart";
import { Box } from "@chakra-ui/react";
import Dashboard from "./views/Dashboard";
const AdminGoogleAnalytics = () => {
    return (
        <Box w="100%">
            {/* <SimpleGrid columns={"2"} columnGap={8} rowGap={4} w="full" gap="12px"> */}
            {/* <GridItem colSpan={{ base: 2 }}>
                    <PageViewsChart />
                </GridItem> */}
            {/* <GridItem colSpan={{ base: 2, lg: 1 }}>
                    <UsersByChart />
                </GridItem> */}
            {/* <GridItem colSpan={{ base: 2 }}></GridItem> */}
            {/* </SimpleGrid> */}
            <Dashboard />
        </Box>
    );
};

export default AdminGoogleAnalytics;
