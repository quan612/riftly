import React, { useEffect, useState, useContext, useCallback } from "react";
import { debounce } from "@utils/index";
import { useRouter } from "next/router";

import {
    Heading,
    Box,
    Flex,
    Link,
    List,
    ListItem,
    Text,
    Button,
    Image,
    Input,
    HStack,
    Icon,
    Progress,
    ButtonGroup,
    PinInput,
    PinInputField,
    Select,
} from "@chakra-ui/react";

import { ShortContainer } from "containers/user";
import { RiftlyFace, RiftlyLogoWhite } from "@components/riftly/Logo";
import { LayoutWrapper } from "@components/end-user/UserLayout";
import { usePhoneCodeQuestSubmit, usePhoneNumberQuestSubmit } from "@shared/HOC/quest";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { ChakraBox } from "@theme/additions/framer/FramerChakraComponent";
import Enums from "@enums/index";

const WELCOME = 1;
const ENTER_PHONE = 2;
const ENTER_CODE = 3;
const VERIFIED = 4;
const ERROR = 5;

function SMSVerificationPage() {
    let router = useRouter();
    const [error, errorSet] = useState();

    const { account, type } = router.query;

    const [phoneError, phoneErrorSet] = useState(null);
    const [phoneNumber, phoneNumberSet] = useState("");

    const [codeError, codeErrorSet] = useState(null);
    const [code, codeSet] = useState("");

    const [currentView, setView] = useState(WELCOME);

    const [phoneCodeSentData, isSubmittingCode, submitCodeAsync] = usePhoneCodeQuestSubmit();
    const [phoneNumberSentData, isSubmittingPhoneNumber, submitPhoneNumberAsync] =
        usePhoneNumberQuestSubmit();

    const onEnterPhone = useCallback((e, phoneError) => {
        if (phoneError) {
            phoneErrorSet(null);
        }

        phoneNumberSet(e);
    });

    const onEnterCode = useCallback((val, codeError) => {
        if (codeError) {
            codeErrorSet(null);
        }
        codeSet(val);
    });

    const onSendPhone = async () => {
        let isPossibleNumber = isPossiblePhoneNumber(phoneNumber);
        if (!isPossibleNumber) {
            phoneErrorSet("Not a possible phone number.");
            return;
        }

        let payload = {
            // questId: quest.questId,
            account,
            type,
            phoneNumber,
        };

        const sendPhoneOp = await submitPhoneNumberAsync(payload);

        if (sendPhoneOp.isError) {
            phoneErrorSet(sendPhoneOp.message);
            return;
        }

        setView(ENTER_CODE);
    };

    const onSendCode = async () => {
        if (codeError) {
            codeErrorSet(null);
        }

        let payload = {
            // questId: quest.questId,
            account,
            type,
            code,
        };

        const sendCodeOp = await submitCodeAsync(payload);

        if (sendCodeOp.isError) {
            codeErrorSet(sendCodeOp.message);
            return;
        }
        setView(VERIFIED);
    };

    const debouncedOnPhoneChangeHandler = useCallback(debounce(onEnterPhone, 300), []);

    return (
        <LayoutWrapper>
            <LogoWrapper />

            <ShortContainer>
                {currentView === WELCOME && (
                    <>
                        <Flex alignItems={"center"} gap="24px">
                            <Box boxSize={24}>
                                <RiftlyFace />
                            </Box>
                        </Flex>

                        <Heading
                            fontSize={{ base: "xl", lg: "2xl" }}
                            color="#fff"
                            mb="16px"
                            align="center"
                        >
                            Verify SMS to complete signing up user
                        </Heading>

                        <Button
                            variant="blue"
                            onClick={() => setView(ENTER_PHONE)}
                            minW="100%"
                            borderRadius="24px"
                        >
                            <HStack>
                                <Text>Next</Text>
                            </HStack>
                        </Button>
                    </>
                )}

                {currentView === ENTER_PHONE && (
                    <>
                        <Heading color="white" fontSize={"2xl"} align="center">
                            Enter phone number for verification
                        </Heading>

                        <Box display={"flex"} color="black" w="100%">
                            <PhoneInput
                                style={{
                                    width: "100%",
                                }}
                                onChange={(e) => debouncedOnPhoneChangeHandler(e, phoneError)}
                            />
                        </Box>

                        {phoneError && (
                            <ChakraBox
                                layout
                                color="red.300"
                                key="sms-phone-error"
                                exit={{ opacity: 0 }}
                            >
                                {phoneError}
                            </ChakraBox>
                        )}

                        <Button
                            variant="blue"
                            onClick={() => onSendPhone()}
                            minW="100%"
                            borderRadius="24px"
                            isLoading={isSubmittingPhoneNumber}
                        >
                            <HStack>
                                <Text>Next</Text>
                            </HStack>
                        </Button>
                    </>
                )}

                {currentView === ENTER_CODE && (
                    <>
                        <Heading color="white" fontSize={"2xl"} align="center">
                            Enter code sent to phone number {phoneNumber}
                        </Heading>
                        <HStack>
                            <PinInput otp onChange={onEnterCode}>
                                <PinInputField color="white" />
                                <PinInputField color="white" />
                                <PinInputField color="white" />
                                <PinInputField color="white" />
                                <PinInputField color="white" />
                                <PinInputField color="white" />
                            </PinInput>
                        </HStack>
                        {codeError && (
                            <ChakraBox
                                layout
                                color="red.300"
                                key="sms-phone-error"
                                exit={{ opacity: 0 }}
                            >
                                {codeError}
                            </ChakraBox>
                        )}
                        <ButtonGroup
                            w="100%"
                            spacing="16px"
                            display={"flex"}
                            flexDirection="row"
                            justifyContent={"space-between"}
                        >
                            <Button
                                w={{ base: "45%" }}
                                variant="signIn"
                                onClick={() => {
                                    errorSet(null)
                                    setView(ENTER_PHONE)
                                }
                                }
                                borderRadius="24px"
                            >
                                <HStack>
                                    <Text>Back</Text>
                                </HStack>
                            </Button>
                            <Button
                                w={{ base: "45%" }}
                                variant="blue"
                                onClick={() => onSendCode()}
                                borderRadius="24px"
                                disabled={code.trim().length < 4}
                                isLoading={isSubmittingCode}
                            >
                                <HStack>
                                    <Text>Verify</Text>
                                </HStack>
                            </Button>
                        </ButtonGroup>
                    </>
                )}

                {currentView === ERROR && (
                    <>
                        <Heading color="white" fontSize={"2xl"} align="center">
                            Error sms verification
                        </Heading>
                        {error && <Text color="red.300">{error}</Text>}

                        <Button
                            variant="blue"
                            onClick={() => {
                                setView(WELCOME);
                                handleOnClose();
                            }}
                            minW="100%"
                            borderRadius="24px"
                            w="100%"
                        >
                            Back
                        </Button>
                    </>
                )}

                {currentView === VERIFIED && (
                    <>
                        <Image
                            src="/img/user/riftly-success.gif"
                            boxSize={{ sm: "40px", md: "60px", lg: "80px" }}
                        />

                        <Heading color="white" fontSize={"2xl"} align="center" w="100%">
                            Congrats!
                        </Heading>

                        <Text w="100%" color="brand.neutral0" align="center" fontSize="md">
                            You finished Sms verification. Try to sign in again.
                        </Text>

                        <Button
                            w="100%"
                            variant="blue"
                            onClick={async () => {
                                //try sign in here base on type used previously
                                router.push(`/user/sign-in`)
                            }}
                            minW="100%"
                            borderRadius="24px"
                        >
                            Sign In
                        </Button>
                    </>
                )}
            </ShortContainer>
        </LayoutWrapper>
    );
}

export default SMSVerificationPage;

const LogoWrapper = () => {
    return (
        <Box position="absolute" w="100%" h="25%" top={0}>
            <Flex h="100%" alignItems="center" justifyContent={"center"}>
                <Box w={{ base: "100px", md: "150px", xl: "200px" }}>
                    <RiftlyLogoWhite />
                </Box>
            </Flex>
        </Box>
    );
};
