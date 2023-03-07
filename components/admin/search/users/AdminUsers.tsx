import React, { useEffect, useState, useCallback, useMemo, useContext, HTMLProps } from "react";
import { Field, Form, Formik } from "formik";
import { object } from "yup";

import {
    Heading,
    Box,
    Flex,
    Text,
    Button,
    useColorMode,
    useColorModeValue,
    SimpleGrid,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
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
    Icon,
    useToast,
    ButtonGroup,
    Avatar,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
} from "@chakra-ui/react";

import { AdminBanner, AdminCard } from "@components/shared/Card";
import { useGlobalFilter, usePagination, useSortBy, useTable, useRowSelect } from "react-table";
import { BsFilter } from "react-icons/bs";
import { FaCopy, FaDownload, FaFileCsv } from "react-icons/fa";

import { shortenAddress } from "util/shortenAddress";

import Loading from "@components/shared/LoadingContainer/Loading";

import TablePagination from "./TablePagination";
import RightSideBar from "@components/shared/RightSideBar";

import {
    DiscordIcon,
    EmailIcon,
    GoogleIcon,
    TransparentDiscordIcon,
    TransparentEmailIcon,
    TransparentGoogleIcon,
    TransparentTwiterIcon,
    TransparentWalletIcon,
    TwitterIcon,
    WalletIcon,
} from "@components/shared/Icons";
import { AiOutlineUser } from "react-icons/ai";
import { FaEllipsisH } from "react-icons/fa";
import moment from "moment";
import AdminUserInfo from "./AdminUserInfo";
import FilterUsersSidebar from "./FilterUsersSidebar";
import { downloadCsv } from "./helper";

import type Prisma from "@prisma/client";
import { UsersContext } from "@context/UsersContext";
import { ChevronDownIcon } from "@chakra-ui/icons";
import axios from "axios";
import Enums from "@enums/index";

interface UsersBannerProps {
    downloadCsv?: () => void;
}
const UsersBanner = ({ downloadCsv }: UsersBannerProps) => {
    const { allUsers, filterSidebar } = useContext(UsersContext);
    return (
        <AdminBanner>
            <Flex
                mb={{ sm: "10px", md: "0px" }}
                w={"100%"}
                textAlign={{ base: "start" }}
                justifyContent="space-between"
            >
                <Flex direction="column" maxWidth="100%" my={{ base: "14px" }} gap="1rem">
                    {allUsers && (
                        <Heading
                            fontSize={{ base: "lg", lg: "3xl" }}
                            color={"white"}
                            fontWeight="700"
                        >
                            {allUsers.length} Users on Riftly
                        </Heading>
                    )}
                    <Text fontSize={"lg"} color={"white"} fontWeight="400">
                        Last updated: {moment(new Date()).format("MMM dd, hh:mm A")}{" "}
                        {new Date()
                            .toLocaleDateString(undefined, {
                                day: "2-digit",
                                timeZoneName: "short",
                            })
                            .substring(4)}
                    </Text>
                </Flex>
                <ButtonGroup
                    h="100%"
                    alignItems={"center"}
                    alignSelf="flex-end"
                    gap="1rem"
                    size="md"
                    fontWeight="semibold"
                    fontSize="lg"
                >
                    <Button
                        variant="outline"
                        leftIcon={
                            <Icon
                                transition="0.8s"
                                color="green.400"
                                boxSize={7}
                                as={FaFileCsv}
                                _hover={{
                                    cursor: "pointer",
                                }}
                            />
                        }
                        onClick={downloadCsv}
                    >
                        CSV
                    </Button>
                    <Button
                        variant="outline"
                        leftIcon={<BsFilter color="white" />}
                        onClick={filterSidebar.onOpen}
                    >
                        Filter Users
                    </Button>
                </ButtonGroup>
            </Flex>
        </AdminBanner>
    );
};

export default function AdminUsers() {
    const { isLoadingUserStats, filterUsers } = useContext(UsersContext);

    return (
        <Flex
            flexDirection={{
                base: "column",
            }}
            w="100%"
            h="100%"
            justifyContent="center"
            gap="20px"
        >
            {isLoadingUserStats && <Loading />}
            {filterUsers && <ResultTable data={filterUsers} />}
        </Flex>
    );
}

const ResultTable = ({ data }) => {
    const { filterSidebar, userSidebar, userDetails, viewUserDetails } = useContext(UsersContext);

    const columns = useMemo(
        () => columnData,
        [
            // columnData
        ]
    );
    const tableData = useMemo(() => data, [data]);

    const tableInstance = useTable(
        {
            columns,
            data: tableData,
            initialState: { pageSize: 10 },
        },
        useGlobalFilter,
        useSortBy,
        usePagination,
        useRowSelect,
        (hooks) => {
            hooks.visibleColumns.push((columns) => [
                // Let's make a column for selection
                {
                    id: "selection",
                    // The header can use the table's getToggleAllRowsSelectedProps method
                    // to render a checkbox
                    Header: ({
                        isAllRowsSelected,
                        toggleAllRowsSelected,
                        getToggleAllRowsSelectedProps,
                        selectedFlatRows,
                    }) => {
                        return (
                            // <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                            //    <Button
                            //     onClick={() => {
                            //         toggleAllRowsSelected(isAllRowsSelected ? false : true);
                            //     }}
                            // ></Button>

                            <Menu>
                                <MenuButton
                                    as={Button}
                                    variant="blue"
                                    size="sm"
                                    pe="0.2rem"
                                    ps="0.2rem"
                                    h="32px"
                                    w="95px"
                                    fontSize="sm"
                                    fontWeight="400"
                                    color={"white"}
                                    borderRadius="48px"
                                >
                                    <ChevronDownIcon w="6" h="5" />
                                    Actions
                                </MenuButton>
                                <MenuList>
                                    <MenuItem
                                        onClick={() => {
                                            toggleAllRowsSelected(isAllRowsSelected ? false : true);
                                        }}
                                    >
                                        Toogle Select
                                    </MenuItem>
                                    <MenuItem
                                        isDisabled={selectedFlatRows.length === 0}
                                        onClick={async () => {
                                            const selectedRows = selectedFlatRows
                                                .filter((r) => {
                                                    let whiteListUserData =
                                                        r.original.whiteListUserData;
                                                    if (whiteListUserData) {
                                                        let { lastEthUpdated, eth } =
                                                            whiteListUserData;
                                                        if (lastEthUpdated) {
                                                            let hourPast = moment(new Date()).diff(
                                                                moment(lastEthUpdated),
                                                                "hours",
                                                                false
                                                            );

                                                            if (eth < 0.02 && hourPast > 96) {
                                                                // if the last time is 0, may not need to update again, using a diffent route to update all
                                                                return true;
                                                            }
                                                            if (eth < 0.02 && hourPast < 96) {
                                                                return false;
                                                            }

                                                            if (hourPast < 12) {
                                                                console.log(
                                                                    "Not selecting this row as the data too current"
                                                                );
                                                                return false;
                                                            }
                                                        }
                                                    }
                                                    if (r?.original?.wallet?.length > 0) {
                                                        return true;
                                                    }
                                                    return false;
                                                })
                                                .map((r) => {
                                                    return {
                                                        wallet: r.original.wallet,
                                                        userId: r.original.userId,
                                                    };
                                                });
                                            if (
                                                selectedFlatRows.length > 0 &&
                                                selectedRows.length === 0
                                            ) {
                                                return alert(`No operation as data just updated.`);
                                            }

                                            if (
                                                selectedRows.length >= 100 &&
                                                !confirm(
                                                    `Performing on large dataset of ${selectedRows.length} rows?`
                                                )
                                            ) {
                                                return;
                                            }

                                            if (selectedRows.length > 0) {
                                                let skip = Enums.UPDATE_SKIP;

                                                let chunkSplit = [];

                                                for (
                                                    let i = 0;
                                                    i < selectedRows.length;
                                                    i += skip
                                                ) {
                                                    chunkSplit = [
                                                        ...chunkSplit,
                                                        selectedRows.slice(i, i + skip),
                                                    ];
                                                }

                                                for (let chunk of chunkSplit) {
                                                    let payload = { selectedRows: chunk };
                                                    console.log(payload);

                                                    await axios
                                                        .post(
                                                            `/api/admin/user/update-users-eth`,
                                                            payload
                                                        )
                                                        .then((r) => r.data);
                                                }
                                            }
                                        }}
                                    >
                                        Update ETH
                                    </MenuItem>
                                    <MenuItem
                                        isDisabled={selectedFlatRows.length === 0}
                                        onClick={async () => {
                                            const selectedRows = selectedFlatRows
                                                .filter((r) => {
                                                    let whiteListUserData =
                                                        r.original.whiteListUserData;

                                                    if (whiteListUserData) {
                                                        let { lastFollowersUpdated, followers } =
                                                            whiteListUserData;
                                                        if (lastFollowersUpdated) {
                                                            let hourPast = moment(new Date()).diff(
                                                                moment(lastFollowersUpdated),
                                                                "hours",
                                                                false
                                                            );
                                                            if (followers === 0 && hourPast > 96) {
                                                                // if the last time is 0, may not need to update again, using a diffent route to update all
                                                                return true;
                                                            }
                                                            if (followers === 0 && hourPast < 96) {
                                                                return false;
                                                            }

                                                            if (hourPast < 24) {
                                                                console.log(
                                                                    "Not selecting this row as the data too current"
                                                                );
                                                                return false;
                                                            }
                                                        }
                                                    }
                                                    if (r?.original?.twitterId?.length > 0) {
                                                        return true;
                                                    }
                                                    return false;
                                                })
                                                .map((r) => {
                                                    return {
                                                        twitterId: r.original.twitterId,
                                                        userId: r.original.userId,
                                                    };
                                                });

                                            if (
                                                selectedFlatRows.length > 0 &&
                                                selectedRows.length === 0
                                            ) {
                                                return alert(`No operation as data just updated.`);
                                            }

                                            if (
                                                selectedRows.length > 0 &&
                                                confirm(
                                                    `Performing on large dataset of ${selectedRows.length} rows?`
                                                )
                                            ) {
                                                let skip = Enums.UPDATE_SKIP;

                                                let chunkSplit = [];

                                                for (
                                                    let i = 0;
                                                    i < selectedRows.length;
                                                    i += skip
                                                ) {
                                                    chunkSplit = [
                                                        ...chunkSplit,
                                                        selectedRows.slice(i, i + skip),
                                                    ];
                                                }

                                                for (let chunk of chunkSplit) {
                                                    let payload = { selectedRows: chunk };
                                                    console.log(payload);

                                                    await axios.post(
                                                        `/api/admin/user/update-users-followers`,
                                                        payload
                                                    );
                                                }
                                            }
                                        }}
                                    >
                                        Update Followers
                                    </MenuItem>
                                    <MenuItem isDisabled={true} onClick={() => {}}>
                                        placeholder
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        );
                    },
                    // The cell can use the individual row's getToggleRowSelectedProps method
                    // to the render a checkbox
                    Cell: ({ row }) => (
                        <div>
                            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                        </div>
                    ),
                },
                ...columns,
            ]);
        }
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        rows, //this give filtered rows
        prepareRow,
        selectedFlatRows,
        state: { pageIndex, pageSize, selectedRowIds },
    } = tableInstance;

    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

    const getRowProps = (row) => ({
        style: {
            background: "rgba(47, 78, 109, 0.5)",
            borderRadius: "20px",
        },
    });

    return (
        <Flex
            flexDirection={{
                base: "column",
            }}
            w="100%"
            h="100%"
            justifyContent="center"
            gap="20px"
        >
            <RightSideBar
                isOpen={filterSidebar.isOpen}
                onClose={filterSidebar.onClose}
                title="Filter Users"
            >
                <FilterUsersSidebar />
            </RightSideBar>
            <RightSideBar
                isOpen={userSidebar.isOpen}
                onClose={userSidebar.onClose}
                title="User Info"
            >
                <AdminUserInfo userDetails={userDetails} />
            </RightSideBar>
            <UsersBanner
                downloadCsv={() => {
                    let jsonData = rows.map((row) => {
                        prepareRow(row);

                        return row.original;
                    });

                    downloadCsv(jsonData);
                }}
            />
            <Box w="100%" mb="2rem">
                <AdminCard>
                    <Table
                        variant="simple"
                        style={{
                            borderCollapse: "separate",
                            borderSpacing: "0 1em",
                        }}
                    >
                        <Thead>
                            {headerGroups.map((headerGroup, index) => (
                                <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                                    {headerGroup.headers.map((column, index) => {
                                        // console.log(column);
                                        if (column.id === "selection") {
                                            return (
                                                <Th
                                                    {...column.getHeaderProps(
                                                        column.getSortByToggleProps()
                                                    )}
                                                    p="0"
                                                    key={index}
                                                >
                                                    {column.render("Header")}
                                                </Th>
                                            );
                                        }
                                        return (
                                            <Th
                                                {...column.getHeaderProps(
                                                    column.getSortByToggleProps()
                                                )}
                                                key={index}
                                                borderColor={borderColor}
                                                pe="0.25rem"
                                                ps="0.25rem"
                                            >
                                                {!column?.hideHeader && (
                                                    <Flex
                                                        align="center"
                                                        fontSize={{ sm: "8px", lg: "14px" }}
                                                        color="gray.400"
                                                        gap="8px"
                                                        fontWeight={"400"}
                                                    >
                                                        {column.render("Header")}

                                                        {column.isSorted &&
                                                            !column.isSortedDesc && <span>▼</span>}
                                                        {column.isSorted && column.isSortedDesc && (
                                                            <span>▲</span>
                                                        )}
                                                    </Flex>
                                                )}
                                            </Th>
                                        );
                                    })}
                                </Tr>
                            ))}
                        </Thead>
                        <Tbody {...getTableBodyProps()} gap="12px">
                            {page.map((row, index) => {
                                prepareRow(row);

                                return (
                                    <Tr {...row.getRowProps(getRowProps(row))} key={index}>
                                        {row.cells.map((cell, index) => {
                                            let data: any;

                                            if (cell.column.id === "selection") {
                                                return (
                                                    <Td
                                                        {...cell.getCellProps()}
                                                        border="1px solid transparent"
                                                        borderLeftRadius="20px"
                                                        pe={"0.5rem"}
                                                    >
                                                        {cell.render("Cell")}
                                                    </Td>
                                                );
                                            }

                                            data = getCellValue(cell, viewUserDetails);

                                            return (
                                                <Td
                                                    {...cell.getCellProps()}
                                                    key={index}
                                                    fontSize={{ sm: "14px" }}
                                                    maxW={{ sm: "150px", md: "200px", lg: "200px" }}
                                                    border="1px solid transparent"
                                                    borderLeftRadius={`${
                                                        index === 0 ? "20px" : "0px"
                                                    }`}
                                                    borderRightRadius={`${
                                                        index === row.cells.length - 1
                                                            ? "20px"
                                                            : "0px"
                                                    }`}
                                                    pe={"0.25rem"}
                                                    ps={"0.25rem"}
                                                >
                                                    {data}
                                                    {/* {cell.render("Cell")} */}
                                                </Td>
                                            );
                                        })}
                                    </Tr>
                                );
                            })}
                        </Tbody>
                    </Table>
                    <Flex>
                        {tableInstance?.pageOptions?.length > 0 && (
                            <TablePagination tableInstance={tableInstance} />
                        )}
                    </Flex>
                </AdminCard>
            </Box>
        </Flex>
    );
};

const getUsername = (userObj: Prisma.WhiteList) => {
    const { email, discordUserDiscriminator, twitterUserName, wallet, avatar } = userObj;

    return (
        <Flex alignItems={"center"} gap={{ base: "8px", lg: "1rem" }}>
            <Box>
                <Avatar
                    size="sm"
                    bg="rgba(47, 78, 109, 1)"
                    icon={<AiOutlineUser fontSize="1.25rem" color="rgba(19, 36, 54, 1)" />}
                    src={avatar}
                />
            </Box>
            <Heading color="white" fontSize={"md"} maxWidth="120px" isTruncated>
                {shortenAddress(wallet)}
            </Heading>
        </Flex>
    );
};

const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    const {checked, onChange} = rest;
    return (
        <>
            {/* <input type="checkbox" ref={resolvedRef} {...rest} /> */}
            <Checkbox ref={resolvedRef} isChecked={checked} onChange={onChange}/>
        </>
    );
});

// this being here to manipulat the style, sometimes in ancessor its impossible to return the
// value straightaway for sorting purpose
const getCellValue = (cell, viewUserDetails) => {
    const { userId, wallet } = cell.row.original;
    switch (cell.column.Header) {
        case "TIER":
            return (
                <Text color="white" fontSize={"lg"}>
                    5
                </Text>
            );
        case "LAST ACTIVE":
            if (cell.value < 24) {
                return (
                    <Text color="green.300" fontSize={"lg"}>
                        {cell.value} hrs
                    </Text>
                );
            }

            if (cell.value === 24) {
                return (
                    <Text color="green.300" fontSize={"lg"}>
                        1 day
                    </Text>
                );
            }
            let day = Math.floor(cell.value / 24);
            let color = day <= 4 ? "orange.300" : "red.300";
            return (
                <Text color={color} fontSize={"lg"}>
                    {Math.floor(cell.value / 24)} days
                </Text>
            );

        case "ACTION":
            return (
                <Box>
                    <Menu>
                        <MenuButton>
                            <Icon
                                as={FaEllipsisH}
                                boxSize={{ base: 4, lg: 6 }}
                                cursor="pointer"
                                color="brand.neutral1"
                            />
                        </MenuButton>

                        <MenuList>
                            <MenuItem onClick={() => viewUserDetails(cell.row.original)}>
                                User Details
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
            );

        case "USER":
            return getUsername(cell.row.original);
        case "CONNECTIONS":
            const { email, discordUserDiscriminator, twitterUserName, wallet, google } =
                cell.row.original;
            return (
                <Flex gap={{ base: "5px", lg: "8px" }}>
                    <Box boxSize={"18px"}>
                        {email && <EmailIcon />}
                        {!email && <TransparentEmailIcon />}
                    </Box>
                    <Box boxSize={"18px"}>
                        {google && <GoogleIcon />}
                        {!google && <TransparentGoogleIcon />}
                    </Box>
                    <Box boxSize={"18px"}>
                        {discordUserDiscriminator && <DiscordIcon />}
                        {!discordUserDiscriminator && <TransparentDiscordIcon />}
                    </Box>
                    <Box boxSize={"18px"}>
                        {twitterUserName && <TwitterIcon />}
                        {!twitterUserName && <TransparentTwiterIcon />}
                    </Box>
                    <Box boxSize={"18px"}>
                        {wallet && <WalletIcon />}
                        {!wallet && <TransparentWalletIcon />}
                    </Box>
                </Flex>
            );
        default:
            let value = cell.value;
            if (typeof cell.value === "number") {
                value = value.toLocaleString("en-US");
            }
            return (
                <Text color="white" fontSize={"lg"}>
                    {value}
                </Text>
            );
    }
};
const columnData = [
    {
        Header: "USER",
        accessor: "user",
        disableSortBy: true,
    },
    {
        Header: "TIER",
        accessor: "tier",
    },
    {
        Header: "POINTS",
        accessor: (row) => {
            let rewardValue = row?.rewards?.find((e) => e?.rewardType?.reward === "Points");
            return rewardValue?.quantity; //?.toLocaleString("en-US") || 0;
        },
    },
    {
        Header: "LAST ACTIVE",
        accessor: (row) => {
          
            let lastFinishedQuestDaytime = row?.userQuest[0]?.updatedAt || row?.updatedAt;
            let dayPast = moment(new Date()).diff(moment(lastFinishedQuestDaytime), "days", false);
            let hourPast = moment(new Date()).diff(
                moment(lastFinishedQuestDaytime),
                "hours",
                false
            );

            return hourPast; // manipulate later
        },
    },
    {
        Header: "CONNECTIONS",
        accessor: "connections",
        disableSortBy: true,
    },
    {
        Header: "FOLLOWERS",
        accessor: (row) => row?.whiteListUserData?.followers || 0,
    },
    {
        Header: "NET WORTH",
        accessor: (row) => row?.whiteListUserData?.eth || 0,
    },
    {
        Header: "ACTION",
        accessor: "action",
        disableSortBy: true,
        hideHeader: true,
    },
];

const customFilterRewardsRange = (rows, id, filterValue) => {
    if (filterValue?.minQty > 0) {
        return rows.filter(
            (row) =>
                row.original[id] >= filterValue.minQty && row.original[id] <= filterValue.maxQty
        );
    }
    return rows;
};
