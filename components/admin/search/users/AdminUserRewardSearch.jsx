import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { ErrorMessage, Field, Form, Formik, FieldArray, getIn } from "formik";
import { object, array, string, number, ref } from "yup";

import { useEnabledRewardTypesQuery } from "shared/HOC/reward-types";
import axios from "axios";
import {
    Heading,
    Box,
    Flex,
    Link,
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

import AdminCard from "../../../riftly/card/AdminCard";
import { useGlobalFilter, usePagination, useSortBy, useTable, useFilters } from "react-table";
import { ArrowRightIcon, ArrowLeftIcon, ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import Enums from "@enums/index";
import RightSideBar from "@components/riftly/right-side-bar/RightSideBar";

import { BsFilter } from "react-icons/bs";

import { Select as ReactSelect } from "chakra-react-select";
import { AiFillDelete } from "react-icons/ai";
import { useAdminUserQuestDelete } from "@shared/HOC/user-quests";
import { useAdminUserDelete } from "@shared/HOC/user";

export default function AdminUserRewardSearch({ loggedIn }) {
    const ref = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [rewardTypes, isLoadingRewardTypes] = useEnabledRewardTypesQuery();
    const [tableData, setTableData] = useState([
        // {
        //     userId: "37ed5198-8625-4e84-87e6-67629e969304",
        //     wallet: "0xb61193014Fc983b3475d6bF365B7647c2E52b713",
        //     twitterUserName: "Whale_Drop",
        //     discordUserDiscriminator: null,
        //     rewards: [
        //         {
        //             quantity: 1670,
        //             rewardType: {
        //                 id: 5,
        //                 reward: "Shell",
        //                 rewardPreview: null,
        //                 rewardIcon: null,
        //                 isEnabled: true,
        //             },
        //         },
        //     ],
        //     Shell: 1670,
        //     "Mint List": 1,
        // },
        // {
        //     userId: "9517f59a-8cab-4ab7-abbb-bc0f00de3870",
        //     wallet: "0x4D6EAEd5a1d1E631bbB6B3b4c6bedc4251d2DDF6",
        //     twitterUserName: null,
        //     discordUserDiscriminator: null,
        //     rewards: [
        //         {
        //             quantity: 1910,
        //             rewardType: {
        //                 id: 5,
        //                 reward: "Shell",
        //                 rewardPreview: null,
        //                 rewardIcon: null,
        //                 isEnabled: true,
        //             },
        //         },
        //     ],
        //     Shell: 1910,
        // },
        // {
        //     userId: "5022fb85-4534-4eaa-8ff9-3815b1ef6eaf",
        //     wallet: "0xF949695F07a442A0243Fc0F459011815d2603b58",
        //     twitterUserName: "Bearrage_eth",
        //     discordUserDiscriminator: "Bear#0037",
        //     rewards: [
        //         {
        //             quantity: 3523,
        //             rewardType: {
        //                 id: 5,
        //                 reward: "Shell",
        //                 rewardPreview: null,
        //                 rewardIcon: null,
        //                 isEnabled: true,
        //             },
        //         },
        //         {
        //             quantity: 1,
        //             rewardType: {
        //                 id: 4,
        //                 reward: "Mint List",
        //                 rewardPreview: null,
        //                 rewardIcon: null,
        //                 isEnabled: true,
        //             },
        //         },
        //     ],
        //     Shell: 3523,
        //     "Mint List": 1,
        // },
        // {
        //     userId: "fc8b247b-4cad-4f90-8946-cfa5e0952f46",
        //     wallet: "0x0281208eD5739Fa208e9ed895481ca8D2830Ada2",
        //     twitterUserName: "slime_jpg",
        //     discordUserDiscriminator: "Slime#5304",
        //     rewards: [
        //         {
        //             quantity: 1590,
        //             rewardType: {
        //                 id: 5,
        //                 reward: "Shell",
        //                 rewardPreview: null,
        //                 rewardIcon: null,
        //                 isEnabled: true,
        //             },
        //         },
        //     ],
        //     Shell: 1590,
        // },
        // {
        //     userId: "db778d77-4032-4183-844e-1858d5d06192",
        //     wallet: "0x341Be7de686295d15603A0a2Eb895a3729324a92",
        //     twitterUserName: "Yoissef64",
        //     discordUserDiscriminator: "Yoissef#2453",
        //     rewards: [
        //         {
        //             quantity: 1,
        //             rewardType: {
        //                 id: 4,
        //                 reward: "Mint List",
        //                 rewardPreview: null,
        //                 rewardIcon: null,
        //                 isEnabled: true,
        //             },
        //         },
        //         {
        //             quantity: 7403,
        //             rewardType: {
        //                 id: 5,
        //                 reward: "Shell",
        //                 rewardPreview: null,
        //                 rewardIcon: null,
        //                 isEnabled: true,
        //             },
        //         },
        //     ],
        //     "Mint List": 1,
        //     Shell: 7403,
        // },
        // {
        //     userId: "db778d77-4032-4183-844e-1858d5d06192",
        //     wallet: "0x341Be7de686295d15603A0a2Eb895a3729324a92",
        //     twitterUserName: "Yoissef64",
        //     discordUserDiscriminator: "Yoissef#2453",
        //     rewards: [
        //         {
        //             quantity: 1,
        //             rewardType: {
        //                 id: 4,
        //                 reward: "Mint List",
        //                 rewardPreview: null,
        //                 rewardIcon: null,
        //                 isEnabled: true,
        //             },
        //         },
        //         {
        //             quantity: 7403,
        //             rewardType: {
        //                 id: 5,
        //                 reward: "Shell",
        //                 rewardPreview: null,
        //                 rewardIcon: null,
        //                 isEnabled: true,
        //             },
        //         },
        //     ],
        //     "Mint List": 1,
        //     Shell: 7403,
        // },
        // {
        //     userId: "db778d77-4032-4183-844e-1858d5d06192",
        //     wallet: "0x341Be7de686295d15603A0a2Eb895a3729324a92",
        //     twitterUserName: "Yoissef64",
        //     discordUserDiscriminator: "Yoissef#2453",
        //     rewards: [
        //         {
        //             quantity: 1,
        //             rewardType: {
        //                 id: 4,
        //                 reward: "Mint List",
        //                 rewardPreview: null,
        //                 rewardIcon: null,
        //                 isEnabled: true,
        //             },
        //         },
        //         {
        //             quantity: 7403,
        //             rewardType: {
        //                 id: 5,
        //                 reward: "Shell",
        //                 rewardPreview: null,
        //                 rewardIcon: null,
        //                 isEnabled: true,
        //             },
        //         },
        //     ],
        //     "Mint List": 1,
        //     Shell: 7403,
        // },
        // {
        //     userId: "db778d77-4032-4183-844e-1858d5d06192",
        //     wallet: "0x341Be7de686295d15603A0a2Eb895a3729324a92",
        //     twitterUserName: "Yoissef64",
        //     discordUserDiscriminator: "Yoissef#2453",
        //     rewards: [
        //         {
        //             quantity: 1,
        //             rewardType: {
        //                 id: 4,
        //                 reward: "Mint List",
        //                 rewardPreview: null,
        //                 rewardIcon: null,
        //                 isEnabled: true,
        //             },
        //         },
        //         {
        //             quantity: 7403,
        //             rewardType: {
        //                 id: 5,
        //                 reward: "Shell",
        //                 rewardPreview: null,
        //                 rewardIcon: null,
        //                 isEnabled: true,
        //             },
        //         },
        //     ],
        //     "Mint List": 1,
        //     Shell: 7403,
        // },
        // {
        //     userId: "db778d77-4032-4183-844e-1858d5d06192",
        //     wallet: "0x341Be7de686295d15603A0a2Eb895a3729324a92",
        //     twitterUserName: "Yoissef64",
        //     discordUserDiscriminator: "Yoissef#2453",
        //     rewards: [
        //         {
        //             quantity: 1,
        //             rewardType: {
        //                 id: 4,
        //                 reward: "Mint List",
        //                 rewardPreview: null,
        //                 rewardIcon: null,
        //                 isEnabled: true,
        //             },
        //         },
        //         {
        //             quantity: 7403,
        //             rewardType: {
        //                 id: 5,
        //                 reward: "Shell",
        //                 rewardPreview: null,
        //                 rewardIcon: null,
        //                 isEnabled: true,
        //             },
        //         },
        //     ],
        //     "Mint List": 1,
        //     Shell: 7403,
        // },
        // {
        //     userId: "db778d77-4032-4183-844e-1858d5d06192",
        //     wallet: "0x341Be7de686295d15603A0a2Eb895a3729324a92",
        //     twitterUserName: "Yoissef64",
        //     discordUserDiscriminator: "Yoissef#2453",
        //     rewards: [
        //         {
        //             quantity: 1,
        //             rewardType: {
        //                 id: 4,
        //                 reward: "Mint List",
        //                 rewardPreview: null,
        //                 rewardIcon: null,
        //                 isEnabled: true,
        //             },
        //         },
        //         {
        //             quantity: 7403,
        //             rewardType: {
        //                 id: 5,
        //                 reward: "Shell",
        //                 rewardPreview: null,
        //                 rewardIcon: null,
        //                 isEnabled: true,
        //             },
        //         },
        //     ],
        //     "Mint List": 1,
        //     Shell: 7403,
        // },
        // {
        //     userId: "db778d77-4032-4183-844e-1858d5d06192",
        //     wallet: "0x341Be7de686295d15603A0a2Eb895a3729324a92",
        //     twitterUserName: "Yoissef64",
        //     discordUserDiscriminator: "Yoissef#2453",
        //     rewards: [
        //         {
        //             quantity: 1,
        //             rewardType: {
        //                 id: 4,
        //                 reward: "Mint List",
        //                 rewardPreview: null,
        //                 rewardIcon: null,
        //                 isEnabled: true,
        //             },
        //         },
        //         {
        //             quantity: 7403,
        //             rewardType: {
        //                 id: 5,
        //                 reward: "Shell",
        //                 rewardPreview: null,
        //                 rewardIcon: null,
        //                 isEnabled: true,
        //             },
        //         },
        //     ],
        //     "Mint List": 1,
        //     Shell: 7403,
        // },
        // {
        //     userId: "db778d77-4032-4183-844e-1858d5d06192",
        //     wallet: "0x341Be7de686295d15603A0a2Eb895a3729324a92",
        //     twitterUserName: "Yoissef64",
        //     discordUserDiscriminator: "Yoissef#2453",
        //     rewards: [
        //         {
        //             quantity: 1,
        //             rewardType: {
        //                 id: 4,
        //                 reward: "Mint List",
        //                 rewardPreview: null,
        //                 rewardIcon: null,
        //                 isEnabled: true,
        //             },
        //         },
        //         {
        //             quantity: 7403,
        //             rewardType: {
        //                 id: 5,
        //                 reward: "Shell",
        //                 rewardPreview: null,
        //                 rewardIcon: null,
        //                 isEnabled: true,
        //             },
        //         },
        //     ],
        //     "Mint List": 1,
        //     Shell: 7403,
        // },
    ]);

    const [tableHeight, tableHeightSet] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [outsideFilter, outsideFilterSet] = useState({
        type: Enums.WALLET,
        user: "",
        rewards: [],
    });

    const onSearch = async () => {
        let data = [],
            page = 0,
            searchRes = {};
        setIsLoading(true);

        try {
            console.time();
            do {
                searchRes = await axios
                    .post(`/api/admin/search?page=${page}`)
                    .then((res) => res.data);

                if (searchRes.isError) {
                    console.log(searchRes.message);
                    throw new Error("Error querying user reward");
                }

                data = [...data, ...searchRes.users];
                page = page + 1;

                break;
            } while (searchRes?.shouldContinue || page < 10);

            setTableData(data);
            console.timeEnd();
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    };
    useEffect(() => {
        tableHeightSet(ref.current.clientHeight - 150);
    }, []);
    return (
        <>
            <Flex
                ref={ref}
                flexDirection={{
                    base: "column",
                }}
                w="100%"
                h="100%"
                // justifyContent="center"
                gap="1%"
            >
                {rewardTypes && tableHeight && (
                    <ResultTable
                        tableData={tableData}
                        setTableData={setTableData}
                        rewardTypes={rewardTypes}
                        outsideFilter={outsideFilter}
                        openFilterSidebar={onOpen}
                        onSearch={onSearch}
                        tableHeight={tableHeight}
                    />
                )}
            </Flex>

            <RightSideBar isOpen={isOpen} onClose={onClose} title="Filter User Rewards">
                {rewardTypes && (
                    <FilterRewards
                        outsideFilter={outsideFilter}
                        rewardTypes={rewardTypes}
                        outsideFilterSet={outsideFilterSet}
                    />
                )}
            </RightSideBar>
        </>
    );
}

const customFilterFunction = (rows, id, filterValue) => {
    console.log(rows);
    return rows.filter(
        (row) =>
            // row.original?.wallet?.indexOf(filterValue) !== -1 ||
            row.original?.discordUserDiscriminator !== null &&
            row.original?.discordUserDiscriminator?.indexOf(filterValue) !== -1
    );
};

const customFilterRewardsRange = (rows, id, filterValue) => {
    if (filterValue?.minQty > 0) {
        return rows.filter(
            (row) =>
                row.original[id] >= filterValue.minQty && row.original[id] <= filterValue.maxQty
        );
    }
    return rows;
};

const columnData = [
    {
        Header: "WALLET",
        accessor: "wallet",

        // filter: customFilterFunction,
    },
    {
        Header: "TWITTER",
        accessor: "twitterUserName",
    },
    {
        Header: "DISCORD",
        accessor: "discordUserDiscriminator",
        // filter: customFilterFunction,
    },
    {
        Header: "Action",
        accessor: "action",
        // filter: customFilterFunction,
    },
];

const ResultTable = ({
    tableData,
    setTableData,
    rewardTypes,
    outsideFilter,
    openFilterSidebar,
    onSearch,
    tableHeight,
}) => {
    const columns = useMemo(() => {
        if (rewardTypes?.length === 0) return columnData;
        rewardTypes?.map((r) => {
            let rewardTypeIndex = columnData.findIndex((c) => c.Header === r.reward);
            if (rewardTypeIndex === -1)
                columnData.splice(3, 0, {
                    Header: r.reward,
                    accessor: r.reward,
                    filter: customFilterRewardsRange,
                });
        });
        return columnData;
    }, [tableData]);

    const data = useMemo(() => tableData, [tableData]);
    const tableInstance = useTable(
        {
            columns,
            data,
            initialState: { pageSize: 25 },
        },
        useGlobalFilter,
        useFilters,
        useSortBy,
        usePagination
    );

    const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow, setFilter } =
        tableInstance;

    useEffect(() => {
        setFilter("wallet", outsideFilter.user);

        if (outsideFilter.rewards.length > 0) {
            outsideFilter.rewards.forEach((reward) => {
                setFilter(reward.label.toString(), reward);
            });
        } else {
            rewardTypes.map((r) => {
                setFilter(r.reward.toString(), {});
            });
        }
        // setFilter("discordUserDiscriminator", outsideFilter);
    }, [outsideFilter]);

    return (
        <Box w="100%">
            <AdminCard>
                <Flex>
                    <ButtonGroup spacing="6" mb="15px">
                        <Button
                            w={{ base: "120px" }}
                            onClick={onSearch}
                            colorScheme="teal"
                            size="sm"
                            fontWeight="semibold"
                            fontSize="15px"
                            // isLoading={isQuerying}
                        >
                            Search
                        </Button>

                        <Button
                            leftIcon={<BsFilter />}
                            onClick={openFilterSidebar}
                            variant="outline"
                            size="sm"
                            fontWeight="semibold"
                            fontSize="16px"
                        >
                            Filter
                        </Button>
                    </ButtonGroup>
                </Flex>
                <Flex>
                    {tableInstance.pageOptions.length > 0 && (
                        <TablePagination tableInstance={tableInstance} />
                    )}
                </Flex>
                <Divider />
                <Box overflowX={"auto"} overflowY={"auto"} height={`${tableHeight + 10}px`}>
                    <Table variant="simple">
                        <TableHeader headerGroups={headerGroups} />

                        <TableBody
                            getTableBodyProps={getTableBodyProps}
                            page={page}
                            prepareRow={prepareRow}
                            tableData={tableData}
                            setTableData={setTableData}
                        />
                    </Table>
                </Box>
            </AdminCard>
        </Box>
    );
};

const BuildCsv = async (data) => {
    const csvString = [
        [
            "UserID",
            "Wallet",
            "Twitter Id",
            "TwitterUserName",
            "Discord User Discriminator",
            "Discord Id",
            "Rewards",
        ],
        ...data.map((item) => [
            // item.userId,
            item.wallet,
            item.twitterId,
            item.twitterUserName,
            getDiscordUserDiscriminator(item.discordUserDiscriminator),
            item.discorId,

            flattenRewards(item.rewards),
        ]),
    ]
        .map((e) => e.join(","))
        .join("\n");

    return csvString;
};

const flattenRewards = (rewards) => {
    let res = "";
    rewards?.map((r) => {
        res = res + ` ${r.rewardType.reward}(${r.quantity}),`;
    });
    return res;
};

const getDiscordUserDiscriminator = (discordUserDiscriminator) => {
    if (discordUserDiscriminator === null) {
        return "";
    }
    let str = discordUserDiscriminator.split("#");
    return str[0] + "#" + str[1];
};

const TableHeader = ({ headerGroups }) => {
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
    return (
        <Thead position="sticky" top={0} zIndex={2} bg={useColorModeValue("#ffffff", "#1B254B")}>
            {headerGroups.map((headerGroup, index) => (
                <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                    {headerGroup.headers.map((column, index) => {
                        if (column.Header !== "rewards" && column.Header !== "userId")
                            return (
                                <Th
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                    pe="4px"
                                    key={index}
                                    borderColor={borderColor}
                                    // width={column.width}
                                    minW={{
                                        sm: "150px",
                                        md: "200px",
                                        lg: "auto",
                                    }}
                                >
                                    <Flex
                                        justify="space-between"
                                        align="center"
                                        fontSize={{ sm: "8px", lg: "14px" }}
                                        color="gray.400"
                                    >
                                        {column.render("Header")}
                                    </Flex>
                                </Th>
                            );
                    })}
                </Tr>
            ))}
        </Thead>
    );
};

const TableBody = ({ page, getTableBodyProps, prepareRow, tableData, setTableData }) => {
    const [deleteUser, isDeleting, deleteUsersAsync] = useAdminUserDelete();
    return (
        <Tbody {...getTableBodyProps()} width="100%">
            {page.map((row, index) => {
                prepareRow(row);
                return (
                    <Tr {...row.getRowProps()} key={index}>
                        {row.cells.map((cell, index) => {
                            if (
                                cell.column.Header !== "rewards" &&
                                cell.column.Header !== "userId"
                            ) {
                                let data;
                                if (cell.column.Header === "Action") {
                                    data = (
                                        <Icon
                                            transition="0.8s"
                                            color="red.300"
                                            boxSize={"18px"}
                                            as={AiFillDelete}
                                            _hover={{
                                                cursor: "pointer",
                                            }}
                                            onClick={async () => {
                                                let { userId } = row.original;
                                                // let { userId } = tableProps.row.original;
                                                console.log(userId);
                                                let payload = {
                                                    userId,
                                                };
                                                if (!window.confirm("Proceed To Delete User")) {
                                                    return;
                                                }

                                                let deleteOp = await deleteUsersAsync(payload);

                                                if (!deleteOp.isError) {
                                                    const dataCopy = tableData.filter(
                                                        (d) => d.userId !== userId
                                                    );
                                                    setTableData(dataCopy);
                                                }
                                            }}
                                        />
                                    );
                                } else {
                                    data = cell.value;
                                }
                                return (
                                    <Td
                                        {...cell.getCellProps()}
                                        key={index}
                                        fontSize={{ base: "12px", lg: "14px" }}
                                        h="24px"
                                        width={cell.column.width}
                                        minW={{
                                            sm: "120px",
                                            md: "180px",
                                            lg: "auto",
                                        }}
                                        borderColor="transparent"
                                        textOverflow="ellipsis"
                                        overflow="hidden"
                                        whiteSpace="nowrap"
                                    >
                                        <Text isTruncated>{data}</Text>
                                    </Td>
                                );
                            }
                        })}
                    </Tr>
                );
            })}
        </Tbody>
    );
};

const TablePagination = ({ tableInstance }) => {
    const {
        pageOptions,
        gotoPage,
        canPreviousPage,
        previousPage,
        canNextPage,
        nextPage,
        setPageSize,
        pageCount,
        state: { pageIndex, pageSize },
    } = tableInstance;

    return (
        <Flex justifyContent="space-between" m={4} alignItems="center" w="100%">
            <Flex>
                <Tooltip label="First Page">
                    <IconButton
                        onClick={() => gotoPage(0)}
                        isDisabled={!canPreviousPage}
                        icon={<ArrowLeftIcon h={3} w={3} />}
                        mr={4}
                    />
                </Tooltip>
                <Tooltip label="Previous Page">
                    <IconButton
                        onClick={previousPage}
                        isDisabled={!canPreviousPage}
                        icon={<ChevronLeftIcon h={6} w={6} />}
                    />
                </Tooltip>
            </Flex>

            <Flex alignItems="center">
                <Text flexShrink="0" mr={8}>
                    Page{" "}
                    <Text fontWeight="bold" as="span">
                        {pageIndex + 1}
                    </Text>{" "}
                    of{" "}
                    <Text fontWeight="bold" as="span">
                        {pageOptions.length}
                    </Text>
                </Text>
                <Text flexShrink="0">Go to page:</Text>{" "}
                <NumberInput
                    ml={2}
                    mr={8}
                    w={28}
                    min={1}
                    max={pageOptions.length}
                    onChange={(value) => {
                        const page = value ? value - 1 : 0;
                        gotoPage(page);
                    }}
                    defaultValue={pageIndex + 1}
                >
                    <NumberInputField color={useColorModeValue("black", "gray.300")} />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                <Select
                    w={32}
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                    }}
                >
                    {[25, 50, 75, 100].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </Select>
            </Flex>

            <Flex>
                <Tooltip label="Next Page">
                    <IconButton
                        onClick={nextPage}
                        isDisabled={!canNextPage}
                        icon={<ChevronRightIcon h={6} w={6} />}
                    />
                </Tooltip>
                <Tooltip label="Last Page">
                    <IconButton
                        onClick={() => gotoPage(pageCount - 1)}
                        isDisabled={!canNextPage}
                        icon={<ArrowRightIcon h={3} w={3} />}
                        ml={4}
                    />
                </Tooltip>
            </Flex>
        </Flex>
    );
};

const FilterRewards = ({ outsideFilter, rewardTypes, outsideFilterSet }) => {
    const validateQty = (rewards, index) => {
        let error = null;
        if (rewards[index].minQty < 0) {
            error = `Min less than 0 for ${rewards[index].type}`;
        }

        if (parseInt(rewards[index].minQty) > parseInt(rewards[index].maxQty)) {
            error = `Min token cannot be larger than max token for ${rewards[index].type} filter`;
        }

        return error;
    };
    return (
        <Box>
            <Formik
                enableReinitialize
                initialValues={outsideFilter}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={(fields, { setStatus, resetForm }) => {
                    outsideFilterSet(fields);
                }}
            >
                {({ errors, status, touched, setFieldValue, values, resetForm }) => {
                    return (
                        <Form>
                            <GridItem colSpan={{ base: 1, xl: 1 }}>
                                <FormControl mb="16px">
                                    <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                                        User Type
                                    </FormLabel>
                                    <Field name="type" as={Select} fontSize="md" ms="4px" size="lg">
                                        <option value={Enums.WALLET}>{Enums.WALLET}</option>
                                        <option value={Enums.DISCORD}>{Enums.DISCORD}</option>
                                        <option value={Enums.TWITTER}>{Enums.TWITTER}</option>
                                    </Field>
                                </FormControl>
                            </GridItem>

                            <GridItem colSpan={{ base: 1, xl: 2 }}>
                                <FormControl mb="16px">
                                    <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                                        User
                                    </FormLabel>

                                    <Field
                                        as={Input}
                                        size="lg"
                                        name="user"
                                        type="text"
                                        variant="auth"
                                        // placeholder="Wallet / Discord User abc#1234 / Twitter User"
                                    />
                                </FormControl>
                            </GridItem>

                            <Box w="280px" zIndex={10} mb="12px">
                                <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                                    Rewards
                                </FormLabel>
                                <ReactSelect
                                    isMulti
                                    options={rewardTypes.map((r) => {
                                        return {
                                            id: r.id,
                                            label: r.reward,
                                            value: r.reward,
                                        };
                                    })}
                                    onChange={(item) => {
                                        item = item.map((i) => {
                                            i.minQty = 1;
                                            i.maxQty = 10;

                                            return i;
                                        });
                                        setFieldValue("rewards", item);
                                    }}
                                    defaultValue={outsideFilter.rewards}
                                    closeMenuOnSelect="false"
                                />
                            </Box>
                            <Box display="block">
                                <SimpleGrid columns={{ base: 2 }} columnGap={4} rowGap={2} w="full">
                                    {values.rewards &&
                                        values.rewards.map((item, index) => {
                                            const fieldName = `rewards.[${index}]`;

                                            return (
                                                <React.Fragment key={index}>
                                                    <GridItem colSpan={{ base: 2 }}>
                                                        <FormLabel
                                                            ms="2px"
                                                            fontSize="md"
                                                            fontWeight="bold"
                                                        >
                                                            {item.label}
                                                        </FormLabel>
                                                    </GridItem>
                                                    <GridItem colSpan={{ base: 1, xl: 1 }}>
                                                        <FormControl
                                                            mb="8px"
                                                            isRequired
                                                            isInvalid={
                                                                errors.rewards &&
                                                                errors?.rewards[index] &&
                                                                touched?.rewards[index]
                                                            }
                                                        >
                                                            <Field
                                                                as={Input}
                                                                size="lg"
                                                                name={`${fieldName}.minQty`}
                                                                type="text"
                                                                variant="auth"
                                                                validate={() =>
                                                                    validateQty(
                                                                        values.rewards,
                                                                        index
                                                                    )
                                                                }
                                                            />
                                                        </FormControl>
                                                    </GridItem>
                                                    <GridItem colSpan={{ base: 1, xl: 1 }}>
                                                        <FormControl
                                                            mb="8px"
                                                            isRequired
                                                            isInvalid={
                                                                errors.rewards &&
                                                                errors?.rewards[index] &&
                                                                touched?.rewards[index]
                                                            }
                                                        >
                                                            <Field
                                                                as={Input}
                                                                size="lg"
                                                                name={`${fieldName}.maxQty`}
                                                                type="text"
                                                                variant="auth"
                                                                validate={() =>
                                                                    validateQty(
                                                                        values.rewards,
                                                                        index
                                                                    )
                                                                }
                                                            />
                                                        </FormControl>
                                                    </GridItem>

                                                    <GridItem colSpan={{ base: 2 }}>
                                                        {errors.rewards && (
                                                            <Text
                                                                color={"red.500"}
                                                                fontWeight="semibold"
                                                            >
                                                                {errors.rewards[index].minQty}
                                                            </Text>
                                                        )}
                                                    </GridItem>
                                                </React.Fragment>
                                            );
                                        })}
                                </SimpleGrid>
                            </Box>
                            <Button
                                w={{ base: "150px" }}
                                my="16px"
                                type="submit"
                                colorScheme="blue"
                                size="lg"
                                fontWeight="semibold"
                                fontSize="18px"
                                // isLoading={isQuerying}
                                // disabled={getButtonState(values)}
                            >
                                Apply
                            </Button>
                        </Form>
                    );
                }}
            </Formik>
        </Box>
    );
};

const SearchForm = ({ onFormSubmit, rewardTypes, outsideFilter }) => {
    const SearchInfoSchema = object().shape({
        rewards: array().of(
            object().shape({
                type: string().required(),
                typeId: number(),
                minQty: number().required().min(0),
                maxQty: number().required().min(0),
            })
        ),
    });
    const initialValues = outsideFilter;

    const [rewardTypeItems, setRewardTypes] = useState(rewardTypes);

    useEffect(async () => {
        if (rewardTypes) {
            let rewards = [];
            rewardTypes.forEach((reward) => {
                rewards.push({
                    id: reward.id,
                    name: reward.reward,
                });
            });
            setRewardTypes(rewards);
        }
    }, [rewardTypes]);
    const validateQty = (rewards, index) => {
        let error = null;

        if (parseInt(rewards[index].minQty) > parseInt(rewards[index].maxQty)) {
            error = `Min token cannot be larger than max token for ${rewards[index].type}`;
        }

        return error;
    };

    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={SearchInfoSchema}
                onSubmit={(fields) => {
                    onFormSubmit(fields);
                }}
                validateOnBlur={true}
                validateOnChange={false}
            >
                {({ formik, errors, status, touched, values }) => {
                    return (
                        <Box w="100%">
                            <Form>
                                <Flex
                                    flexDirection={{
                                        base: "row",
                                    }}
                                    w="100%"
                                    h="100%"
                                    justifyContent="center"
                                    mb="10px"
                                    mt={{ base: "50px", md: "10px" }}
                                    gap="1%"
                                >
                                    <Box w={{ base: "100%" }} minW="100%">
                                        <AdminCard>
                                            <SimpleGrid
                                                columns={{ base: 3 }}
                                                columnGap={8}
                                                rowGap={4}
                                                w="full"
                                            >
                                                <GridItem colSpan={{ base: 1, xl: 1 }}>
                                                    <FormControl mb="16px">
                                                        <FormLabel
                                                            ms="4px"
                                                            fontSize="md"
                                                            fontWeight="bold"
                                                        >
                                                            User Type
                                                        </FormLabel>
                                                        <Field
                                                            name="type"
                                                            as={Select}
                                                            fontSize="md"
                                                            ms="4px"
                                                            size="lg"
                                                        >
                                                            <option value={Enums.WALLET}>
                                                                {Enums.WALLET}
                                                            </option>
                                                            <option value={Enums.DISCORD}>
                                                                {Enums.DISCORD}
                                                            </option>
                                                            <option value={Enums.TWITTER}>
                                                                {Enums.TWITTER}
                                                            </option>
                                                        </Field>
                                                    </FormControl>
                                                </GridItem>

                                                <GridItem colSpan={{ base: 1, xl: 2 }}>
                                                    <FormControl mb="16px">
                                                        <FormLabel
                                                            ms="4px"
                                                            fontSize="md"
                                                            fontWeight="bold"
                                                        >
                                                            User
                                                        </FormLabel>

                                                        <Field
                                                            as={Input}
                                                            size="lg"
                                                            name="user"
                                                            type="text"
                                                            variant="auth"
                                                            placeholder="Wallet / Discord User abc#1234 / Twitter User"
                                                        />
                                                    </FormControl>
                                                </GridItem>
                                            </SimpleGrid>

                                            <Button
                                                w={{ base: "150px" }}
                                                my="16px"
                                                type="submit"
                                                colorScheme="teal"
                                                size="lg"
                                                fontWeight="semibold"
                                                fontSize="18px"
                                                // isLoading={isQuerying}
                                                // disabled={getButtonState(values)}
                                            >
                                                Search
                                            </Button>
                                        </AdminCard>
                                    </Box>
                                </Flex>
                            </Form>
                        </Box>
                    );
                }}
            </Formik>
        </>
    );
};

//     data = (
//         <Flex align="center">
//             {cell.value.map((r, index) => {
//                 return (
//                     <>
//                         {index !== 0 && ","}
//                         <Text
//                             // color={textColor}
//                             fontSize="sm"
//                             fontWeight="700"
//                             key={index}
//                             ms="2"
//                         >
//                             {r.rewardType.reward} (
//                             {r.quantity})
//                         </Text>
//                     </>
//                 );
//             })}
//         </Flex>
//     );

{
    /*      need to redo this as another function*/
}
{
    /* <div className="d-flex ">
                  <a
                      href={`data:text/csv;charset=utf-8,${encodeURIComponent(
                          BuildCsv(tableData)
                      )}`}
                      download={`Search - ${new Date().toISOString()}.csv`}
                      className="me-2"
                  >
                      Export as CSV
                  </a>

                  <a
                      href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                          JSON.stringify(tableData)
                      )}`}
                      download={`Search - ${new Date().toISOString()}.json`}
                      className="me-2"
                  >
                      Export as Json
                  </a>
                  <div className="text-green-600 font-bold">
                      Search Results: {tableData?.length}
                  </div>
              </div> */
}
