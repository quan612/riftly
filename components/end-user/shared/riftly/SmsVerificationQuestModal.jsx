import React, { useEffect, useState, useContext, useCallback } from "react";
import {
    Heading,
    Box,
    Flex,
    Link,
    List,
    ListItem,
    Text,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
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

import { useDeviceDetect } from "lib/hooks";

import Enums from "@enums/index";
import { RiftlyModalCloseButton } from "@components/riftly/Buttons";

import { useRouter } from "next/router";
import { debounce } from "@utils/index";
import axios from "axios";
import { ChakraBox } from "@theme/additions/framer/FramerChakraComponent";

import "react-phone-number-input/style.css";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import { usePhoneCodeQuestSubmit, usePhoneNumberQuestSubmit } from "@shared/HOC/quest";

const WELCOME = 1;
const ENTER_PHONE = 2;
const ENTER_CODE = 3;
const VERIFIED = 4;
const ERROR = 5;

const SmsVerificationQuestModal = ({ isOpen, onClose, quest }) => {
    const router = useRouter();
    const { isMobile } = useDeviceDetect();
    const [error, errorSet] = useState();

    const [phoneError, phoneErrorSet] = useState(null);
    const [phoneNumber, phoneNumberSet] = useState("");

    const [codeError, codeErrorSet] = useState(null);
    const [code, codeSet] = useState("");

    const [currentView, setView] = useState(WELCOME);

    const [phoneCodeSentData, isSubmittingCode, submitCodeAsync] = usePhoneCodeQuestSubmit();
    const [phoneNumberSentData, isSubmittingPhoneNumber, submitPhoneNumberAsync] =
        usePhoneNumberQuestSubmit();

    const onEnterPhone = (e, phoneError) => {
        if (phoneError) {
            phoneErrorSet(null);
        }

        phoneNumberSet(e);
    };

    const onEnterCode = (val, codeError) => {
        if (codeError) {
            codeErrorSet(null);
        }
        codeSet(val);
    };

    const onSendPhone = async () => {
        let isPossibleNumber = isPossiblePhoneNumber(phoneNumber);
        if (!isPossibleNumber) {
            phoneErrorSet("Not a possible phone number.");
            return;
        }

        let payload = {
            questId: quest.questId,
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
            questId: quest.questId,
            code,
        };

        const sendCodeOp = await submitCodeAsync(payload);

        if (sendCodeOp.isError) {
            codeErrorSet(sendCodeOp.message);
            return;
        }
        setView(VERIFIED);
    };

    const handleOnClose = () => {
        errorSet(null);
        onClose();
    };
    const debouncedOnPhoneChangeHandler = useCallback(debounce(onEnterPhone, 300), []);

    return (
        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
            <ModalOverlay />
            <ModalContent
                borderRadius="16px"
                bg="brand.neutral4"
                minH="33%"
                w="33%"
                maxW="container.sm"
                mt="16%"
                transition={"1.25s"}
            >
                <RiftlyModalCloseButton onClose={handleOnClose} />

                <ModalBody
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    w="100%"
                    maxH={"100%"}
                >
                    <Flex
                        gap="24px"
                        direction="column"
                        alignItems={"center"}
                        justifyContent={"center"}
                        h="100%"
                        w="75%"
                        position={"relative"}
                    >
                        {currentView === WELCOME && (
                            <>
                                <Heading color="white" fontSize={"xl"} align="center">
                                    Sms Verification Quest
                                </Heading>

                                <Button
                                    variant="wallet"
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
                                <Heading color="white" fontSize={"xl"} align="center">
                                    Enter phone number for verification
                                </Heading>

                                <Box display={"flex"} color="black" w="100%">
                                    <PhoneInput
                                        style={{
                                            width: "100%",
                                        }}
                                        onChange={(e) =>
                                            debouncedOnPhoneChangeHandler(e, phoneError)
                                        }
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
                                    variant="wallet"
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
                                <Heading color="white" fontSize={"xl"} align="center">
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
                                        variant="wallet"
                                        onClick={() => setView(ENTER_PHONE)}
                                        borderRadius="24px"
                                    >
                                        <HStack>
                                            <Text>Back</Text>
                                        </HStack>
                                    </Button>
                                    <Button
                                        w={{ base: "45%" }}
                                        variant="wallet"
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

                        {/* {currentView === AUTHENTICATING && (
                            <Progress size="xs" isIndeterminate w="80%" />
                        )} */}

                        {currentView === ERROR && (
                            <>
                                <Heading color="white" fontSize={"xl"} align="center">
                                    Error sms verification
                                </Heading>
                                {error && <Text color="red.300">{error}</Text>}

                                <Button
                                    variant="blue"
                                    onClick={() => {
                                        setView(CONNECTABLE);
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

                                <Heading color="white" fontSize={"xl"} align="center" w="100%">
                                    Congrats!
                                </Heading>

                                <Text w="100%" color="brand.neutral0" align="center" fontSize="md">
                                    You finished Sms verification. Return to challenges to claim
                                    your reward.
                                </Text>

                                <Button
                                    w="100%"
                                    variant="blue"
                                    onClick={handleOnClose}
                                    minW="100%"
                                    borderRadius="24px"
                                >
                                    Back to Challenges
                                </Button>
                            </>
                        )}
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default SmsVerificationQuestModal;
