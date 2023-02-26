import React from "react";
import { Box, Flex, Text, Select, useColorModeValue, Heading } from "@chakra-ui/react";
import Card from "@components/shared/Card";
import ApexPieChart from "@components/shared/Charts/ApexPieChart";

const pieChartData = [50, 25, 25];
const pieChartOptions = {
    labels: ["Desktop", "Mobile", "Tablet"],
    colors: ["rgba(29, 99, 255, 1)", "rgba(29, 99, 255, 0.6)", "rgba(29, 99, 255, 0.3)"],
    chart: {
        width: "50px",
    },
    states: {
        hover: {
            filter: {
                type: "none",
            },
        },
    },
    legend: {
        show: false,
    },
    dataLabels: {
        enabled: false,
    },
    hover: { mode: null },
    plotOptions: {
        donut: {
            expandOnClick: false,
            donut: {
                labels: {
                    show: false,
                },
            },
        },
    },
    fill: {
        colors: ["rgba(29, 99, 255, 1)", "rgba(29, 99, 255, 0.6)", "rgba(29, 99, 255, 0.3)"],
    },
    tooltip: {
        enabled: true,
        theme: "dark",
    },
    stroke: {
        width: 0,
    },
};

export default function UsersByDevicePieCart() {
    // Chakra Color Mode
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const cardColor = "brand.neutral3";
    const cardShadow = useColorModeValue("0px 18px 40px rgba(112, 144, 176, 0.12)", "unset");
    return (
        <Card p="20px" align="center" direction="column" w="100%">
            <Flex
                px={{ base: "0px", "2xl": "10px" }}
                justifyContent="space-between"
                alignItems="center"
                w="100%"
                mb="8px"
            >
                <Text color={textColor} fontSize="md" fontWeight="600" mt="4px">
                    User by Device
                </Text>
                <Select
                    fontSize="sm"
                    variant="subtle"
                    defaultValue="monthly"
                    width="unset"
                    fontWeight="700"
                >
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </Select>
            </Flex>

            <ApexPieChart
                h="100%"
                w="100%"
                chartData={pieChartData}
                chartOptions={pieChartOptions}
            />
            <Card
                bg={cardColor}
                flexDirection="row"
                boxShadow={cardShadow}
                w="100%"
                p="15px"
                px="20px"
                mt="15px"
                mx="auto"
                gap="10px"
                justifyContent="space-around"
            >
                <Flex direction="column" py="5px">
                    <Flex align="center">
                        <Box h="8px" w="8px" bg="brand.blue" borderRadius="50%" me="4px" />
                        <Text fontSize="xs" color="brand.neutral1" fontWeight="400" mb="5px">
                            Desktop
                        </Text>
                    </Flex>
                    <Heading fontSize="md" color={textColor} fontWeight="700" fontFamily={"Intern"}>
                        50%
                    </Heading>
                </Flex>

                <Flex direction="column" py="5px" me="10px">
                    <Flex align="center">
                        <Box
                            h="8px"
                            w="8px"
                            bg="brand.blue"
                            borderRadius="50%"
                            me="4px"
                            opacity={"0.6"}
                        />
                        <Text fontSize="xs" color="secondaryGray.600" fontWeight="700" mb="5px">
                            Mobile
                        </Text>
                    </Flex>
                    <Heading fontSize="md" color={textColor} fontWeight="700" fontFamily={"Intern"}>
                        25%
                    </Heading>
                </Flex>
                <Flex direction="column" py="5px" me="10px">
                    <Flex align="center">
                        <Box
                            h="8px"
                            w="8px"
                            bg="brand.blue"
                            borderRadius="50%"
                            me="4px"
                            opacity={"0.3"}
                        />
                        <Text fontSize="xs" color="secondaryGray.600" fontWeight="700" mb="5px">
                            Tablet
                        </Text>
                    </Flex>
                    <Heading fontSize="md" color={textColor} fontWeight="700" fontFamily={"Intern"}>
                        25%
                    </Heading>
                </Flex>
            </Card>
        </Card>
    );
}
