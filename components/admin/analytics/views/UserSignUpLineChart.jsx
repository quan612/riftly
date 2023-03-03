import {
    Box,
    Button,
    Checkbox,
    Flex,
    Icon,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import Card from "@components/shared/Card";
import ApexLineChart from "@components/shared/Charts/ApexLineChart";
import Enums from "@enums/index";
import {
    getFirstDayCurMonth,
    getLastDayCurMonth,
    getFirstDayPrevMonth,
    getLastDayPrevMonth,
    getFirstDayOfLastYear,
    getLastDayOfLastYear,
    getFirstDayOfYear,
} from "@utils/index";
import axios from "axios";
import moment from "moment";
import dynamic from "next/dynamic";

import React, { useCallback, useRef, useState, useEffect } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { MdBarChart, MdOutlineCalendarToday } from "react-icons/md";

import { RiArrowUpSFill } from "react-icons/ri";
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
const ApexCharts = dynamic(() => import("apexcharts"), { ssr: false });

const chartId = "sign-up-user-line-chart";

const { THIS_MONTH, LAST_MONTH, THIS_YEAR, LAST_YEAR, WALLET, DISCORD, TWITTER, EMAIL, GOOGLE } =
    Enums;
const updateOptionsData = {
    "This Month": {
        xaxis: {
            // type: "datetime",
            // min: getFirstDayCurMonth().getTime(),
            // max: new Date(), //getLastDayCurMonth().getTime(), //new Date().getTime(), //getLastDayCurMonth().getTime() //new Date("05 Mar 2023").getTime()
        },
    },
    "Last Month": {
        xaxis: {
            // type: "datetime",
            // min: getFirstDayPrevMonth().getTime(),
            // max: getLastDayPrevMonth().getTime(),
            // tickAmount: 6,
        },
    },
    "This Year": {
        xaxis: {
            type: "string",
            // type: "string",
            // min: getFirstDayOfYear().getTime(),
            // max: new Date().getTime(),
            // tickAmount: 6,
        },
    },
    "Last Year": {
        xaxis: {
            type: "string",
            // min: getFirstDayOfLastYear().getTime(),
            // max: getLastDayOfLastYear().getTime(),
            // tickAmount: 12,
        },
    },
};

const lineChartDataUserSignUp = [
    {
        name: WALLET,
        data: [
            { x: "02/01/2023", y: 50 },
            { x: "02/02/2023", y: 64 },
            { x: "02/03/2023", y: 48 },
            { x: "02/04/2023", y: 66 },
            { x: "02/21/2023", y: 49 },
            { x: "02/25/2023", y: 68 },
        ],
        // data: [
        //     { x: "JAN", y: 50 },
        //     { x: "FEB", y: 64 },
        //     { x: "MAR", y: 48 },
        //     { x: "APR", y: 66 },
        //     { x: "MAY", y: 49 },
        //     { x: "JUN", y: 68 },
        // ],
        fillColor: "#F6AD55",
    },
    // {
    //     name: EMAIL,
    //     data: [30, 40, 24, 46, 20, 46],
    //     fillColor: "#68D391",
    // },
    // {
    //     name: DISCORD,
    //     data: [14, 22, 24, 36, 5, 6],
    //     fillColor: "#B794F4",
    // },
    // {
    //     name: TWITTER,
    //     data: [24, 32, 44, 66, 25, 16],
    //     fillColor: "#63B3ED",
    // },
];

const lineChartOptionsUserSignUp = {
    chart: {
        // type: "line",
        id: chartId,
        height: 350,
        toolbar: {
            show: false,
        },
        dropShadow: {
            enabled: true,
            top: 13,
            left: 0,
            blur: 10,
            opacity: 0.1,
            color: "#4318FF",
        },
    },
    colors: ["#F6AD55", "#B794F4", "#63B3ED", "#68D391", "#FC8181"],

    markers: {
        size: 0,
        colors: "white",
        strokeColors: "#7551FF",
        strokeWidth: 3,
        strokeOpacity: 0.9,
        strokeDashArray: 0,
        fillOpacity: 1,
        discrete: [],
        shape: "circle",
        radius: 2,
        offsetX: 0,
        offsetY: 0,
        showNullDataPoints: true,
    },
    tooltip: {
        theme: "dark",
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        curve: "smooth",
        type: "line",
    },
    xaxis: {
        // type: "string",
        // type: "datetime",
        // min: getFirstDayPrevMonth().getTime(),
        // max: getLastDayPrevMonth().getTime(),
        labels: {
            show: true,
            style: {
                colors: "#A3AED0",
                fontSize: "12px",
                fontWeight: "500",
            },
        },
        decimalsInFloat: 0,
        tickPlacement: "between",
    },
    yaxis: {
        show: false,
        min: 0,
    },
    legend: {
        show: false,
    },
    grid: {
        show: false,
        column: {
            // color: ["#7551FF", "#39B8FF"],
            opacity: 0.5,
        },
        padding: {
            left: 20,
            right: 40, // Also you may want to increase this (based on the length of your labels)
        },
    },
    // color: ["#7551FF", "#39B8FF"],
};

export default function UserSignUpLineChart() {
    // Chakra Color Mode

    const textColor = useColorModeValue("secondaryGray.900", "white");
    const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
    const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    const iconColor = useColorModeValue("brand.500", "white");
    const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    const bgHover = useColorModeValue({ bg: "secondaryGray.400" }, { bg: "whiteAlpha.50" });
    const bgFocus = useColorModeValue({ bg: "secondaryGray.300" }, { bg: "whiteAlpha.100" });

    const chartRef = useRef();

    const [lineChartData, lineChartDataSet] = useState([]);
    const [filterBy, filterBySet] = useState(THIS_YEAR);
    const [totalSignUp, totalSignUpSet] = useState(0);

    const chartDataTranslation = useCallback((apiData, filterByVal) => {
        const chartData = [];
        const walletType = {
            name: WALLET,
            data: [],
            fillColor: "#F6AD55",
        };
        const discordType = {
            name: DISCORD,
            data: [],
            fillColor: "#B794F4",
        };
        const twitterType = {
            name: TWITTER,
            data: [],
            fillColor: "#63B3ED",
        };
        const emailType = {
            name: EMAIL,
            data: [],
            fillColor: "#68D391",
        };
        const googleType = {
            name: GOOGLE,
            data: [],
            fillColor: "#FC8181",
        };
        let total = 0;
        if (apiData) {
            apiData?.forEach((r) => {
                let dateVal =
                    filterByVal === THIS_MONTH || filterByVal === LAST_MONTH
                        ? moment.utc(r.dates).format("MMM-DD") //r.dates
                        : moment.utc(r.dates).format("MMM");

                let count = parseInt(r.count);
                switch (r.signUpOrigin) {
                    case WALLET:
                        total += count;
                        walletType.data.push({
                            x: dateVal,
                            y: count,
                        });
                        break;
                    case DISCORD:
                        total += count;
                        discordType.data.push({
                            x: dateVal,
                            y: count,
                        });
                        break;
                    case EMAIL:
                        total += count;
                        emailType.data.push({
                            x: dateVal,
                            y: count,
                        });
                        break;
                    case TWITTER:
                        total += count;
                        twitterType.data.push({
                            x: dateVal,
                            y: count,
                        });
                        break;
                    case GOOGLE:
                        total += count;
                        googleType.data.push({
                            x: dateVal,
                            y: count,
                        });
                        break;
                    default:
                }
            });
            chartData.push(walletType);
            chartData.push(discordType);
            chartData.push(twitterType);
            chartData.push(emailType);
            // chartData.push(googleType);
        }

        return { chartData, total };
    }, []);

    const handleFilterBy = async (filterByVal) => {
        if (filterByVal !== filterBy) {
            filterBySet(filterByVal);

            let res = await axios
                .post(`/api/admin/analytics/signup-statistics`, { filterBy: filterByVal })
                .then((r) => r.data)
                .catch((err) => console.log(err));

            if (res?.isError) {
            }
            if (res?.length > 0) {
                let { chartData, total } = await chartDataTranslation(res, filterByVal);
                lineChartDataSet(chartData);
                totalSignUpSet(total);
            }
        }
    };
    useEffect(() => {
        handleFilterBy(LAST_MONTH);
    }, []);

    return (
        <Card justifyContent="center" align="center" direction="column" w="100%" mb="0px" h="100%">
            <Flex justify="space-between" ps="0px" pe="20px" pt="5px">
                <Flex align="center" w="100%">
                    <Menu>
                        <MenuButton
                            as={Button}
                            bg={boxBg}
                            fontSize="sm"
                            fontWeight="500"
                            color={textColorSecondary}
                            borderRadius="7px"
                        >
                            <Icon as={MdOutlineCalendarToday} color={textColorSecondary} me="4px" />
                            {filterBy}
                        </MenuButton>
                        <MenuList>
                            <MenuItem
                                onClick={() => {
                                    handleFilterBy(THIS_YEAR);
                                }}
                            >
                                {THIS_YEAR}
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    handleFilterBy(LAST_YEAR);
                                }}
                            >
                                {LAST_YEAR}
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    handleFilterBy(THIS_MONTH);
                                }}
                            >
                                {THIS_MONTH}
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    handleFilterBy(LAST_MONTH);
                                }}
                            >
                                {LAST_MONTH}
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </Flex>
            <Flex w="100%" flexDirection={{ base: "column", lg: "row" }}>
                <Flex flexDirection="column" me="20px" mt="28px">
                    <Text
                        color={textColor}
                        fontSize="34px"
                        textAlign="start"
                        fontWeight="700"
                        lineHeight="100%"
                    >
                        {totalSignUp}
                    </Text>
                    <Flex align="center" mb="20px">
                        <Text
                            color="secondaryGray.600"
                            fontSize="sm"
                            fontWeight="500"
                            mt="4px"
                            me="12px"
                        >
                            User sign up
                        </Text>
                        <Flex align="center">
                            <Icon as={RiArrowUpSFill} color="green.500" me="2px" mt="2px" />
                            <Text color="green.500" fontSize="sm" fontWeight="700">
                                +2.45%
                            </Text>
                        </Flex>
                    </Flex>

                    <Flex align="start" flexDirection={"column"} gap="8px">
                        <Checkbox
                            colorScheme={"orange"}
                            onChange={() =>
                                window.ApexCharts.exec(chartId, "toggleSeries", [WALLET])
                            }
                            defaultChecked={true}
                        >
                            <Text color="orange.300">Wallet</Text>
                        </Checkbox>
                        <Checkbox
                            colorScheme={"green"}
                            onChange={() =>
                                window.ApexCharts.exec(chartId, "toggleSeries", [EMAIL])
                            }
                            defaultChecked={true}
                        >
                            <Text color="green.300">Email</Text>
                        </Checkbox>
                        <Checkbox
                            colorScheme={"purple"}
                            onChange={() =>
                                window.ApexCharts.exec(chartId, "toggleSeries", [DISCORD])
                            }
                            defaultChecked={true}
                        >
                            <Text color="purple.300">Discord</Text>
                        </Checkbox>
                        <Checkbox
                            colorScheme={"blue"}
                            onChange={() =>
                                window.ApexCharts.exec(chartId, "toggleSeries", [TWITTER])
                            }
                            defaultChecked={true}
                        >
                            <Text color="blue.300">Twitter</Text>
                        </Checkbox>
                    </Flex>
                </Flex>
                <Box minH="260px" minW="75%" mt="auto">
                    <ApexLineChart
                        chartData={lineChartData} // lineChartDataUserSignUp
                        chartOptions={lineChartOptionsUserSignUp}
                    />
                </Box>
            </Flex>
        </Card>
    );
}
