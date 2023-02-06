import React, { useEffect, useState, useContext, useRef } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number, ref } from "yup";

import { useAdminBulkUsersMutation } from "shared/HOC/user";
import Enums from "enums";
import { utils } from "ethers";
import { read, utils as excelUtils } from "xlsx";
import {
    ButtonGroup,
    Icon,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tooltip,
    Tr,
    useToast,
} from "@chakra-ui/react";

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
} from "@chakra-ui/react";

import Card from "@components/riftly/card/Card";

const AdminBulkUsersAdd = () => {
    const bg = useColorModeValue("white", "#1B254B");
    const shadow = useColorModeValue("0px 18px 40px rgba(112, 144, 176, 0.12)", "none");
    const toast = useToast();
    const [newUsersData, isAdding, bulkUsersAsync] = useAdminBulkUsersMutation();
    const [usersArray, usersArraySet] = useState([]);
    const hiddenFileInput = useRef(null);

    const [inputFile, setInputFile] = useState(null);
    const textColor = useColorModeValue("gray.700", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    function handleOnLoadFile(e, setFieldValue) {
        if (!e.target.files[0]) {
            return;
        }
        const reader = new FileReader();

        reader.readAsBinaryString(e.target.files[0]);
        reader.onload = function (onLoadEvent) {
            let data = onLoadEvent.target.result;
            let workbook = read(data, { type: "string", raw: true });

            let currentWorkBook = workbook.Sheets[workbook.SheetNames[0]];

            let arrayData = excelUtils.sheet_to_json(currentWorkBook).map((r) => {
                let value = Object.values(r)[0];
                return { wallet: value, isValid: utils.isAddress(value) };
            });

            usersArraySet(arrayData);
        };
        setInputFile(e.target.files[0]);
    }
    return (
        <Formik
            validateOnBlur={false}
            validateOnChange={false}
            // onSubmit={onSubmit}
        >
            {({ errors, status, touched, setFieldValue }) => (
                <Box w="100%">
                    <Form>
                        <Flex
                            flexDirection={{
                                base: "row",
                            }}
                            w="100%"
                            h="100%"
                            justifyContent="center"
                            mb="60px"
                            mt={{ base: "20px", md: "20px" }}
                            gap="1%"
                        >
                            <Box w={{ base: "100%" }} minW="100%">
                                {/* <Heading fontSize="xl" mb="4">
                                        Reward
                                    </Heading> */}

                                <Card boxShadow={shadow} py="8" bg={bg}>
                                    <SimpleGrid
                                        minChildWidth={"300px"}
                                        columns={{ base: 3 }}
                                        columnGap={10}
                                        rowGap={4}
                                        w="full"
                                        mb="24px"
                                    >
                                        <GridItem colSpan={{ base: 1 }}>
                                            <FormControl>
                                                <FormLabel
                                                    ms="4px"
                                                    fontSize="md"
                                                    fontWeight="bold"
                                                    color="green.500"
                                                >
                                                    <Link
                                                        href={`data:csv;charset=utf-8,${encodeURIComponent(
                                                            getTemplate()
                                                        )}`}
                                                        download={`Wallet Bulk.csv`}
                                                    >
                                                        Template File
                                                    </Link>
                                                </FormLabel>
                                            </FormControl>
                                        </GridItem>

                                        <GridItem colSpan={{ base: 2 }}>
                                            <Button
                                                w={"192px"}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    hiddenFileInput.current.click();
                                                }}
                                                variant="blue"
                                                me="4"
                                            >
                                                <div>
                                                    <span>Choose File</span>
                                                </div>
                                            </Button>
                                            {inputFile && inputFile.name}
                                            <input
                                                type="file"
                                                name="file"
                                                accept="text/csv"
                                                style={{ display: "none" }}
                                                ref={hiddenFileInput}
                                                onChange={(e) => handleOnLoadFile(e, setFieldValue)}
                                            />
                                        </GridItem>
                                    </SimpleGrid>
                                    {status && (
                                        <Text colorScheme={"red"}>API error: {status} </Text>
                                    )}

                                    <Text fontSize="md">
                                        Valid
                                        <Text as={"span"} color="green.500" me={"1"} ms="1">
                                            {usersArray.filter((user) => user.isValid).length}
                                        </Text>{" "}
                                        users, Invalid
                                        <Text as={"span"} color="red.500" me={"1"} ms="1">
                                            {usersArray.filter((user) => !user.isValid).length}
                                        </Text>
                                        users
                                        <Tooltip
                                            placement="top"
                                            label="Valid users would not be added if exists"
                                            aria-label="A tooltip"
                                            fontSize="md"
                                        >
                                            <i
                                                className="ms-1 bi bi-info-circle"
                                                data-toggle="tooltip"
                                                title="Tooltip on top"
                                            ></i>
                                        </Tooltip>
                                    </Text>

                                    {usersArray && usersArray.length > 0 && (
                                        <Table variant="simple">
                                            <Thead>
                                                <Tr my=".8rem" color="gray.400">
                                                    <Th
                                                        pl="0px"
                                                        borderColor={borderColor}
                                                        color="gray.400"
                                                        fontSize={"md"}
                                                    >
                                                        Wallet
                                                    </Th>
                                                    <Th
                                                        borderColor={borderColor}
                                                        color="gray.400"
                                                        fontSize={"md"}
                                                    >
                                                        Is Valid
                                                    </Th>
                                                </Tr>
                                            </Thead>

                                            <Tbody>
                                                {usersArray.map((row, index) => {
                                                    return (
                                                        <Tr key={index}>
                                                            <Td>{usersArray[index].wallet}</Td>
                                                            <Td>
                                                                {usersArray[index].isValid && (
                                                                    <RiftlyCheckMark />
                                                                )}
                                                                {!usersArray[index].isValid && (
                                                                    <Text color="red.300">
                                                                        Not a valid address
                                                                    </Text>
                                                                )}
                                                            </Td>
                                                        </Tr>
                                                    );
                                                })}
                                            </Tbody>

                                            <ButtonGroup mt="16px">
                                                <Button
                                                    variant="twitter"
                                                    onClick={async () => {
                                                        setInputFile(null);
                                                        let payload = {
                                                            usersArray,
                                                        };

                                                        let createManyOp = await bulkUsersAsync(
                                                            payload
                                                        );

                                                        if (createManyOp.isError) {
                                                            toast({
                                                                title: "Error",
                                                                description: ` ${createManyOp.message}`,
                                                                position: "bottom-right",
                                                                status: "error",
                                                                duration: 3000,
                                                            });
                                                        } else {
                                                            toast({
                                                                title: "Succeed",
                                                                description: `Added ${createManyOp.count} users`,
                                                                position: "bottom-right",
                                                                status: "success",
                                                                duration: 3000,
                                                            });
                                                        }
                                                        setInputFile(null);
                                                        usersArraySet([]);
                                                    }}
                                                >
                                                    Bulk Add
                                                </Button>
                                                <Button
                                                    variant="discord"
                                                    onClick={async () => {
                                                        setInputFile(null);
                                                        usersArraySet([]);
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            </ButtonGroup>
                                        </Table>
                                    )}
                                </Card>
                            </Box>
                        </Flex>
                    </Form>
                </Box>
            )}
        </Formik>
    );
};

export default AdminBulkUsersAdd;

const getTemplate = () => {
    const csvString = [
        ["wallet"],
        ["0xe90344F1526B04a59294d578e85a8a08D4fD6e0b"],
        ["0xe90344F1526B04a59294d578e85a8a08D4fD6e0c"],
    ]
        .map((e) => e.join(","))
        .join("\n");

    return csvString;
};
