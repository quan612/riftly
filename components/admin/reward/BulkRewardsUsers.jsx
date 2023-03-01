import React, { useEffect, useState, useCallback, useRef } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number, ref } from "yup";

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
    Select,
    Text,
    Button,
    useColorModeValue,
    SimpleGrid,
    GridItem,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
} from "@chakra-ui/react";

import Card from "@components/shared/Card";
import { useAdminBulkRewardsMutation } from "@shared/HOC/reward";
import axios from "axios";
import { RiftlyCheckMark } from "@components/shared/Icons";
import Loading from "@components/shared/LoadingContainer/Loading";
import { useEnabledRewardTypesQuery } from "@shared/HOC/reward-types";

const BulkRewardsUsers = () => {
    const bg = useColorModeValue("white", "#1B254B");
    const shadow = useColorModeValue("0px 18px 40px rgba(112, 144, 176, 0.12)", "none");
    const toast = useToast();
    const [rewardsData, isAddingRewards, bulkRewardsAsync] = useAdminBulkRewardsMutation();
    const [usersArray, usersArraySet] = useState([]);
    const [originData, originDataSet] = useState([]);
    const hiddenFileInput = useRef(null);

    const [rewardTypes, isLoadingRewardTypes] = useEnabledRewardTypesQuery();

    const [inputFile, setInputFile] = useState(null);
    const textColor = useColorModeValue("gray.700", "white");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    const [initialValues, initialValuesSet] = useState({
        rewardTypeId: -1,
        quantity: 1,
    });

    const handleOnLoadFile = useCallback((e) => {
        if (!e.target.files[0]) {
            return;
        }
        const reader = new FileReader();

        reader.readAsBinaryString(e.target.files[0]);
        reader.onload = async function (onLoadEvent) {
            let data = onLoadEvent.target.result;

            let workbook = read(data, { type: "string", raw: true });

            let currentWorkBook = workbook.Sheets[workbook.SheetNames[0]];

            let arrayData = excelUtils.sheet_to_json(currentWorkBook).map((r) => {
                let value = Object.values(r)[0];
                return { wallet: value, isValid: utils.isAddress(value) };
            });
            originDataSet(arrayData);

            let walletArray = arrayData.map((r) => r.wallet);

            let payload = {
                walletArray,
            };
            let usersSearch = await axios
                .post(`/api/admin/search/users`, payload)
                .then((r) => r.data);

            usersArraySet(usersSearch);
        };
        setInputFile(e.target.files[0]);
        e.target.value = "";
    }, []);

    const onSubmitForm = async (fields, { setStatus, resetForm, setFieldValue }) => {
        try {
            const { quantity, rewardTypeId } = fields;

            setInputFile(null);

            let chunkSplit = [];
            const chunkSize = 100;
            for (let i = 0; i < usersArray.length; i += chunkSize) {
                chunkSplit = [...chunkSplit, usersArray.slice(i, i + chunkSize)];
            }

            let op = await Promise.allSettled(
                chunkSplit.map(async (chunk) => {
                    let payload = {
                        chunk,
                        rewardTypeId: parseInt(rewardTypeId),
                        quantity,
                    };
                    console.log(payload);
                    let res = await bulkRewardsAsync(payload);
                    res.start = chunk[0].wallet;
                    res.end = chunk[chunk.length - 1].wallet;
                    return res;
                })
            );
            console.log(op);
            for (let i = 0; i < op.length; i) {
                if (r.isError) {
                    console.log(r.message);

                    toast({
                        title: "Exception",
                        description: `There were some errors. Log has been tracked. Please contact admin.`,
                        position: "bottom-right",
                        status: "error",
                        duration: 2000,
                        isClosable: true,
                    });
                    break;
                }
            }
            setInputFile(null);
            usersArraySet([]);
            originDataSet([]);
        } catch (error) {
            toast({
                title: "Exception",
                description: `There were some errors. Log has been tracked. Please contact admin.`,
                position: "bottom-right",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }
    };
    return (
        <Formik
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={initialValues}
            onSubmit={onSubmitForm}
        >
            {({ errors, status, touched, setFieldValue }) => (
                <Box w="100%">
                    {isAddingRewards && <Loading />}
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
                                                        download={`Rewards Wallet Bulk.csv`}
                                                    >
                                                        Template File
                                                    </Link>
                                                </FormLabel>
                                            </FormControl>
                                        </GridItem>

                                        <GridItem colSpan={{ base: 2 }}>
                                            <Button
                                                w={"192px"}
                                                onClick={() => {
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
                                                style={{ opacity: 0 }}
                                                ref={hiddenFileInput}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    handleOnLoadFile(e);
                                                }}
                                            />
                                        </GridItem>

                                        <GridItem colSpan={1}>
                                            <FormControl
                                                isRequired
                                                isInvalid={
                                                    errors.rewardTypeId && touched.rewardTypeId
                                                }
                                                mb="24px"
                                            >
                                                <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                                                    Reward Type
                                                </FormLabel>
                                                <Field
                                                    name="rewardTypeId"
                                                    as={Select}
                                                    fontSize="md"
                                                    ms="4px"
                                                    size="lg"
                                                    validate={(value) => {
                                                        let error;
                                                        if (value < 0) {
                                                            error = "Please select a reward.";
                                                        }
                                                        return error;
                                                    }}
                                                >
                                                    <option key={-1} value={-1}>
                                                        Select a reward
                                                    </option>
                                                    {rewardTypes &&
                                                        rewardTypes.map((type, index) => {
                                                            return (
                                                                <option key={index} value={type.id}>
                                                                    {type.reward}
                                                                </option>
                                                            );
                                                        })}
                                                </Field>
                                                <FormErrorMessage fontSize="md">
                                                    {errors.rewardTypeId}
                                                </FormErrorMessage>
                                            </FormControl>
                                        </GridItem>

                                        <GridItem colSpan={1}>
                                            <FormControl
                                                mb="24px"
                                                isInvalid={errors.quantity}
                                                isRequired
                                            >
                                                <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                                                    Quantity
                                                </FormLabel>

                                                <Field
                                                    as={Input}
                                                    size="lg"
                                                    w="50%"
                                                    name="quantity"
                                                    type="number"
                                                    variant="auth"
                                                    validate={(value) => {
                                                        let error;
                                                        if (value.length < 1) {
                                                            error = "Quantity cannot be blank.";
                                                        } else if (value < 1) {
                                                            error = "Quantity must be at least 1.";
                                                        }
                                                        return error;
                                                    }}
                                                />

                                                <FormErrorMessage fontSize="md">
                                                    {errors.quantity}
                                                </FormErrorMessage>
                                            </FormControl>
                                        </GridItem>
                                    </SimpleGrid>
                                    {status && (
                                        <Text colorScheme={"red"}>API error: {status} </Text>
                                    )}

                                    <Text fontSize="md">
                                        Valid
                                        <Text as={"span"} color="green.500" me={"1"} ms="1">
                                            {originData.filter((user) => user.isValid).length}
                                        </Text>{" "}
                                        users, Invalid
                                        <Text as={"span"} color="red.500" me={"1"} ms="1">
                                            {originData.filter((user) => !user.isValid).length}
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
                                    <ButtonGroup mt="16px">
                                        <Button
                                            variant="twitter"
                                            // onClick={handleBulkRewards}
                                            type="submit"
                                            disabled={usersArray.length === 0}
                                        >
                                            Bulk Rewards
                                        </Button>
                                        <Button
                                            variant="discord"
                                            onClick={async () => {
                                                setInputFile(null);
                                                usersArraySet([]);
                                                originDataSet([]);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </ButtonGroup>
                                    {originData && originData.length > 0 && (
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
                                                {originData.map((row, index) => {
                                                    return (
                                                        <Tr key={index}>
                                                            <Td>{originData[index].wallet}</Td>
                                                            <Td>
                                                                {originData[index].isValid && (
                                                                    <RiftlyCheckMark />
                                                                )}
                                                                {!originData[index].isValid && (
                                                                    <Text color="red.300">
                                                                        Not a valid address
                                                                    </Text>
                                                                )}
                                                            </Td>
                                                        </Tr>
                                                    );
                                                })}
                                            </Tbody>
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

export default BulkRewardsUsers;

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
