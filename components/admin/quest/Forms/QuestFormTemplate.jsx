import React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";

import {
    Heading,
    Box,
    Flex,
    Text,
    Button,
    SimpleGrid,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Select,
    Checkbox,
    GridItem,
    ButtonGroup,
} from "@chakra-ui/react";

const QuestFormTemplate = ({
    values,
    errors,
    touched,
    onTextChange,
    onCompletedTextChange,
    onDescriptionChange,
    onRewardTypeChange,
    onRewardQuantityChange,
    onIsEnabledChange,
    rewardTypes,
    ...props
}) => {
    return (
        <>
            <GridItem colSpan={1}>
                <FormControl>
                    <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                        Quest Text
                    </FormLabel>
                    <Field
                        name="text"
                        type="text"
                        as={Input}
                        fontSize="md"
                        variant="riftly"
                        ms="4px"
                        onChange={(e) => onTextChange(e.target.value)}
                    />

                    <FormErrorMessage fontSize="md" name="text">
                        {errors.username}
                    </FormErrorMessage>
                </FormControl>
            </GridItem>

            <GridItem colSpan={1}>
                <FormControl>
                    <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                        Completed
                    </FormLabel>
                    <Field
                        name="completedText"
                        type="text"
                        as={Input}
                        fontSize="md"
                        variant="riftly"
                        ms="4px"
                        onChange={(e) => onCompletedTextChange(e.target.value)}
                    />

                    <FormErrorMessage fontSize="md" name="completedText">
                        {errors.completedText}
                    </FormErrorMessage>
                </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
                <FormControl>
                    <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                        Description
                    </FormLabel>
                    <Field
                        name="description"
                        type="text"
                        as={Input}
                        fontSize="md"
                        variant="riftly"
                        ms="4px"
                        onChange={(e) => onDescriptionChange(e.target.value)}
                    />

                    <FormErrorMessage fontSize="md" name="description">
                        {errors.description}
                    </FormErrorMessage>
                </FormControl>
            </GridItem>

            <GridItem colSpan={1}>
                <FormControl>
                    <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                        Reward Type
                    </FormLabel>
                    <Field
                        name="type"
                        as={Select}
                        fontSize="md"
                        ms="4px"
                        size="lg"
                        value={values.rewardTypeId}
                        onChange={(e) => {
                            e.preventDefault();
                            onRewardTypeChange(e.target.value);
                        }}
                    >
                        {rewardTypes &&
                            rewardTypes.map((type, index) => {
                                return (
                                    <option key={index} value={parseInt(type.id)}>
                                        {type.reward}
                                    </option>
                                );
                            })}
                    </Field>
                </FormControl>
            </GridItem>

            <GridItem colSpan={1}>
                <FormControl>
                    <FormLabel ms="4px" fontSize="md" fontWeight="bold">
                        Quantity
                    </FormLabel>
                    <Field
                        maxW="200px"
                        name="quantity"
                        type="number"
                        as={Input}
                        fontSize="md"
                        variant="riftly"
                        ms="4px"
                        onChange={(e) => onRewardQuantityChange(parseInt(e.target.value))}
                    />

                    <FormErrorMessage fontSize="md" name="quantity">
                        {errors.quantity}
                    </FormErrorMessage>
                </FormControl>
            </GridItem>

            <GridItem colSpan={1}>
                <FormControl>
                    {/* <input
                        className="form-check-input"
                        type="checkbox"
                        defaultChecked={values.isEnabled}
                        name="isEnabled"
                        onChange={onIsEnabledChange}
                    /> */}

                    <Checkbox
                        onChange={onIsEnabledChange}
                        name="isEnabled"
                        defaultChecked={values.isEnabled}
                    >
                        Enabled
                    </Checkbox>
                </FormControl>
            </GridItem>
        </>
    );
};

export default QuestFormTemplate;

export const AdminQuestFormikWrapper = ({
    isCreate,
    text,
    status,
    isLoading,
    closeModal,
    children,
}) => {
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
                    <Box
                        w={{ base: "100%" }}
                        minW="100%"
                        display={"flex"}
                        flexDirection={"column"}
                        gap={"16px"}
                    >
                        <Heading size="lg">{isCreate ? "Create" : "Edit"} Quest</Heading>
                        <Text fontSize={"md"}>{text}</Text>

                        <SimpleGrid columns={"2"} columnGap={8} rowGap={4} w="full" gap="12px">
                            {children}
                        </SimpleGrid>
                        {status && <Text colorScheme={"red"}>API error: {status}</Text>}

                        <ButtonGroup>
                            <Button
                                w={"150px"}
                                variant="discord"
                                type="submit"
                                isLoading={isLoading}
                                disabled={isLoading}
                                me="3"
                            >
                                Save
                            </Button>

                            <Button w={"150px"} type="button" variant="signIn" onClick={closeModal}>
                                Close
                            </Button>
                        </ButtonGroup>
                    </Box>
                </Flex>
            </Form>
        </Box>
    );
};
