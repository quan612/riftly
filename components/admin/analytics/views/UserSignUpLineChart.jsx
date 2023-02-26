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
import dynamic from "next/dynamic";

import React, { useCallback, useRef } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { MdBarChart, MdOutlineCalendarToday } from "react-icons/md";

import { RiArrowUpSFill } from "react-icons/ri";
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
const ApexCharts = dynamic(() => import("apexcharts"), { ssr: false });

const chartId = "sign-up-user-line-chart";

const lineChartDataUserSignUp = [
    {
        name: Enums.WALLET,
        data: [50, 64, 48, 66, 49, 68],
        fillColor: "#F6AD55",
    },
    {
        name: Enums.EMAIL,
        data: [30, 40, 24, 46, 20, 46],
        fillColor: "#68D391",
    },
    {
        name: Enums.DISCORD,
        data: [14, 22, 24, 36, 5, 6],
        fillColor: "#B794F4",
    },
    {
        name: Enums.TWITTER,
        data: [24, 32, 44, 66, 25, 16],
        fillColor: "#63B3ED",
    },
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
    colors: ["#F6AD55", "#68D391", "#B794F4", "#63B3ED"],

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
        // type: "numeric",
        categories: ["SEP", "OCT", "NOV", "DEC", "JAN", "FEB"],
        labels: {
            style: {
                colors: "#A3AED0",
                fontSize: "12px",
                fontWeight: "500",
            },
        },
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false,
        },
    },
    yaxis: {
        show: false,
    },
    legend: {
        show: false,
    },
    grid: {
        show: false,
        column: {
            color: ["#7551FF", "#39B8FF"],
            opacity: 0.5,
        },
    },
    // color: ["#7551FF", "#39B8FF"],
};

const lineChartOptions = {
    chart: {
        toolbar: {
            show: false,
        },
    },
    tooltip: {
        theme: "dark",
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        curve: "smooth",
    },
    xaxis: {
        // type: "datetime",
        categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ],
        axisTicks: {
            show: false,
        },
        axisBorder: {
            show: false,
        },
        labels: {
            style: {
                colors: "#fff",
                fontSize: "12px",
            },
        },
    },
    yaxis: {
        labels: {
            style: {
                colors: "#fff",
                fontSize: "12px",
            },
        },
    },
    legend: {
        show: false,
    },
    grid: {
        strokeDashArray: 5,
    },
    fill: {
        type: "gradient",
        gradient: {
            shade: "light",
            type: "vertical",
            shadeIntensity: 0.5,
            inverseColors: true,
            opacityFrom: 0.8,
            opacityTo: 0,
            stops: [],
        },
        colors: ["#fff", "#3182CE"],
    },
    colors: ["#fff", "#3182CE"],
};

export default function UserSignUpLineChart(props) {
    // Chakra Color Mode

    const textColor = useColorModeValue("secondaryGray.900", "white");
    const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
    const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    const iconColor = useColorModeValue("brand.500", "white");
    const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    const bgHover = useColorModeValue({ bg: "secondaryGray.400" }, { bg: "whiteAlpha.50" });
    const bgFocus = useColorModeValue({ bg: "secondaryGray.300" }, { bg: "whiteAlpha.100" });

    const chartRef = useRef();

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
                            This Year (placeholder)
                        </MenuButton>
                        <MenuList>
                            <MenuItem>This Year</MenuItem>
                            <MenuItem>Last Year</MenuItem>
                            <MenuItem>This Month</MenuItem>
                            <MenuItem>Last Month</MenuItem>
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
                        250
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
                                window.ApexCharts.exec(chartId, "toggleSeries", [Enums.WALLET])
                            }
                            defaultChecked={true}
                        >
                            <Text color="orange.300">Wallet</Text>
                        </Checkbox>
                        <Checkbox
                            colorScheme={"green"}
                            onChange={() =>
                                window.ApexCharts.exec(chartId, "toggleSeries", [Enums.EMAIL])
                            }
                            defaultChecked={true}
                        >
                            <Text color="green.300">Email</Text>
                        </Checkbox>
                        <Checkbox
                            colorScheme={"purple"}
                            onChange={() =>
                                window.ApexCharts.exec(chartId, "toggleSeries", [Enums.DISCORD])
                            }
                            defaultChecked={true}
                        >
                            <Text color="purple.300">Discord</Text>
                        </Checkbox>
                        <Checkbox
                            colorScheme={"blue"}
                            onChange={() =>
                                window.ApexCharts.exec(chartId, "toggleSeries", [Enums.TWITTER])
                            }
                            defaultChecked={true}
                        >
                            <Text color="blue.300">Twitter</Text>
                        </Checkbox>
                    </Flex>
                </Flex>
                <Box minH="260px" minW="75%" mt="auto">
                    <ApexLineChart
                        chartData={lineChartDataUserSignUp}
                        chartOptions={lineChartOptionsUserSignUp}
                    />
                </Box>
            </Flex>
        </Card>
    );
}
