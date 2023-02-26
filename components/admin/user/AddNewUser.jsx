import React, { useEffect, useState, useContext } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number, ref } from "yup";
import { utils } from "ethers";
import { useAdminUserMutation } from "shared/HOC/user";
import Enums from "enums";

import {
    Heading,
    Box,
    Flex,
    Link,
    List,
    ListItem,
    Text,
    Button,
    useColorModeValue,
    SimpleGrid,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Select,
    Checkbox,
    GridItem,
    Tooltip,
    useToast,
} from "@chakra-ui/react";
import Card from "@components/shared/Card";

const avatars = [
    `${Enums.BASEPATH}/img/sharing-ui/invite/ava1.png`,
    `${Enums.BASEPATH}/img/sharing-ui/invite/ava2.png`,
    `${Enums.BASEPATH}/img/sharing-ui/invite/ava3.png`,
    `${Enums.BASEPATH}/img/sharing-ui/invite/ava4.png`,
    `${Enums.BASEPATH}/img/sharing-ui/invite/ava5.png`,
    `${Enums.BASEPATH}/img/sharing-ui/invite/ava6.png`,
    `${Enums.BASEPATH}/img/sharing-ui/invite/ava7.png`,
    `${Enums.BASEPATH}/img/sharing-ui/invite/ava8.png`,
];

const initialValues = {
    type: Enums.WALLET,
    user: "",
};

const UserSchema = object().shape({
    user: string()
        .required()
        .test("valid address", "Wallet Address is not valid!", function () {
            if (this.parent.type === Enums.DISCORD || this.parent.type === Enums.TWITTER) {
                return true;
            }
            if (this.parent.type === Enums.WALLET && utils.isAddress(this.parent.user)) {
                return true;
            }
            return false;
        }),
});

const AddNewUser = () => {
    const bg = useColorModeValue("white", "#1B254B");
    const shadow = useColorModeValue("0px 18px 40px rgba(112, 144, 176, 0.12)", "none");
    const toast = useToast();
    const [avatar, setAvatar] = useState(null);

    useEffect(async () => {
        let ava = avatars[Math.floor(Math.random() * avatars.length)];
        setAvatar(ava);
    }, []);

    const [newUserData, isAdding, addUserAsync] = useAdminUserMutation();

    const onSubmit = async (fields, { setStatus, resetForm, validate }) => {
        try {
            let res = await addUserAsync(fields);
            if (res.isError) {
                setStatus(`Catch error adding new ${fields.type} user: ${res.message}`);
            } else {
                let description;
                if (fields.type === Enums.DISCORD) {
                    description = `Added new discord user ${res.discordUserDiscriminator}`;
                }
                if (fields.type === Enums.TWITTER) {
                    description = `Added new twitter user ${res.twitterUserName}`;
                }
                if (fields.type === Enums.WALLET) {
                    description = `Added new user successfully`;
                }
                toast({
                    title: "Succeed",
                    description,
                    position: "bottom-right",
                    status: "success",
                    duration: 3000,
                });
                resetForm();
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={UserSchema}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={onSubmit}
        >
            {({ errors, status, touched, isValid, dirty, values }) => {
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
                                                    isInvalid={errors.user && touched.user}
                                                >
                                                    <FormLabel
                                                        ms="4px"
                                                        fontSize="md"
                                                        fontWeight="bold"
                                                    >
                                                        User (Wallet / Discord Id / Twitter User)
                                                    </FormLabel>

                                                    <Field
                                                        as={Input}
                                                        size="lg"
                                                        name="user"
                                                        type="text"
                                                        variant="auth"
                                                        placeholder="Wallet / Discord Id / Twitter User"
                                                        validate={(value) => {
                                                            let error;

                                                            if (
                                                                values?.type === Enums.WALLET &&
                                                                !utils.isAddress(value)
                                                            ) {
                                                                error = "Invalid address checksum.";
                                                            }
                                                            if (
                                                                (values?.type === Enums.DISCORD ||
                                                                    values?.type ===
                                                                        Enums.TWITTER) &&
                                                                value?.length < 1
                                                            ) {
                                                                error = "User cannot be blank.";
                                                            }
                                                            return error;
                                                        }}
                                                    />
                                                    <FormErrorMessage fontSize="md">
                                                        {errors.user}
                                                    </FormErrorMessage>
                                                </FormControl>
                                            </GridItem>

                                            {/* {errors && errors.user && (
                                                <Text fontSize="md" color="red.500">
                                                    {errors && errors.user}
                                                </Text>
                                            )} */}
                                        </SimpleGrid>
                                        {status && (
                                            <Text fontSize="md" color="red.500" width={"100%"}>
                                                {status}
                                            </Text>
                                        )}

                                        <Button
                                            w={{ base: "200px" }}
                                            my="16px"
                                            type="submit"
                                            colorScheme="teal"
                                            size="lg"
                                            isLoading={isAdding}
                                            disabled={isAdding}
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

export default AddNewUser;
