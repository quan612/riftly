import React, { useEffect, useState, useCallback, useMemo } from "react";
import { ErrorMessage, Field, Form, Formik, FieldArray, getIn } from "formik";
import { object, array, string, number, ref } from "yup";
import { utils } from "ethers";
import axios from "axios";

function sleep(ms = 500) {
    return new Promise((res) => setTimeout(res, ms));
}

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
    Icon,
    useToast,
    ButtonGroup,
} from "@chakra-ui/react";

import { ArrowRightIcon, ArrowLeftIcon, ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import AdminCard from "../../../riftly/card/AdminCard";
import { useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";
import { BiRefresh } from "react-icons/bi";
import { BsFilter } from "react-icons/bs";
import { FaCopy, FaDownload, FaFileCsv } from "react-icons/fa";
import { VscJson } from "react-icons/vsc";
import { useAdminRefreshUserStats, useAdminUserStatsQuery } from "@shared/HOC/user";
import { shortenAddress } from "@utils/shortenAddress";
import { useCopyToClipboard } from "usehooks-ts";
import XLSX from "xlsx";

export default function AdminUserStatsSearch() {
    const [tableData, setTableData] = useState(null);

    const [userStats, isLoadingUserStats] = useAdminUserStatsQuery();

    const [filterObj, filterObjSet] = useState({
        contract: "",
        wallet: "",
        chainId: "eth",
    });

    useEffect(async () => {
        if (userStats) {
            let filterResult = [...userStats];
            const { contract, chainId, wallet } = filterObj;
            if (contract.trim().length > 0) {
                let owners = await getNftOwners(utils.getAddress(contract), chainId);
                filterResult = filterResult.filter((w) => owners.includes(w.wallet));
            }
            if (wallet.trim().length > 0) {
                filterResult = filterResult.filter((w) => w.wallet === wallet);
            }

            setTableData(filterResult);
        }
    }, [userStats, filterObj]);

    const getNftOwners = useCallback(async (contract, chainId) => {
        let cursor = "";
        let nftOwners = [];
        do {
            let contractQuery = await axios
                .get(`/api/admin/user-stats/contract/${contract.trim()}/${chainId}/${cursor}`)
                .then((r) => r.data);

            for (const nft of contractQuery.result) {
                nftOwners = [...nftOwners, nft];
            }

            cursor = contractQuery?.cursor;

            sleep();
            break;
        } while (cursor != null && cursor != "");

        return nftOwners.map((r) => r.owner_of);
    });

    return (
        <Flex
            flexDirection={{
                base: "column",
            }}
            w="100%"
            h="100%"
            justifyContent="center"
            gap="1%"
        >
            <UserStatsSearchForm
                filterObj={filterObj}
                onFormSubmit={(formData) => filterObjSet(formData)}
            />
            {tableData && (
                <ResultTable data={tableData} rowsPerPage={10} setTableData={setTableData} />
            )}
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

const ResultTable = ({ data, rowsPerPage, setTableData }) => {
    const [userStats, isQuerying, refreshUserStatsAsync] = useAdminRefreshUserStats();
    const toast = useToast();
    const [value, copy] = useCopyToClipboard();

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
        initialState,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
        rows, //this give filtered rows
    } = tableInstance;

    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

    return (
        <Box w="100%">
            <AdminCard>
                <Flex>
                    <ButtonGroup spacing="6" mb="15px">
                        <Button
                            leftIcon={<BsFilter />}
                            // onClick={openFilterSidebar}
                            variant="outline"
                            size="sm"
                            fontWeight="semibold"
                            fontSize="16px"
                        >
                            Filter
                        </Button>

                        <Icon
                            transition="0.8s"
                            color="green.400"
                            boxSize={7}
                            as={FaFileCsv}
                            _hover={{
                                cursor: "pointer",
                            }}
                            onClick={async () => {
                                let jsonData = rows.map((row) => {
                                    prepareRow(row);

                                    return row.original;
                                });

                                jsonData = jsonData.map((r) => {
                                    r.follower = r.whiteListUserData?.data?.followers_count;
                                    r.balance = r.whiteListUserData?.data?.eth;

                                    delete r.whiteListUserData;
                                    delete r.userId;
                                    return r;
                                });
                                const wb = XLSX.utils.book_new();
                                const ws = XLSX.utils.json_to_sheet(jsonData);
                                XLSX.utils.book_append_sheet(wb, ws, "test");
                                XLSX.writeFile(wb, "Riftly_User_Search.csv");
                            }}
                        />

                        <Icon
                            transition="0.8s"
                            color="yellow.400"
                            boxSize={7}
                            as={VscJson}
                            _hover={{
                                cursor: "pointer",
                            }}
                            onClick={async () => {
                                let jsonData = rows.map((row) => {
                                    prepareRow(row);

                                    return row.original;
                                });

                                jsonData = jsonData.map((r) => {
                                    r.follower = r.whiteListUserData?.data?.followers_count;
                                    r.balance = r.whiteListUserData?.data?.eth;

                                    delete r.whiteListUserData;
                                    delete r.userId;
                                    return r;
                                });
                                const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
                                    JSON.stringify(jsonData)
                                )}`;
                                const link = document.createElement("a");
                                link.href = jsonString;
                                link.download = "Riftly User Search.json";

                                link.click();
                            }}
                        />
                    </ButtonGroup>
                </Flex>
                <Flex>
                    {tableInstance.pageOptions.length > 0 && (
                        <TablePagination tableInstance={tableInstance} />
                    )}
                </Flex>
                <Table variant="simple">
                    <Thead>
                        {headerGroups.map((headerGroup, index) => (
                            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                                {headerGroup.headers.map((column, index) => (
                                    <Th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        pe="8px"
                                        key={index}
                                        borderColor={borderColor}
                                    >
                                        <Flex
                                            justify="space-between"
                                            align="center"
                                            fontSize={{ sm: "8px", lg: "15px" }}
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

                                        const { userId, wallet } = cell.row.original;
                                        data = cell.value;
                                        if (cell.column.Header === "TWITTER FOLLOWERS") {
                                            data =
                                                cell.row.original.whiteListUserData?.data
                                                    ?.followers_count;
                                        } else if (cell.column.Header === "BALANCE (ETH)") {
                                            data = cell.row.original.whiteListUserData?.data?.eth;
                                        } else if (cell.column.Header === "Action") {
                                            data = (
                                                <Flex gap="3px">
                                                    <Icon
                                                        transition="0.8s"
                                                        color="green.300"
                                                        boxSize={7}
                                                        as={BiRefresh}
                                                        _hover={{
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={async () => {
                                                            let payload = {
                                                                userId,
                                                            };

                                                            await refreshUserStatsAsync(payload);
                                                        }}
                                                    />

                                                    <Icon
                                                        transition="0.8s"
                                                        color="blue.300"
                                                        boxSize={6}
                                                        as={FaCopy}
                                                        _hover={{
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() => {
                                                            if (wallet.length > 16) {
                                                                copy(wallet);
                                                                toast({
                                                                    description: `Copy wallet ${wallet}`,
                                                                    position: "bottom-right",

                                                                    duration: 2000,
                                                                });
                                                            }
                                                        }}
                                                    />
                                                </Flex>
                                            );
                                        } else if (cell.column.Header === "WALLET") {
                                            data = (
                                                <Tooltip label={cell.value} placement="top">
                                                    <Text
                                                        color="white"
                                                        fontSize={"sm"}
                                                        maxWidth="100px"
                                                    >
                                                        {cell.value.length > 0 &&
                                                            shortenAddress(cell.value)}
                                                    </Text>
                                                </Tooltip>
                                            );
                                        } else {
                                            data = cell.value;
                                        }
                                        return (
                                            <Td
                                                {...cell.getCellProps()}
                                                key={index}
                                                fontSize={{ sm: "14px" }}
                                                minW={{ sm: "150px", md: "200px", lg: "auto" }}
                                                borderColor="transparent"
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

                {/* {pageOptions.length > 1 && (
                    <Flex justifyContent="space-between" m={4} alignItems="center">
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
                                <NumberInputField color={"white"} />
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
                                {[10, 20, 30, 40, 50].map((pageSize) => (
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
                )} */}
            </AdminCard>
        </Box>
    );
};

function remove_duplicates_es6(arr) {
    let s = new Set(arr);
    let it = s.values();
    return Array.from(it);
}
const columnData = [
    {
        Header: "WALLET",
        accessor: "wallet",
    },
    {
        Header: "TWITTER",
        accessor: "twitterUserName",
    },
    {
        Header: "DISCORD",
        accessor: "discordUserDiscriminator",
    },
    {
        Header: "TWITTER FOLLOWERS",
        accessor: "follower",
    },
    {
        Header: "BALANCE (ETH)",
        accessor: "balance",
    },
    {
        Header: "Action",
        accessor: "action",
    },
];

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
