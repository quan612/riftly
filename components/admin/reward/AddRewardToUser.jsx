import React, { useEffect, useState, useRef } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number } from "yup";
import { utils } from "ethers";
import { withPendingRewardSubmit } from "shared/HOC/reward";
import { useEnabledRewardTypesQuery } from "shared/HOC/reward-types";
import Enums from "enums";
import { useEnabledAdminDiscordChannelsQuery } from "@shared/HOC/settings";
import { useCallback } from "react";

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
import Card from "@components/chakra/card/Card";

const AddRewardToUser = ({ isSubmitting, onSubmit, mutationError }) => {
    const bg = useColorModeValue("white", "#1B254B");
    const shadow = useColorModeValue("0px 18px 40px rgba(112, 144, 176, 0.12)", "none");
    const [rewardTypes, isLoadingRewardTypes] = useEnabledRewardTypesQuery();
    const [discordChannels, isLoadingDiscordChannels] = useEnabledAdminDiscordChannelsQuery();

    const [initialValues, initialValuesSet] = useState({
        username: "",
        type: "Wallet",
        rewardTypeId: -1,
        quantity: 1,
        postInDiscordChannels: [],
        generatedURL: "",
    });

    const generatedRef = useRef();

    const RewardSchema = object().shape({
        username: string()
            .required()
            .test("valid address", "Wallet address is not valid.", function () {
                if (this.parent.type === Enums.WALLET && !utils.isAddress(this.parent.username))
                    return false;
                return true;
            }),
    });

    const isSubmitButtonDisabled = (values) => {
        if (
            isSubmitting ||
            values.rewardTypeId === -1 ||
            values.username.trim().length < 1 ||
            values.quantity < 1
        ) {
            return true;
        }
        return false;
    };

    const onSubmitForm = async (fields, { setStatus, resetForm, setFieldValue }) => {
        try {
            // alert("SUCCESS!! :-)\n\n" + JSON.stringify(fields, null, 4));
            // resetForm();

            const res = await onSubmit(fields);

            if (res.data?.isError) {
                generatedRef.current.value = "";
                setStatus(res.data?.message);
            } else {
                resetForm();
                setFieldValue("postInDiscordChannels", []);
                generatedRef.current.value = `${res.data.embededLink}`;

                if (res.data.errorArray) {
                    let statusArray = "";
                    res.data.errorArray.map((e) => {
                        statusArray = statusArray + `${e.error}`;
                    });
                    setStatus(statusArray);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={RewardSchema}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={onSubmitForm}
        >
            {({ errors, status, touched, values, setFieldValue }) => {
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
                                            columns={{ base: 1, lg: 3 }}
                                            columnGap={10}
                                            rowGap={4}
                                            w="full"
                                        >
                                            <GridItem>
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

                                            <GridItem colSpan={{ base: 1, lg: 2 }}>
                                                <FormControl
                                                    mb="24px"
                                                    isRequired
                                                    isInvalid={errors.username && touched.username}
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
                                                        name="username"
                                                        type="text"
                                                        variant="auth"
                                                        placeholder="Wallet / Discord User abc#1234 / Twitter User"
                                                        validate={(value) => {
                                                            let error;

                                                            if (
                                                                values.type === Enums.WALLET &&
                                                                !utils.isAddress(value)
                                                            ) {
                                                                error = "Invalid address checksum.";
                                                            }
                                                            if (
                                                                (values.type === Enums.DISCORD ||
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

                                            <GridItem colSpan={1}>
                                                <FormControl
                                                    isRequired
                                                    isInvalid={
                                                        errors.rewardTypeId && touched.rewardTypeId
                                                    }
                                                    mb="24px"
                                                >
                                                    <FormLabel
                                                        ms="4px"
                                                        fontSize="md"
                                                        fontWeight="bold"
                                                    >
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
                                                                    <option
                                                                        key={index}
                                                                        value={type.id}
                                                                    >
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
                                                    <FormLabel
                                                        ms="4px"
                                                        fontSize="md"
                                                        fontWeight="bold"
                                                    >
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
                                                                error =
                                                                    "Quantity must be at least 1.";
                                                            }
                                                            return error;
                                                        }}
                                                    />

                                                    <FormErrorMessage fontSize="md">
                                                        {errors.quantity}
                                                    </FormErrorMessage>
                                                </FormControl>
                                            </GridItem>

                                            <GridItem colSpan={1}>
                                                {discordChannels && discordChannels.length > 0 && (
                                                    <FormControl mb="24px">
                                                        <FormLabel
                                                            ms="4px"
                                                            fontSize="md"
                                                            fontWeight="bold"
                                                        >
                                                            Post To Discord
                                                        </FormLabel>

                                                        {discordChannels.map((d, index) => {
                                                            let isChecked = false;
                                                            if (
                                                                values.postInDiscordChannels
                                                                    .length === 0
                                                            ) {
                                                                isChecked = false;
                                                            } else {
                                                                let checkIndex =
                                                                    values.postInDiscordChannels.findIndex(
                                                                        (c) =>
                                                                            c.channelId ===
                                                                            d.channelId
                                                                    );

                                                                if (checkIndex === -1) {
                                                                    isChecked = false;
                                                                } else {
                                                                    if (
                                                                        values
                                                                            .postInDiscordChannels[
                                                                            checkIndex
                                                                        ].toPost
                                                                    )
                                                                        isChecked = true;
                                                                }
                                                            }

                                                            return (
                                                                <div className="col-12" key={index}>
                                                                    <FormControl
                                                                        display="flex"
                                                                        alignItems="center"
                                                                    >
                                                                        <Switch
                                                                            isChecked={isChecked}
                                                                            name="postInDiscordChannels"
                                                                            id="remember-login"
                                                                            colorScheme="blue"
                                                                            me="10px"
                                                                            onChange={(event) => {
                                                                                let toPost =
                                                                                    event.target
                                                                                        .checked;

                                                                                let postToThisChannel =
                                                                                    {
                                                                                        channel:
                                                                                            d.channel,
                                                                                        channelId:
                                                                                            d.channelId,
                                                                                        toPost,
                                                                                    };

                                                                                let tmp =
                                                                                    values.postInDiscordChannels.filter(
                                                                                        (r) =>
                                                                                            r?.channelId !==
                                                                                            postToThisChannel.channelId
                                                                                    );

                                                                                // if (toPost) {
                                                                                tmp = [
                                                                                    ...tmp,
                                                                                    postToThisChannel,
                                                                                ];
                                                                                // }

                                                                                setFieldValue(
                                                                                    "postInDiscordChannels",
                                                                                    tmp
                                                                                );
                                                                            }}
                                                                        />

                                                                        <FormLabel
                                                                            mb="0"
                                                                            fontWeight="normal"
                                                                        >
                                                                            {d.channel}
                                                                        </FormLabel>
                                                                    </FormControl>
                                                                </div>
                                                            );
                                                        })}
                                                    </FormControl>
                                                )}
                                            </GridItem>

                                            <RewardPreviewCard
                                                rewardTypeId={values.rewardTypeId}
                                                rewardTypes={rewardTypes}
                                            />

                                            <GridItem colSpan={{ base: 1, lg: 2 }}>
                                                <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                                                    Generated URL
                                                </FormLabel>
                                                <Input
                                                    name="generatedURL"
                                                    type="text"
                                                    disabled={true}
                                                    ref={generatedRef}
                                                />
                                            </GridItem>
                                        </SimpleGrid>

                                        {status && (
                                            <Text colorScheme={"red"}>API error: {status} </Text>
                                        )}
                                        <Button
                                            w={{ base: "200px" }}
                                            my="16px"
                                            type="submit"
                                            colorScheme="teal"
                                            size="lg"
                                            isLoading={isSubmitting}
                                            // disabled={isSubmitButtonDisabled(values)}
                                        >
                                            Submit
                                        </Button>
                                    </Card>
                                </Box>
                            </Flex>
                        </Form>
                    </Box>
                );
            }}
        </Formik>
    );
};

export default withPendingRewardSubmit(AddRewardToUser);

const RewardPreviewCard = ({ rewardTypeId, rewardTypes }) => {
    const bg = useColorModeValue("white", "#1B254B");
    const shadow = useColorModeValue("0px 18px 40px rgba(112, 144, 176, 0.12)", "none");
    const getPreviewImage = useCallback((rewardTypeId, rewardTypes) => {
        if (!rewardTypes) {
            return null;
        }
        let selectedReward = rewardTypes.find((r) => parseInt(r.id) === parseInt(rewardTypeId));

        if (
            !selectedReward ||
            !selectedReward?.rewardPreview ||
            selectedReward?.rewardPreview?.trim().length < 1
        ) {
            return null;
        }

        let srcImage = selectedReward?.rewardPreview;
        return (
            <Card boxShadow={shadow} py="10px" bg={bg}>
                <img src={srcImage} alt="reward-preview" />
            </Card>
        );
    });

    return (
        <Box w={{ base: "150px", lg: "200px" }} h={{ base: "150px", lg: "200px" }}>
            <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                Preview
            </FormLabel>
            {getPreviewImage(rewardTypeId, rewardTypes)}
        </Box>
    );
};

// checked={
//     values
//         ?.postInDiscordChannels[
//         index
//     ]?.toPost
//         ? values
//               ?.postInDiscordChannels[
//               index
//           ]?.toPost
//         : false
// }
// defaultChecked={false}
// defaultChecked={() => {
//     if (
//         values
//             .postInDiscordChannels
//             .length === 0
//     ) {
//         return false;
//     }
//     let checkIndex =
//         values.postInDiscordChannels.findIndex(
//             (c) =>
//                 c.channelId ===
//                 d.channelId
//         );
//     if (checkIndex !== -1) {
//         return false;
//     }
//     return true;
// }}
