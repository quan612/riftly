import React, { useEffect, useState, useCallback, useRef } from "react";

import Enums from "enums";
import { ErrorMessage, Field, Form, Formik, useFormik } from "formik";
import {
    useToast,
    Heading,
    Box,
    Container,
    Flex,
    SimpleGrid,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Switch,
    Select,
    Checkbox,
    GridItem,
    ButtonGroup,
    Button,
    Text,
    Divider,
} from "@chakra-ui/react";
import { RiftlyFace } from "@components/riftly/Logo";

const PersonalInfo = ({ session }) => {
    return (
        <Box
            display={"flex"}
            flexDirection={"column"}
            w="100%"
            position="relative"
            top="16px"
            gap="16px"
            paddingBottom="16px"
        >
            <AccountInfo />
            <ConnectionsInfo />
            <Settings />
        </Box>
    );
};

export default PersonalInfo;

const Settings = () => {
    const initialValues = {
        username: "",
        password: "",
        email: "",
    };
    return (
        <>
            <Heading color="white" fontWeight="600" size="md">
                Settings
            </Heading>

            <Box
                minW="100%"
                bg={"brand.neutral4"}
                minH="128px"
                h="100%"
                border="1px solid"
                borderRadius={"16px"}
                borderColor="brand.neutral3"
                position={"relative"}
                display="flex"
                p="24px"
                flexDirection="column"
                justifyItems={"center"}
                gap="16px"
            >
                {/* <Box> */}
                <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="quest-alerts" mb="0" color="#fff" flex="80%">
                        Notify me about new Challenges
                    </FormLabel>
                    <Switch id="quest-alerts" />
                </FormControl>
                {/* </Box> */}
                <Divider />
                <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="feature-quest-alerts" mb="0" color="#fff" flex="80%">
                        Notify me about new Featured Challenges
                    </FormLabel>
                    <Switch id="feature-quest-alerts" />
                </FormControl>
                <Divider />
                <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="annoucement-alerts" mb="0" color="#fff" flex="80%">
                        Notify me about important annoucements
                    </FormLabel>
                    <Switch id="annoucement-alerts" disabled={true} />
                </FormControl>

                <ButtonGroup gap="16px" w="100%">
                    <Button w="100%" variant="signIn">
                        FAQ
                    </Button>
                    <Button w="100%" variant="signIn" type="submit">
                        Logout
                    </Button>
                </ButtonGroup>
            </Box>
        </>
    );
};

const ConnectionsInfo = () => {
    const initialValues = {
        username: "",
        password: "",
        email: "",
    };
    return (
        <>
            <Heading color="white" fontWeight="600" size="md">
                Connections
            </Heading>

            <Box
                minW="100%"
                bg={"brand.neutral4"}
                minH="128px"
                h="100%"
                border="1px solid"
                borderRadius={"16px"}
                borderColor="brand.neutral3"
                position={"relative"}
                display="flex"
                p="24px"
                flexDirection="column"
                justifyItems={"center"}
                gap="16px"
            >
                <SimpleGrid columns="2" gap="24px">
                    <GridItem colSpan={1}>
                        <Text ms="4px" mb="8px" fontSize="lg" fontWeight="400" color="purple.300">
                            Discord
                        </Text>
                        <Input
                            type="text"
                            fontSize="md"
                            variant="riftly"
                            ms="4px"
                            disabled={true}
                            value={"fsdfdf"}
                        />
                    </GridItem>
                    <GridItem colSpan={1}>
                        <Text ms="4px" mb="8px" fontSize="lg" fontWeight="400" color="blue.300">
                            Twitter
                        </Text>
                        <Input
                            type="text"
                            fontSize="md"
                            variant="riftly"
                            ms="4px"
                            disabled={true}
                            value={"fsdfdf"}
                        />
                    </GridItem>
                    <GridItem colSpan={1}>
                        <Text ms="4px" mb="8px" fontSize="lg" fontWeight="400" color="red.300">
                            Google
                        </Text>
                        <Input
                            type="text"
                            fontSize="md"
                            variant="riftly"
                            ms="4px"
                            disabled={true}
                            value={"fsdfdf"}
                        />
                    </GridItem>
                    <GridItem colSpan={1}>
                        <Text ms="4px" mb="8px" fontSize="lg" fontWeight="400" color="orange.300">
                            Wallet
                        </Text>
                        <Input
                            type="text"
                            fontSize="md"
                            variant="riftly"
                            ms="4px"
                            disabled={true}
                            value={"fsdfdf"}
                        />
                    </GridItem>
                </SimpleGrid>
            </Box>
        </>
    );
};

const AccountInfo = () => {
    const initialValues = {
        username: "",
        password: "",
        email: "",
    };
    return (
        <>
            <Heading color="white" fontWeight="600" size="md">
                Account Information
            </Heading>

            <Box
                minW="100%"
                bg={"brand.neutral4"}
                minH="128px"
                h="100%"
                border="1px solid"
                borderRadius={"16px"}
                borderColor="brand.neutral3"
                position={"relative"}
                display="flex"
                p="24px"
                flexDirection="column"
                justifyItems={"center"}
                gap="16px"
            >
                <Box boxSize={24}>
                    <RiftlyFace />
                </Box>
                <Formik
                    initialValues={initialValues}
                    // validationSchema={CodeQuestSchema}
                    validateOnBlur={true}
                    validateOnChange={false}
                    onSubmit={async (fields, { setStatus }) => {
                        try {
                            console.log(123);
                            alert("SUCCESS!! :-)\n\n" + JSON.stringify(fields, null, 4));
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                >
                    {({ values, errors, status, touched, handleChange, setFieldValue }) => {
                        // const childrenProps = {
                        //     isCreate,
                        //     text: "Code Quest Event",
                        //     isLoading,
                        //     status,
                        //     closeModal,
                        // };
                        console.log(errors);
                        return (
                            <Form>
                                <SimpleGrid columns="2" gap="24px">
                                    <GridItem colSpan={1}>
                                        <FormikInput label="Username" name="username" />
                                    </GridItem>
                                    <GridItem colSpan={1}>
                                        <FormikInput
                                            label="Password"
                                            name="password"
                                            type="password"
                                        />
                                    </GridItem>
                                    <GridItem colSpan={2}>
                                        <FormikInput label="Email" name="email" />
                                    </GridItem>
                                    <GridItem colSpan={2}>
                                        <ButtonGroup gap="16px" w="100%">
                                            <Button w="100%" variant="signIn">
                                                Edit
                                            </Button>
                                            <Button w="100%" variant="signIn" type="submit">
                                                Save
                                            </Button>
                                        </ButtonGroup>
                                    </GridItem>
                                </SimpleGrid>
                            </Form>
                        );
                    }}
                </Formik>
            </Box>
        </>
    );
};

const FormikInput = ({ label, name, type = "text" }) => {
    return (
        <FormControl>
            <FormLabel ms="4px" fontSize="md" fontWeight="bold" color="#fff">
                {label}
            </FormLabel>
            <Field
                name={name}
                type={type}
                as={Input}
                fontSize="md"
                variant="riftly"
                ms="4px"
                // onChange={(e) => onTextChange(e.target.value)}
            />
        </FormControl>
    );
};
