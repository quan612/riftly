import React, { useEffect, useState, useCallback, useRef } from "react";
import Enums from "enums";
import { Modal } from "/components/admin";
import { utils } from "ethers";
import { ErrorMessage, Field, Form, Formik } from "formik";

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
    Icon,
} from "@chakra-ui/react";
import Card from "@components/chakra/card/Card";

import { useAdminUserQuestsQuery, useAdminUserQuestDelete } from "@shared/HOC/user-quests";
import AdminCard from "@components/chakra/card/AdminCard";

const AdminUserQuestsSearch = () => {
    const [queryData, isQuerying, queryUserQuestsAsync] = useAdminUserQuestsQuery();
    const [userQuests, userQuestsSet] = useState([]);

    const handleOnQuery = async (payload) => {
        await queryUserQuestsAsync(payload);
    };

    useEffect(() => {
        if (queryData && queryData.userQuest.length > 0) {
            userQuestsSet(queryData.userQuest);
        }
    }, [queryData]);

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
            <SearchUserQuestForm handleOnQuery={handleOnQuery} isQuerying={isQuerying} />
            <QuestsOfUserTable userQuests={userQuests} />
        </Flex>
    );
};
export default AdminUserQuestsSearch;

import { AiFillDelete } from "react-icons/ai";

const QuestsOfUserTable = ({ userQuests }) => {
    const bg = useColorModeValue("white", "#1B254B");
    const shadow = useColorModeValue("0px 18px 40px rgba(112, 144, 176, 0.12)", "none");
    const textColor = useColorModeValue("gray.700", "white");
    const [deleteData, isDeleting, deleteUserQuestsAsync] = useAdminUserQuestDelete();

    const getRewardedInfo = (rewardedQty, rewardType) => {
        if (rewardType?.rewardIcon?.length > 0) {
            return (
                <div style={{ display: "flex", gap: "0.75rem" }}>
                    <span>{rewardedQty}</span>{" "}
                    <img src={`${rewardType?.rewardIcon}`} style={{ width: "25px" }} />
                </div>
            );
        } else {
            return rewardedQty + " " + rewardType.reward;
        }
    };
    return (
        <Box w="100%">
            <h4 className="card-title mb-3">Result</h4>
            <Card boxShadow={shadow} py="8" bg={bg}>
                <Table variant="simple" color={textColor}>
                    <Thead>
                        <Tr my=".8rem" pl="0px" color="gray.400" fontSize="18px">
                            <Th pl="0px" color="gray.500" colSpan={2}>
                                Quest
                            </Th>
                            <Th color="gray.500">Rewarded</Th>
                            <Th color="gray.500">Completed</Th>
                            <Th color="gray.500">Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {userQuests &&
                            userQuests.length > 0 &&
                            userQuests.map((userQuest, index) => {
                                const {
                                    quest,
                                    rewardType,
                                    rewardedQty,
                                    updatedAt,
                                    id,
                                    userId,
                                    questId,
                                } = userQuest;

                                let date = new Date(updatedAt);
                                let updateAtInLocale =
                                    date.toLocaleDateString("en-US") +
                                    " " +
                                    date.toLocaleTimeString("en-US");

                                return (
                                    <Tr key={index}>
                                        <Td colSpan={2}>{quest.text}</Td>
                                        <Td>{getRewardedInfo(rewardedQty, rewardType)}</Td>
                                        <Td>{updateAtInLocale}</Td>
                                        <Td>
                                            <Icon
                                                transition="0.8s"
                                                color="red.300"
                                                boxSize={6}
                                                as={AiFillDelete}
                                                _hover={{
                                                    cursor: "pointer",
                                                }}
                                                onClick={async () => {
                                                    let payload = {
                                                        id,
                                                        userId,
                                                        questId,
                                                    };
                                                    if (!window.confirm("Proceed To Delete")) {
                                                        return;
                                                    }
                                                    let deleteOp = await deleteUserQuestsAsync(
                                                        payload
                                                    );

                                                    if (!deleteOp.isError) {
                                                        let currentUserQuests = userQuests.filter(
                                                            (q) => q.id !== id
                                                        );
                                                        userQuestsSet(currentUserQuests);
                                                    }
                                                }}
                                            />
                                        </Td>
                                    </Tr>
                                );
                            })}
                    </Tbody>
                </Table>
            </Card>
        </Box>
    );
};

function SearchUserQuestForm({ handleOnQuery, isQuerying }) {
    const initialValues = {
        user: "",
        type: Enums.WALLET,
    };

    const getButtonState = (values) => {
        if (values.user.length === 0) {
            return true;
        }
        return false;
    };
    return (
        <>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={async (fields, { setStatus, resetForm }) => {
                    setStatus(null);

                    const payload = {
                        type: fields.type,
                        user: fields.user,
                    };

                    await handleOnQuery(payload);
                }}
            >
                {({ errors, status, touched, setFieldValue, values, resetForm }) => {
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
                                    mb="60px"
                                    mt={{ base: "50px", md: "20px" }}
                                    gap="1%"
                                >
                                    <Box w={{ base: "100%" }} minW="100%">
                                        <AdminCard>
                                            <SimpleGrid
                                                minChildWidth={"300px"}
                                                columns={{ base: 1, xl: 3 }}
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
                                                    <FormControl
                                                        mb="24px"
                                                        isRequired
                                                        isInvalid={
                                                            errors.username && touched.username
                                                        }
                                                    >
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
                                                            validate={(value) => {
                                                                let error;

                                                                if (
                                                                    values.type === Enums.WALLET &&
                                                                    !utils.isAddress(value)
                                                                ) {
                                                                    error =
                                                                        "Invalid address checksum.";
                                                                }
                                                                if (
                                                                    (values.type ===
                                                                        Enums.DISCORD ||
                                                                        values.type ===
                                                                            Enums.TWITTER) &&
                                                                    value.length < 1
                                                                ) {
                                                                    error = "User cannot be blank.";
                                                                }
                                                                return error;
                                                            }}
                                                        />
                                                        <FormErrorMessage fontSize="md">
                                                            {errors.username}
                                                        </FormErrorMessage>
                                                    </FormControl>
                                                </GridItem>
                                            </SimpleGrid>

                                            {status && (
                                                <Text colorScheme={"red"}>API error: {status}</Text>
                                            )}

                                            <Button
                                                w={{ base: "200px" }}
                                                my="16px"
                                                type="submit"
                                                colorScheme="orange"
                                                size="lg"
                                                fontWeight="semibold"
                                                fontSize="18px"
                                                isLoading={isQuerying}
                                                disabled={getButtonState(values)}
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
}
