import React, { useEffect, useState, useCallback } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number } from "yup";

import { debounce } from "@util/index";
import {
    useAdminDiscordChannelsMutation,
    useAdminDiscordChannelsQuery,
} from "@shared/HOC/settings";
import Card from "@components/shared/Card";

import {
    Heading,
    Box,
    Flex,
    Table,
    Tbody,
    Th,
    Thead,
    Tr,
    Td,
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
    Tooltip,
    useToast,
    Icon,
} from "@chakra-ui/react";

import { AdminCard } from "@components/shared/Card";
import { RiftlyTooltip } from "@components/shared/Icons";

const AdminDiscordChannels = () => {
    const [discordChannels, isLoadingDiscordChannels] = useAdminDiscordChannelsQuery();
    const [data, isUpserting, upsertChannelAsync] = useAdminDiscordChannelsMutation();

    const handleOnStatusChange = async (e, discord) => {
        e.preventDefault();
        if (discord.isEnabled !== e.target.checked) {
            const payload = { ...discord, isEnabled: e.target.checked, isCreated: false };
            await upsertChannelAsync(payload);
        }
    };

    const handleOnPostMessageChange = async (e, discord) => {
        e.preventDefault();

        let val = e.target.checked;
        if (discord.postMessageWhenClaimed !== val) {
            const payload = {
                ...discord,
                postMessageWhenClaimed: val,
                isCreated: false,
            };

            await upsertChannelAsync(payload);
        }
    };

    const debouncedStatusChangeHandler = useCallback(
        debounce((e, discord) => handleOnStatusChange(e, discord), 800),
        []
    );

    const debouncedIsPostMessageChangeHandler = useCallback(
        debounce((val, discord) => handleOnPostMessageChange(val, discord), 800),
        []
    );

    return (
        <Box w="100%" display={"flex"} flexDirection="column" gap="24px">
            <Heading color="#fff" size="md">
                Create Channel
            </Heading>
            <CreateDiscordChannel upsertChannelAsync={upsertChannelAsync} />

            <Heading color="#fff" size="md">
                Current Channels
            </Heading>

            <AdminCard>
                <Table variant="simple">
                    <Thead>
                        <Tr my=".8rem" pl="0px" color="gray.400" fontSize="18px">
                            <Th>Channel</Th>
                            <Th>Channel Id</Th>
                            <Th>
                                Status
                                <RiftlyTooltip label="Disabled Channel will not be listed under Reward User Page" />
                            </Th>
                            <Th>
                                Post Message
                                <RiftlyTooltip label="Allow to post an embeded message to this channel once user claimed a reward" />
                            </Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {discordChannels &&
                            discordChannels.map((discord, index) => {
                                return (
                                    <Tr key={index}>
                                        <Td>{discord.channel}</Td>
                                        <Td>{discord.channelId}</Td>
                                        <Td>
                                            {/* <div className="form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                
                                                            />
                                                        </div> */}
                                            <Switch
                                                id="-discord-channel-status"
                                                defaultChecked={discord.isEnabled ? true : false}
                                                onChange={(e) =>
                                                    debouncedStatusChangeHandler(e, discord)
                                                }
                                            />
                                        </Td>
                                        <Td>
                                            <Switch
                                                id="post-discord-channel-message"
                                                defaultChecked={
                                                    discord.postMessageWhenClaimed ? true : false
                                                }
                                                onChange={(e) =>
                                                    debouncedIsPostMessageChangeHandler(e, discord)
                                                }
                                            />
                                        </Td>
                                        <Td>
                                            {/* <Icon
                                               
                                                transition="0.8s"
                                                color="red.300"
                                                boxSize={7}
                                                as={AiFillDelete}
                                                _hover={{
                                                    cursor: "pointer",
                                                    color: "red.600",
                                                }}
                                                onClick={async () => {
                                                    // if (
                                                    //     !window.confirm(
                                                    //         "Proceed to soft delete discord channel "
                                                    //     )
                                                    // ) {
                                                    //     return;
                                                    // }
                                                    // handleQuestSoftDelete(quest);
                                                }}
                                            /> */}
                                        </Td>
                                    </Tr>
                                );
                            })}
                    </Tbody>
                </Table>
            </AdminCard>
        </Box>
    );
};

export default AdminDiscordChannels;

const initialValues = {
    channel: "",
    channelId: "",
};

const CreateDiscordChannelSchema = object().shape({
    channel: string().required("Discord Channel is required"),
    channelId: string().required("Discord Channel Id required"),
});

function CreateDiscordChannel({ upsertChannelAsync }) {
    const bg = useColorModeValue("white", "#1B254B");
    const shadow = useColorModeValue("0px 18px 40px rgba(112, 144, 176, 0.12)", "none");
    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={CreateDiscordChannelSchema}
                onSubmit={async (fields, { setStatus, resetForm }) => {
                    setStatus(null);
                    const payload = {
                        channel: fields.channel,
                        channelId: fields.channelId,
                        isEnabled: true,
                        isDeleted: false,
                        isCreated: true,
                    };
                    let upsertOp = await upsertChannelAsync(payload);

                    if (upsertOp.isError) {
                        setStatus(upsertOp.message);
                    } else {
                        resetForm();
                    }
                }}
            >
                {({ errors, status, touched }) => (
                    <Box w="100%">
                        <Form>
                            <Flex
                                flexDirection={{
                                    base: "row",
                                }}
                                w="100%"
                                h="100%"
                                justifyContent="center"
                                gap="16px"
                            >
                                <Card boxShadow={shadow} py="8" bg={bg}>
                                    <SimpleGrid
                                        columns={{ base: 1, lg: 3 }}
                                        columnGap={10}
                                        rowGap={4}
                                        w="full"
                                    >
                                        <GridItem colSpan={{ base: 1 }}>
                                            <FormControl
                                                mb="24px"
                                                isRequired
                                                isInvalid={errors.channel && touched.channel}
                                            >
                                                <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                                                    Channel (#deep-sea-challenger)
                                                </FormLabel>

                                                <Field
                                                    as={Input}
                                                    size="lg"
                                                    name="channel"
                                                    type="text"
                                                    variant="auth"
                                                    placeholder="Channel name"
                                                />
                                                <FormErrorMessage fontSize="md">
                                                    {errors.channel}
                                                </FormErrorMessage>
                                            </FormControl>
                                        </GridItem>

                                        <GridItem colSpan={{ base: 1, lg: 2 }}>
                                            <FormControl
                                                isRequired
                                                isInvalid={errors.channel && touched.channel}
                                            >
                                                <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                                                    Channel Id
                                                </FormLabel>

                                                <Field
                                                    as={Input}
                                                    size="lg"
                                                    name="channelId"
                                                    type="text"
                                                    variant="auth"
                                                    placeholder="Channel Id"
                                                />
                                                <FormErrorMessage fontSize="md">
                                                    {errors.channelId}
                                                </FormErrorMessage>
                                            </FormControl>
                                        </GridItem>

                                        {status && (
                                            <Text fontSize="md" color="red.500" width={"100%"}>
                                                {status}
                                            </Text>
                                        )}

                                        <Button
                                            w={{ base: "200px" }}
                                            type="submit"
                                            colorScheme="teal"
                                        >
                                            Submit
                                        </Button>
                                    </SimpleGrid>
                                </Card>
                            </Flex>
                        </Form>
                    </Box>
                )}
            </Formik>
        </>
    );
}
