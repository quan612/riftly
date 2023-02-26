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
    Heading,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import { useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";

import { MdCheckCircle, MdCancel, MdOutlineError } from "react-icons/md";
import Card from "@components/shared/Card";

const columnsData = [
    {
        Header: "CHALLENGE",
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
        name: "Connect to Discord",
        started: "500",
        finished: "450",
        progress: 75.5,
    },
    {
        name: "Follow Twitter Whale_drop",
        started: "1500",
        finished: "450",
        progress: 30.5,
    },
    {
        name: "Code Quest",
        started: "500",
        finished: "450",
        progress: 90,
    },
    {
        name: "SMS Link",
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

    const textColor = "white";
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
    return (
        <Card direction="column" w="100%" px="0px" overflowX={{ sm: "scroll", lg: "hidden" }}>
            <Flex px="25px" justify="space-between" mb="24px" align="center">
                <Heading color={textColor} fontSize="xl" fontWeight="700" lineHeight="24px">
                    Top Completed Challenges
                </Heading>
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
                                    <Flex justify="space-between" align="center">
                                        <Text
                                            fontSize={{ sm: "12px", lg: "14px" }}
                                            color="brand.neutral1"
                                            fontWeight={"400"}
                                        >
                                            {column.render("Header")}
                                        </Text>
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
                                    if (cell.column.Header === "CHALLENGE") {
                                        data = (
                                            <Heading
                                                color={textColor}
                                                fontSize="sm"
                                                fontWeight="700"
                                            >
                                                {cell.value}
                                            </Heading>
                                        );
                                    } else if (cell.column.Header === "STARTED") {
                                        data = (
                                            <Flex align="center">
                                                <Text
                                                    color={textColor}
                                                    fontSize="sm"
                                                    fontWeight="400"
                                                >
                                                    {cell.value}
                                                </Text>
                                            </Flex>
                                        );
                                    } else if (cell.column.Header === "FINISHED") {
                                        data = (
                                            <Text color={textColor} fontSize="sm" fontWeight="400">
                                                {cell.value}
                                            </Text>
                                        );
                                    } else if (cell.column.Header === "COMPLETION RATE") {
                                        data = (
                                            <Flex align="center" justifyContent={"space-between"}>
                                                <Text
                                                    color={textColor}
                                                    fontSize="sm"
                                                    fontWeight="400"
                                                >
                                                    {cell.value}%
                                                </Text>
                                                <Progress
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
