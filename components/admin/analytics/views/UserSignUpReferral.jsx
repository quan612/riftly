import React from "react";
import { MdBarChart } from "react-icons/md";
import { Box, Button, Flex, Heading, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import ApexBarChart from "@components/shared/Charts/ApexBarChart";
import Card from "@components/shared/Card";

const barChartDataConsumption = [
    {
        name: "riftly website",
        data: [400],
    },
    {
        name: "discord",
        data: [222],
    },
    {
        name: "twitter",
        data: [145],
    },
    {
        name: "facebook",
        data: [121],
    },
];

const barChartOptionsConsumption = {
    chart: {
        stacked: true,
        stackType: "100%",
        height: 50,
        toolbar: {
            show: false,
        },
        sparkline: {
            enabled: true,
        },
    },
    tooltip: {
        style: {
            fontSize: "12px",
            fontFamily: undefined,
        },
        onDatasetHover: {
            style: {
                fontSize: "12px",
                fontFamily: undefined,
            },
        },
        theme: "dark",
    },
    xaxis: {
        // categories: ["17", "18", "19", "20", "21", "22", "23", "24", "25"],
        show: false,
        labels: {
            show: false,
            //     style: {
            //         colors: "#A3AED0",
            //         fontSize: "14px",
            //         fontWeight: "500",
            //     },
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
        color: "black",
        labels: {
            show: false,
            style: {
                colors: "#A3AED0",
                fontSize: "14px",
                fontWeight: "500",
            },
        },
    },
    grid: {
        borderColor: "rgba(163, 174, 208, 0.3)",
        show: true,
        yaxis: {
            lines: {
                show: false,
                opacity: 0.5,
            },
        },
        row: {
            opacity: 0.5,
        },
        xaxis: {
            lines: {
                show: false,
            },
        },
    },
    // fill: {
    //     type: "solid",
    //     colors: ["#5E37FF", "#6AD2FF", "#E1E9F8"],
    // },
    legend: {
        show: false,
    },
    colors: [
        "rgba(29, 99, 255, 1)",
        "rgba(29, 99, 255, 0.8)",
        "rgba(29, 99, 255, 0.6)",
        "rgba(29, 99, 255, 0.4)",
        "rgba(29, 99, 255, 0.2)",
    ],
    dataLabels: {
        enabled: false,
    },
    plotOptions: {
        bar: {
            horizontal: true,
            borderRadius: 0,
            barHeight: 20,
            // columnWidth: "20px",
        },
    },
};

export default function UserSignUpReferral() {
    // Chakra Color Mode
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const iconColor = useColorModeValue("brand.500", "white");
    const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    const bgHover = useColorModeValue({ bg: "secondaryGray.400" }, { bg: "whiteAlpha.50" });
    const bgFocus = useColorModeValue({ bg: "secondaryGray.300" }, { bg: "whiteAlpha.100" });
    return (
        <Card align="center" direction="column" w="100%" h="100%">
            <Flex align="center" w="100%" px="12px" py="10px">
                <Heading
                    me="auto"
                    color={textColor}
                    fontSize="lg"
                    fontWeight="700"
                    lineHeight="100%"
                >
                    Top Referrals
                </Heading>
            </Flex>

            <Box height="80px" w="100%">
                <ApexBarChart
                    chartData={barChartDataConsumption}
                    chartOptions={barChartOptionsConsumption}
                />
            </Box>
            <Flex flexDirection={"column"}>
                <Flex justifyContent={"space-between"}>
                    <Text>discord</Text>
                    <Text>20%</Text>
                </Flex>
                <Flex justifyContent={"space-between"}>
                    <Text>twitter</Text>
                    <Text>20%</Text>
                </Flex>
                <Flex justifyContent={"space-between"}>
                    <Text>some random site</Text>
                    <Text>20%</Text>
                </Flex>
            </Flex>
        </Card>
    );
}
