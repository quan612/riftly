import {
    Flex,
    Table,
    Progress,
    Icon,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    Box,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import { useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";

import { MdCheckCircle, MdCancel, MdOutlineError } from "react-icons/md";
import Card from "@components/riftly/card/Card";

const columnsData = [
    {
        Header: "COUNTRY",
        accessor: "country",
        width: 25,
    },
    {
        Header: "PERCENTAGE",
        accessor: "percentage",
        width: 40,
    },
    {
        Header: "USERS",
        accessor: "users",
        width: 40,
    },
];

const tableData = [
    {
        country: "USA",
        percentage: 100,
        users: "8600",
    },
    {
        country: "CANADA",
        percentage: 80,
        users: "5500",
    },
    {
        country: "INDIA",
        percentage: 40,
        users: "3750",
    },
    {
        country: "UK",
        percentage: 25,
        users: "2208",
    },
    {
        country: "BRAZIL",
        percentage: 20,
        users: "1950",
    },
    {
        country: "INDONESIA",
        percentage: 17,
        users: "1895",
    },
];

export default function TopCountriesTable() {
    const columns = useMemo(() => columnsData, [columnsData]);
    const data = useMemo(() => tableData, [tableData]);

    const tableInstance = useTable(
        {
            columns,
            data,
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow, initialState } =
        tableInstance;
    initialState.pageSize = 5;

    const textColor = useColorModeValue("secondaryGray.900", "white");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
    return (
        <Card
            direction="column"
            w="100%"
            px="0px"
            // overflowX={{ sm: "scroll", lg: "hidden" }}
            h="100%"
        >
            <Flex px="25px" justify="space-between" mb="10px" align="center">
                <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
                    Top Countries
                </Text>
                {/* <Menu /> */}
            </Flex>
            <Box
                overflowX={"auto"}
                overflowY={"none"}
                // height={`${tableHeight}px`}
            >
                <Table {...getTableProps()} variant="simple" color="gray.500" h="100%">
                    <Thead>
                        {headerGroups.map((headerGroup, index) => (
                            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                                {headerGroup.headers.map((column, index) => (
                                    <Th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        pe="2px"
                                        key={index}
                                        borderColor={borderColor}
                                        width={column.width}
                                    >
                                        <Flex
                                            justify="space-between"
                                            align="center"
                                            fontSize={{ base: "10px", lg: "14px" }}
                                            color="gray.400"
                                        >
                                            {column.render("Header")}
                                        </Flex>
                                    </Th>
                                ))}
                            </Tr>
                        ))}
                    </Thead>
                    <Tbody {...getTableBodyProps()}>
                        {page.map((row, index) => {
                            prepareRow(row);
                            return (
                                <Tr {...row.getRowProps()} key={index}>
                                    {row.cells.map((cell, index) => {
                                        let data = "";
                                        if (cell.column.Header === "COUNTRY") {
                                            data = (
                                                <Text
                                                    color={textColor}
                                                    fontSize="12px"
                                                    fontWeight="400"
                                                >
                                                    {cell.value}
                                                </Text>
                                            );
                                        } else if (cell.column.Header === "PERCENTAGE") {
                                            data = (
                                                <Flex align="center">
                                                    <Progress
                                                        variant="table"
                                                        colorScheme="blue"
                                                        h="8px"
                                                        w="108px"
                                                        value={cell.value}
                                                    />
                                                </Flex>
                                            );
                                        } else if (cell.column.Header === "USERS") {
                                            data = (
                                                <Text
                                                    color={textColor}
                                                    fontSize="sm"
                                                    fontWeight="700"
                                                >
                                                    {cell.value}
                                                </Text>
                                            );
                                        }

                                        return (
                                            <Td
                                                {...cell.getCellProps()}
                                                key={index}
                                                fontSize={{ sm: "14px" }}
                                                maxH="30px !important"
                                                py="4px"
                                                // minW={{ sm: "150px", md: "200px", lg: "auto" }}
                                                borderColor="transparent"
                                                // width={cell.column.width}
                                                // maxW={{
                                                //     sm: "50px",
                                                //     md: "70px",
                                                //     lg: "70px",
                                                // }}
                                                // width={{
                                                //     sm: 50,
                                                //     md: 50,
                                                //     lg: 50,
                                                // }}
                                            >
                                                {data}
                                            </Td>
                                        );
                                    })}
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
            </Box>
        </Card>
    );
}
