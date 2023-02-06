import React from "react";

import PageViewsChart from "./google/PageViewsChart";
import UsersByChart from "./google/UsersByChart";
import {
    Heading,
    Box,
    Flex,
    List,
    ListItem,
    Text,
    Button,
    useColorMode,
    useColorModeValue,
    SimpleGrid,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Switch,
    Select,
    Checkbox,
    GridItem,
    Table,
    Tbody,
    Th,
    Thead,
    Tr,
    Td,
    Tooltip,
    IconButton,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    useDisclosure,
    Divider,
    ButtonGroup,
    Icon,
} from "@chakra-ui/react";
const AdminGoogleAnalytics = () => {
    return (
        <Box w="100%">
            <SimpleGrid columns={"2"} columnGap={8} rowGap={4} w="full" gap="12px">
                <GridItem colSpan={{ base: 2 }}>
                    <PageViewsChart />
                </GridItem>
                <GridItem colSpan={{ base: 2, lg: 1 }}>
                    <UsersByChart />
                </GridItem>
            </SimpleGrid>
        </Box>
    );
};

export default AdminGoogleAnalytics;
