import React, { useEffect, useState, useCallback, useMemo } from "react";
import { ErrorMessage, Field, Form, Formik, FieldArray, getIn } from "formik";
import { object, array, string, number, ref } from "yup";
// import useTable from "@hooks/useTable";
import TableFooter from "../../elements/Table/TableFooter";
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
} from "@chakra-ui/react";

import { ArrowRightIcon, ArrowLeftIcon, ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";

import AdminCard from "../../../chakra/card/AdminCard";

import { useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";

export default function AdminUserStatsSearch() {
    const [formData, setFormData] = useState(null);

    const onFormSubmit = (data) => {
        setFormData(data);
    };
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
            <UserStatsSearchForm onFormSubmit={onFormSubmit} />
            {formData && <UserStatsSearchResult formData={formData} />}
        </Flex>
    );
}

const UserStatsSearchForm = ({ onFormSubmit }) => {
    const initialValues = {
        contract: "",
        wallet: "",
        chainId: "eth",
    };

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

function UserStatsSearchResult({ formData }) {
    // const { data, error } = useSWR([USER_STATS_SEARCH, formData], fetcher);
    const [apiError, setApiError] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const getNftOwners = useCallback(async (formData) => {
        let cursor = "";
        let nftOwners = [];
        do {
            let contractQuery = await axios
                .get(
                    `/api/admin/user-stats/contract/${formData.contract.trim()}/${
                        formData.chainId
                    }/${cursor}`,
                    formData
                )
                .then((r) => r.data);

            for (const nft of contractQuery.result) {
                nftOwners = [...nftOwners, nft];
            }

            cursor = contractQuery?.cursor;

            sleep();
        } while (cursor != null && cursor != "");

        return nftOwners;
    });

    useEffect(async () => {
        setIsLoading(true);
        let data = [];
        console.time();
        try {
            if (formData.contract.trim().length === 0 && formData.wallet.trim().length > 0) {
                console.log("searching individual");
                let res = await axios
                    .get(`/api/admin/user-stats/${formData.wallet}/${formData.chainId}`)
                    .then((r) => r.data);

                data = [...data, res];
            }
            if (formData.contract.trim().length > 0) {
                /* searching contract*/
                let nftOwners = await getNftOwners(formData);

                if (formData.wallet.trim().length > 0) {
                    /* searching contract and individual */
                    let walletOwners = nftOwners.map((nft) => utils.getAddress(nft.owner_of));

                    if (walletOwners.includes(utils.getAddress(formData.wallet))) {
                        /* this is just searching individual, as it exists on the contract nft */
                        let res = await axios
                            .get(`/api/admin/user-stats/${formData.wallet}/${formData.chainId}`)
                            .then((r) => r.data);

                        data = [...data, res];
                    } else {
                        data = [];
                    }
                } else {
                    let walletOwners = nftOwners.map((nft) => utils.getAddress(nft.owner_of));
                    walletOwners = remove_duplicates_es6(walletOwners);

                    let searchRes = {};

                    searchRes = await axios
                        .post(`/api/admin/user-stats/wallets`, { walletOwners })
                        .then((r) => r.data);

                    data = [...data, ...searchRes.users];
                }
            }
            if (formData.contract.trim().length === 0 && formData.wallet.trim().length === 0) {
                // searching everyone in the database
                let page = 0,
                    searchRes = {};

                do {
                    searchRes = await axios.post(`/api/admin/user-stats?page=${page}`, formData);

                    data = [...data, ...searchRes.data.users];
                    page = page + 1;
                } while (searchRes?.data?.shouldContinue);
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
        console.timeEnd();
        setTableData(data);
        setIsLoading(false);
    }, [formData]);

    if (apiError) {
        return <div>API Error: {apiError}</div>;
    }
    if (!tableData || isLoading) return <div>Loading...</div>;
    // console.log(tableData);
    return (
        <>
            {/* <div className="card-header px-0">
                <h4 className=" mb-0">Result</h4>
                <div className="d-flex ">
                    {/* <a
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
                </div>
            </div> */}
            {tableData?.length > 0 && (
                <ResultTable data={tableData} rowsPerPage={10} setTableData={setTableData} />
            )}
        </>
    );
}

const ResultTable = ({ data, rowsPerPage, setTableData }) => {
    // const [page, setPage] = useState(1);
    // const { slice, range } = useTable(data, page, rowsPerPage);
    const [sortField, setSortField] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");

    const handleSortChange = (accessor) => {
        const newOrder = accessor === sortField && sortOrder === "asc" ? "desc" : "asc";
        setSortField(accessor);
        setSortOrder(newOrder);
        handleSorting(accessor, newOrder, data);
    };

    console.log(data);

    const columnData = [
        {
            Header: "WALLET",
            accessor: "wallet",
        },
        {
            Header: "TWITTER",
            accessor: "twitter",
        },
        {
            Header: "DISCORD",
            accessor: "discord",
        },
        {
            Header: "FOLLOWERS",
            accessor: "follower",
        },
        {
            Header: "BALANCE",
            accessor: "balance",
        },
    ];
    const columns = useMemo(() => columnData, [columnData]);
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
    } = tableInstance;

    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

    return (
        <Box w="100%">
            <h4 className="card-title mb-3">Result</h4>
            <AdminCard>
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
                            console.log(row);
                            prepareRow(row);
                            return (
                                <Tr {...row.getRowProps()} key={index}>
                                    {row.cells.map((cell, index) => {
                                        let data = "";
                                        // if (cell.column.Header === "NAME") {
                                        //   data = (
                                        //     <Flex align='center'>
                                        //       <Text color={textColor} fontSize='sm' fontWeight='700'>
                                        //         {cell.value}
                                        //       </Text>
                                        //     </Flex>
                                        //   );
                                        // } else if (cell.column.Header === "PROGRESS") {
                                        //   data = (
                                        //     <Flex align='center'>
                                        //       <Text
                                        //         me='10px'
                                        //         color={textColor}
                                        //         fontSize='sm'
                                        //         fontWeight='700'>
                                        //         {cell.value}%
                                        //       </Text>
                                        //     </Flex>
                                        //   );
                                        // } else if (cell.column.Header === "QUANTITY") {
                                        //   data = (
                                        //     <Text color={textColor} fontSize='sm' fontWeight='700'>
                                        //       {cell.value}
                                        //     </Text>
                                        //   );
                                        // } else if (cell.column.Header === "DATE") {
                                        //   data = (
                                        //     <Text color={textColor} fontSize='sm' fontWeight='700'>
                                        //       {cell.value}
                                        //     </Text>
                                        //   );
                                        // }
                                        data = cell.value;
                                        return (
                                            <Td
                                                {...cell.getCellProps()}
                                                key={index}
                                                fontSize={{ sm: "14px" }}
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

                {pageOptions.length > 1 && (
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
                                <NumberInputField />
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
                )}

                {/* <TableFooter range={range} slice={slice} setPage={setPage} page={page} /> */}
            </AdminCard>
        </Box>
    );
};

function remove_duplicates_es6(arr) {
    let s = new Set(arr);
    let it = s.values();
    return Array.from(it);
}
