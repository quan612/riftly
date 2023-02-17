import React, { useContext, useEffect, useState, useCallback, useRef } from "react";

import { Web3Context } from "@context/Web3Context";
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
    Icon,
    useDisclosure,
} from "@chakra-ui/react";
import { RiftlyFace } from "@components/riftly/Logo";
import axios from "axios";

import { debounce } from "utils/";
import { RiftlyTooltip } from "@components/riftly/Icons";
import UploadAvatarModal from "../shared/UploadAvatarModal";

const PersonalInfo = ({ session }) => {
    return (
        <Box
            display={"flex"}
            flexDirection={"column"}
            w="100%"
            position="relative"
            top="32px"
            gap="16px"
            paddingBottom="24px"
        >
            <AccountInfo />
            <ConnectionsInfo />
            <Settings />
        </Box>
    );
};

export default PersonalInfo;

const Settings = () => {
    const { SignOut } = useContext(Web3Context);
    let swRegistrationRef = useRef(null);
    const [switchSb, switchSbSet] = useState(false);
    const toast = useToast();

    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("./sw.js").then(
                async function (registration) {
                    swRegistrationRef.current = registration;
                    let existingSubscription =
                        await swRegistrationRef.current.pushManager.getSubscription();

                    console.log("existingSubscription", existingSubscription);
                    if (existingSubscription) {
                        switchSbSet(true);
                    } else {
                        switchSbSet(false);
                    }
                },
                function (err) {
                    console.log("Service Worker registration failed: ", err);
                }
            );
        } else {
            window.alert("Not supporting service on this browser");
        }
    }, []);

    const handleOnSubscribeChange = async () => {
        let existingSubscription = await swRegistrationRef.current.pushManager.getSubscription();

        const subscribeOptions = {
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_VAPID,
        };

        try {
            // true, subscribe

            if (!existingSubscription) {
                console.log("no subscription yet, going to subscribe one then save to database");
                switchSbSet(true);
                try {
                    let pushSubscription = await swRegistrationRef.current.pushManager.subscribe(
                        subscribeOptions
                    );

                    let newSubscription = await axios
                        .post(`/api/user/web-push/save-subscription`, {
                            pushSubscription,
                        })
                        .then((r) => r.data)
                        .catch((err) => {
                            throw err;
                        });

                    toast({
                        title: "Subscribed to new challenges!",
                        // description: `${res.message}`,
                        position: "bottom-right",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                    //   }
                } catch (err) {
                    switchSbSet(false);
                }
            }
            //false unsubscribe
            else {
                console.log("unsubscribe");
                switchSbSet(false);
                let payload = existingSubscription;

                await existingSubscription.unsubscribe().catch((e) => {
                    throw e;
                });

                let unsubscribedOp = await axios
                    .post(`/api/user/web-push/remove-subscription`, {
                        payload,
                    })
                    .then((r) => r.data)
                    .catch((err) => {
                        throw err;
                    });

                toast({
                    title: "Unsubscribed from new challenges!",
                    // description: `${res.message}`,
                    position: "bottom-right",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });

                // }
            }
        } catch (err) {
            switchSbSet(true);
            console.log(err);
        }
    };

    const debouncedSubscribeChangeHandler = useCallback(
        debounce((e) => handleOnSubscribeChange(e), 800),
        []
    );

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
                <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="quest-alerts" mb="0" color="#fff" flex="80%">
                        Notify me about new Challenges
                        <RiftlyTooltip label="The permission may be overridden by browser setting, under Privacy Security" />
                    </FormLabel>
                    <Switch
                        isChecked={switchSb}
                        id="quest-alerts"
                        onChange={async (e) => {
                            debouncedSubscribeChangeHandler(e);
                        }}
                    />
                </FormControl>

                <ButtonGroup gap="16px" w="100%">
                    <Button w="100%" variant="signIn">
                        FAQ
                    </Button>
                    <Button w="100%" variant="signIn" onClick={SignOut}>
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
    const uploadAvatarModal = useDisclosure();
    return (
        <>
            <UploadAvatarModal
                isOpen={uploadAvatarModal.isOpen}
                onClose={() => {
                    uploadAvatarModal.onClose();
                }}
            />
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
                alignItems="center"
                gap="16px"
            >
                <Box boxSize={"96px"} position="relative">
                    <RiftlyFace />
                    <Box position="absolute" boxSize="40px" right="2px" bottom="0">
                        <UploadIcon handleOnClick={() => uploadAvatarModal.onOpen()} />
                    </Box>
                </Box>
                <Box w="100%">
                    <Formik
                        initialValues={initialValues}
                        validateOnBlur={true}
                        validateOnChange={false}
                        onSubmit={async (fields, { setStatus }) => {
                            try {
                                alert("SUCCESS!! :-)\n\n" + JSON.stringify(fields, null, 4));
                            } catch (error) {
                                console.log(error);
                            }
                        }}
                    >
                        {({ values, errors, status, touched, handleChange, setFieldValue }) => {
                            return (
                                <Form w="100%">
                                    <SimpleGrid columns="2" gap="24px" w="100%">
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

const UploadIcon = ({ handleOnClick }) => {
    return (
        <Icon
            width="100%"
            height="100%"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            cursor={"pointer"}
            onClick={handleOnClick}
        >
            <circle cx="20" cy="20" r="19" fill="white" stroke="#1D63FF" strokeWidth="2" />
            <g clip-path="url(#clip0_13957_4815)">
                <path
                    d="M14.1663 25.0416H26.833V19.5H28.4163V25.8333C28.4163 26.0433 28.3329 26.2446 28.1845 26.3931C28.036 26.5416 27.8346 26.625 27.6247 26.625H13.3747C13.1647 26.625 12.9633 26.5416 12.8149 26.3931C12.6664 26.2446 12.583 26.0433 12.583 25.8333V19.5H14.1663V25.0416ZM22.083 17.125V21.875H18.9163V17.125H14.958L20.4997 11.5833L26.0413 17.125H22.083Z"
                    fill="#1D63FF"
                />
            </g>
            <defs>
                <clipPath id="clip0_13957_4815">
                    <rect width="19" height="19" fill="white" transform="translate(11 10)" />
                </clipPath>
            </defs>
        </Icon>
    );
};
