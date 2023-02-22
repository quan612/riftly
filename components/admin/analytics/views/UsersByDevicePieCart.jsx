import React from "react";
import { Box, Flex, Text, Select, useColorModeValue } from "@chakra-ui/react";
import Card from "@components/riftly/card/Card";
import ApexPieChart from "@components/riftly/charts/ApexPieChart";

const pieChartData = [63, 25, 12];
const pieChartOptions = {
    labels: ["Desktop", "Mobile", "Tablet"],
    colors: ["#2C5282", "#6AD2FF", "#3182CE"],
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
        colors: ["#2C5282", "#6AD2FF", "#3182CE"],
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
    // const { ...rest } = props;

    // Chakra Color Mode
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const cardColor = useColorModeValue("white", "navy.700");
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
            >
                <Flex direction="column" py="5px">
                    <Flex align="center">
                        <Box h="8px" w="8px" bg="brand.500" borderRadius="50%" me="4px" />
                        <Text fontSize="xs" color="secondaryGray.600" fontWeight="700" mb="5px">
                            Mobile
                        </Text>
                    </Flex>
                    <Text fontSize="lg" color={textColor} fontWeight="700">
                        63%
                    </Text>
                </Flex>
                {/* <VSeparator mx={{ base: "60px", xl: "60px", "2xl": "60px" }} /> */}
                <Flex direction="column" py="5px" me="10px">
                    <Flex align="center">
                        <Box h="8px" w="8px" bg="#6AD2FF" borderRadius="50%" me="4px" />
                        <Text fontSize="xs" color="secondaryGray.600" fontWeight="700" mb="5px">
                            Desktop
                        </Text>
                    </Flex>
                    <Text fontSize="lg" color={textColor} fontWeight="700">
                        25%
                    </Text>
                </Flex>
                <Flex direction="column" py="5px" me="10px">
                    <Flex align="center">
                        <Box h="8px" w="8px" bg="#6AD2FF" borderRadius="50%" me="4px" />
                        <Text fontSize="xs" color="secondaryGray.600" fontWeight="700" mb="5px">
                            Tablet
                        </Text>
                    </Flex>
                    <Text fontSize="lg" color={textColor} fontWeight="700">
                        25%
                    </Text>
                </Flex>
            </Card>
        </Card>
    );
}
