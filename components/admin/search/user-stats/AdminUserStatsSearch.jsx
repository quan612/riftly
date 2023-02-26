import React, { useEffect, useState, useCallback, useMemo, useContext } from "react";
import { ErrorMessage, Field, Form, Formik, FieldArray, getIn } from "formik";
import { object, array, string, number, ref } from "yup";
import { utils } from "ethers";

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
import { useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";
import { BsFilter } from "react-icons/bs";
import { FaCopy, FaDownload, FaFileCsv } from "react-icons/fa";

import { shortenAddress } from "@utils/shortenAddress";

import Loading from "@components/shared/LoadingContainer/Loading";

import TablePagination from "./TablePagination";
import RightSideBar from "@components/shared/RightSideBar";
import Enums from "@enums/index";
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
import { AiOutlineUser, AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";
import { FaEllipsisH } from "react-icons/fa";
import moment from "moment";
import AdminUserInfo from "./AdminUserInfo";
import FilterUsersSidebar from "./FilterUsersSidebar";
import { downloadCsv, getNftOwners } from "./helper";
import { UsersContext } from "@context/UsersContext";

const UsersBanner = ({ downloadCsv }) => {
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

export default function AdminUserStatsSearch() {
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

const UserStatsSearchForm = ({ filterObj, onFormSubmit }) => {
    const initialValues = filterObj;
    const chains = ["eth", "polygon", "bsc", "avalance", "fantom"];

    const SearchInfoSchema = object().shape({});
    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={SearchInfoSchema}
                onSubmit={async (fields) => {
                    onFormSubmit(fields);
                }}
                validateOnBlur={false}
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
                                    mb="20px"
                                    mt={{ base: "50px", md: "20px" }}
                                    gap="1%"
                                >
                                    <Box w={{ base: "100%" }} minW="100%">
                                        <AdminCard>
                                            <SimpleGrid
                                                minChildWidth={"300px"}
                                                columns={{ base: 2, md: 2 }}
                                                columnGap={8}
                                                rowGap={4}
                                                w="full"
                                            >
                                                <GridItem colSpan={1}>
                                                    <FormControl mb="24px">
                                                        <FormLabel
                                                            ms="4px"
                                                            fontSize="md"
                                                            fontWeight="bold"
                                                        >
                                                            Contract Address
                                                        </FormLabel>
                                                        <Field
                                                            name="contract"
                                                            type="text"
                                                            as={Input}
                                                            variant={"riftly"}
                                                            fontSize="sm"
                                                        />
                                                    </FormControl>
                                                </GridItem>
                                                <GridItem colSpan={1}>
                                                    <FormControl mb="24px">
                                                        <FormLabel
                                                            ms="4px"
                                                            fontSize="md"
                                                            fontWeight="bold"
                                                        >
                                                            Wallet Address
                                                        </FormLabel>
                                                        <Field
                                                            name="wallet"
                                                            type="text"
                                                            as={Input}
                                                            variant={"riftly"}
                                                        />
                                                    </FormControl>
                                                </GridItem>
                                                <GridItem colSpan={1}>
                                                    <FormControl mb="24px">
                                                        <FormLabel
                                                            ms="4px"
                                                            fontSize="md"
                                                            fontWeight="bold"
                                                        >
                                                            Chain
                                                        </FormLabel>
                                                        <Field name="chainId" as={Select}>
                                                            {chains.map((type, index) => {
                                                                return (
                                                                    <option
                                                                        key={index}
                                                                        value={type}
                                                                    >
                                                                        {type}
                                                                    </option>
                                                                );
                                                            })}
                                                        </Field>
                                                    </FormControl>
                                                </GridItem>
                                            </SimpleGrid>

                                            <Button
                                                w={{ base: "200px" }}
                                                my="12px"
                                                type="submit"
                                                colorScheme="teal"
                                                size="lg"
                                                // isLoading={isSubmitting}
                                                // disabled={isSubmitButtonDisabled(values)}
                                            >
                                                Filter
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
        usePagination
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        state: { pageIndex, pageSize },
        rows, //this give filtered rows
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
                                        return (
                                            <Th
                                                {...column.getHeaderProps(
                                                    column.getSortByToggleProps()
                                                )}
                                                pe="6px"
                                                key={index}
                                                borderColor={borderColor}
                                            >
                                                {!column?.hideHeader && (
                                                    <Flex
                                                        align="center"
                                                        fontSize={{ sm: "8px", lg: "15px" }}
                                                        color="gray.400"
                                                        gap="8px"
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
                                            let data = "";

                                            data = getCellValue(cell, viewUserDetails);

                                            return (
                                                <Td
                                                    {...cell.getCellProps()}
                                                    key={index}
                                                    fontSize={{ sm: "14px" }}
                                                    minW={{ sm: "150px", md: "200px", lg: "auto" }}
                                                    border="1px solid transparent"
                                                    borderLeftRadius={`${
                                                        index === 0 ? "20px" : "0px"
                                                    }`}
                                                    borderRightRadius={`${
                                                        index === row.cells.length - 1
                                                            ? "20px"
                                                            : "0px"
                                                    }`}
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

const getUsername = (userObj) => {
    const { email, discordUserDiscriminator, twitterUserName, wallet, google, avatar } = userObj;

    return (
        <Flex alignItems={"center"} gap={{ base: "8px", lg: "1rem" }}>
            <Box>
                <Avatar
                    size="md"
                    bg="rgba(47, 78, 109, 1)"
                    icon={<AiOutlineUser fontSize="1.75rem" color="rgba(19, 36, 54, 1)" />}
                    src={avatar}
                />
            </Box>
            <Heading color="white" fontSize={"md"} maxWidth="120px" isTruncated>
                {shortenAddress(wallet)}
            </Heading>
        </Flex>
    );
};

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
            let lastFinishedQuestDaytime = row?.userQuest[0]?.updatedAt;
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
        accessor: (row) => row?.whiteListUserData?.data?.followers_count || 0,
    },
    {
        Header: "NET WORTH",
        accessor: (row) => row?.whiteListUserData?.data?.eth || 0,
    },
    {
        Header: "ACTION",
        accessor: "action",
        disableSortBy: true,
        hideHeader: true,
    },
];
