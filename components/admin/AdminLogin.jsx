import React, { useEffect, useState, useContext } from "react";
import { Web3Context } from "@context/Web3Context";

import Enums from "enums";
import { useDeviceDetect } from "lib/hooks";

import {
    Heading,
    Box,
    Flex,
    Text,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    HStack,
    Icon,
    Progress,
} from "@chakra-ui/react";
import { RiftlyModalCloseButton } from "@components/riftly/Buttons";
import { MetamaskIcon, WalletConnectIcon } from "@components/riftly/Icons";

const CONNECTABLE = 1;
const AUTHENTICATING = 2;
const AUTHENTICATED = 3;
const ERROR = 4;

const AdminLogin = ({ isOpen, onClose }) => {
    const { adminSignIn, web3Error } = useContext(Web3Context);
    const [isMetamaskDisabled, setIsMetamaskDisabled] = useState(false);
    const { isMobile } = useDeviceDetect();
    const [currentView, setView] = useState(CONNECTABLE);
    const [error, errorSet] = useState();

    useEffect(() => {
        const ethereum = window.ethereum;
        setIsMetamaskDisabled(!ethereum || !ethereum.on);
    }, []);

    const handleOnClose = () => {
        errorSet(null);

        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
            <ModalOverlay />
            <ModalContent
                borderRadius="16px"
                bg="brand.neutral4"
                minH="30%"
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
                        gap="36px"
                        direction="column"
                        alignItems={"center"}
                        justifyContent={"center"}
                        h="100%"
                        w="75%"
                        position={"relative"}
                    >
                        {currentView === CONNECTABLE && (
                            <>
                                <Heading color="white" fontSize={"xl"} align="center">
                                    Admin Sign In
                                </Heading>

                                <Button
                                    variant="wallet"
                                    onClick={async () => {
                                        try {
                                            setView(AUTHENTICATING);
                                            await adminSignIn(Enums.METAMASK);
                                        } catch (error) {
                                            errorSet(error.message);
                                            setView(ERROR);
                                        }
                                    }}
                                    minW="100%"
                                    borderRadius="24px"
                                >
                                    <HStack>
                                        <MetamaskIcon />
                                        <Text>Metamask</Text>
                                    </HStack>
                                </Button>

                                <Button
                                    variant="twitter"
                                    onClick={async () => {
                                        try {
                                            setView(AUTHENTICATING);
                                            await adminSignIn(Enums.WALLETCONNECT);
                                        } catch (error) {
                                            errorSet(error.message);
                                            setView(ERROR);
                                        }
                                    }}
                                    minW="100%"
                                    borderRadius="24px"
                                >
                                    <HStack>
                                        <WalletConnectIcon />
                                        <Text>Wallet Connect</Text>
                                    </HStack>
                                </Button>
                            </>
                        )}

                        {currentView === AUTHENTICATING && (
                            <Progress size="xs" isIndeterminate w="80%" />
                        )}

                        {currentView === ERROR && (
                            <>
                                <Heading color="white" fontSize={"xl"} align="center">
                                    Error authenticating
                                </Heading>
                                {error && <Text color="red.300">{error}</Text>}
                                {web3Error && <Text color="red.300">{web3Error}</Text>}

                                <Button
                                    variant="blue"
                                    onClick={handleOnClose}
                                    minW="100%"
                                    borderRadius="24px"
                                    w="100%"
                                >
                                    Close
                                </Button>
                            </>
                        )}

                        {currentView === AUTHENTICATED && <Text>Redirecting...</Text>}
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AdminLogin;
