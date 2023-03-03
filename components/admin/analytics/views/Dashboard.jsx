import React, { useEffect, useState } from "react";
import { AdminBanner, MiniStatistics } from "@components/shared/Card";
import { IconBox } from "@components/shared/Icons";
import { MdAddTask, MdAttachMoney, MdBarChart, MdFileCopy, MdPeopleAlt } from "react-icons/md";
import { FiBarChart2 } from "react-icons/fi";
import {
    Avatar,
    Box,
    Flex,
    FormLabel,
    Icon,
    Select,
    SimpleGrid,
    useColorModeValue,
    Text,
    GridItem,
    Heading,
} from "@chakra-ui/react";

import dynamic from "next/dynamic";
import UsersByDevicePieCart from "./UsersByDevicePieCart";
import CompletedChallengesTable from "./CompletedChallengesTable";
import TopCountriesTable from "./TopCountriesTable";
import UserSignUpReferral from "./UserSignUpReferral";
import { useAdminUsersSimpleStatisticsQuery } from "@shared/HOC/user";
import axios from "axios";

const UserSignUpLineChart = dynamic(() => import("./UserSignUpLineChart"), { ssr: false });

export default function Dashboard() {
    // Chakra Color Mode
    const brandColor = useColorModeValue("brand.500", "white");
    const boxBg = "brand.neutral3";

    const { data: aggregatedUserStatistic, isLoading: isLoadingUsersStatistics } =
        useAdminUsersSimpleStatisticsQuery();

    const [totalSession, totalSessionSet] = useState(0);

    useEffect(async () => {
        let res = await axios
            .get(`/api/admin/analytics/user-session`) //user-session  page-view
            .then((r) => r.data)
            .catch((err) => console.log(err));

        if (!res.isError) {
            let sessionTotal = res?.totals[0]?.metricValues[0].value;
            totalSessionSet(sessionTotal);
        }
    }, []);
    return (
        <Box pt={{ base: "10px", md: "15px", xl: "15px" }}>
            <SimpleGrid columns={{ base: 1 }} gap="20px" mb="20px">
                <HomeBanner />
            </SimpleGrid>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap="20px" mb="20px">
                <MiniStatistics
                    isLoading={isLoadingUsersStatistics}
                    startContent={
                        <IconBox
                            w="56px"
                            h="56px"
                            bg={boxBg}
                            borderRadius="50%"
                            icon={<Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />}
                        />
                    }
                    name="Total Users"
                    value={aggregatedUserStatistic?.usersCount}
                />
                <MiniStatistics
                    isLoading={isLoadingUsersStatistics}
                    startContent={
                        <IconBox
                            w="56px"
                            h="56px"
                            bg={boxBg}
                            borderRadius="50%"
                            icon={<Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />}
                        />
                    }
                    name="Total User ETH Volume"
                    value={aggregatedUserStatistic?.usersETH}
                />
                <MiniStatistics
                    isLoading={isLoadingUsersStatistics}
                    startContent={
                        <IconBox
                            w="56px"
                            h="56px"
                            bg={boxBg}
                            borderRadius="50%"
                            icon={<Icon w="32px" h="32px" as={MdPeopleAlt} color={brandColor} />}
                        />
                    }
                    name="New Users this month"
                    value={aggregatedUserStatistic?.newUsers?.newUsersThisMonth}
                    growth={`${aggregatedUserStatistic?.newUsers?.growth}`}
                />
                <MiniStatistics
                    startContent={
                        <IconBox
                            w="56px"
                            h="56px"
                            bg={boxBg}
                            icon={<Icon w="32px" h="32px" as={FiBarChart2} color={brandColor} />}
                        />
                    }
                    name="Sessions this week"
                    value={totalSession}
                />
            </SimpleGrid>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap="20px" mb="20px">
                <GridItem colSpan={{ base: 1, lg: 3 }}>
                    <UserSignUpLineChart />
                </GridItem>
                <GridItem colSpan={{ base: 1 }}>
                    <UsersByDevicePieCart />
                </GridItem>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap="20px" mb="20px">
                <GridItem colSpan={{ base: 1, lg: 2 }}>
                    <CompletedChallengesTable />
                </GridItem>

                <GridItem colSpan={{ base: 1, lg: 2 }}>
                    <TopCountriesTable />
                </GridItem>
            </SimpleGrid>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap="20px" mb="20px">
                <GridItem colSpan={{ base: 1, lg: 1 }}>
                    <UserSignUpReferral />
                </GridItem>
            </SimpleGrid>
        </Box>
    );
}

const HomeBanner = () => {
    return (
        <AdminBanner>
            <Flex
                mb={{ sm: "10px", md: "0px" }}
                direction={{ base: "column" }}
                w={{ sm: "100%" }}
                textAlign={{ base: "start" }}
            >
                <Flex direction="column" maxWidth="100%" my={{ base: "14px" }} gap="1rem">
                    <Heading fontSize={{ base: "lg", lg: "3xl" }} color={"white"} fontWeight="700">
                        Good morning, Riftly team 👋
                    </Heading>
                    <Text fontSize={"lg"} color={"white"} fontWeight="400">
                        Here is what's happening with your platform
                    </Text>
                </Flex>
            </Flex>
        </AdminBanner>
    );
};
