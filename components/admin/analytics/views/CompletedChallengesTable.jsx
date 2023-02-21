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
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import { useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";

import { MdCheckCircle, MdCancel, MdOutlineError } from "react-icons/md";
import Card from "@components/riftly/card/Card";

const columnsData = [
    {
        Header: "NAME",
        accessor: "name",
    },
    {
        Header: "STARTED",
        accessor: "started",
    },
    {
        Header: "FINISHED",
        accessor: "finished",
    },
    {
        Header: "COMPLETION RATE",
        accessor: "progress",
    },
];

const tableData = [
    {
        name: "Quest 1",
        started: "500",
        finished: "450",
        progress: 75.5,
    },
    {
        name: "Quest 2",
        started: "1500",
        finished: "450",
        progress: 30.5,
    },
    {
        name: "Quest 3",
        started: "500",
        finished: "450",
        progress: 90,
    },
    {
        name: "Quest 4",
        started: "500",
        finished: "250",
        progress: 50.5,
    },
];

export default function CompletedChallengesTable() {
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
        <Card direction="column" w="100%" px="0px" overflowX={{ sm: "scroll", lg: "hidden" }}>
            <Flex px="25px" justify="space-between" mb="10px" align="center">
                <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
                    Top Completed Challenges
                </Text>
                {/* <Menu /> */}
            </Flex>
            <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
                <Thead>
                    {headerGroups.map((headerGroup, index) => (
                        <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                            {headerGroup.headers.map((column, index) => (
                                <Th
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                    pe="10px"
                                    key={index}
                                    borderColor={borderColor}
                                >
                                    <Flex
                                        justify="space-between"
                                        align="center"
                                        fontSize={{ sm: "10px", lg: "12px" }}
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
                                    if (cell.column.Header === "NAME") {
                                        data = (
                                            <Text color={textColor} fontSize="sm" fontWeight="700">
                                                {cell.value}
                                            </Text>
                                        );
                                    } else if (cell.column.Header === "STARTED") {
                                        data = (
                                            <Flex align="center">
                                                <Text
                                                    color={textColor}
                                                    fontSize="sm"
                                                    fontWeight="700"
                                                >
                                                    {cell.value}
                                                </Text>
                                            </Flex>
                                        );
                                    } else if (cell.column.Header === "FINISHED") {
                                        data = (
                                            <Text color={textColor} fontSize="sm" fontWeight="700">
                                                {cell.value}
                                            </Text>
                                        );
                                    } else if (cell.column.Header === "COMPLETION RATE") {
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
                                    }
                                    return (
                                        <Td
                                            {...cell.getCellProps()}
                                            key={index}
                                            fontSize={{ sm: "14px" }}
                                            maxH="30px !important"
                                            py="8px"
                                            minW={{ sm: "150px", md: "200px", lg: "auto" }}
                                            borderColor="transparent"
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
        </Card>
    );
}
