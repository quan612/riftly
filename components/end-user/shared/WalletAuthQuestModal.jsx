import React, { useEffect, useState, useContext, useCallback } from "react";
import {
    Heading,
    Box,
    Flex,
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
} from "@chakra-ui/react";

import { useDeviceDetect } from "lib/hooks";

import { Web3Context } from "@context/Web3Context";
import Enums from "@enums/index";

import { useWalletAuthQuestSubmit } from "@shared/HOC/quest";
import { useRouter } from "next/router";
import { MetamaskIcon, WalletConnectIcon } from "@components/riftly/Icons";
import ModalWrapper from "../wrappers/ModalWrapper";

const CONNECTABLE = 1;
const AUTHENTICATING = 2;
const AUTHENTICATED = 3;
const ERROR = 4;

const WalletAuthQuestModal = ({ isOpen, onClose, isSignUp = false }) => {
    const router = useRouter();
    const { isMobile } = useDeviceDetect();
    const [error, errorSet] = useState();
    const { web3Error, signUpWithWallet, setWeb3Error, signInWithWallet } = useContext(Web3Context);
    const [currentView, setView] = useState(CONNECTABLE);

    const [walletAuthQuestData, isSubmittingQuest, walletAuthQuestSubmit] =
        useWalletAuthQuestSubmit();

    useEffect(() => {}, []);

    async function handleConnect(type) {
        setView(AUTHENTICATING);
        try {
            let payload = await signUpWithWallet(type).catch((err) => {
                throw err;
            });
            console.log(payload);

            let res = await walletAuthQuestSubmit(payload).catch((err) => {
                throw err;
            });
            //   console.log("res", res);
            if (!res.isError) {
                if (isSignUp) {
                    await signInWithWallet(type, payload);
                } else {
                    setView(AUTHENTICATED);
                }
            } else {
                errorSet(res.message);
                setView(ERROR);
            }
        } catch (error) {
            errorSet(error.message);
            setView(ERROR);
        }
    }

    const handleOnClose = () => {
        errorSet(null);
        setWeb3Error(null);
        onClose();
    };

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} handleOnClose={handleOnClose}>
            {currentView === CONNECTABLE && (
                <>
                    <Heading color="white" fontSize={"3xl"} align="center">
                        Connect with wallet
                    </Heading>

                    <Button
                        variant="wallet"
                        onClick={() => handleConnect(Enums.METAMASK)}
                        minW="100%"
                        borderRadius="24px"
                        size="lg"
                    >
                        <HStack>
                            <MetamaskIcon />
                            <Text>Metamask</Text>
                        </HStack>
                    </Button>

                    <Button
                        variant="twitter"
                        onClick={() => handleConnect(Enums.WALLETCONNECT)}
                        minW="100%"
                        borderRadius="24px"
                        size="lg"
                    >
                        <HStack>
                            <WalletConnectIcon />
                            <Text>Wallet Connect</Text>
                        </HStack>
                    </Button>
                </>
            )}

            {currentView === AUTHENTICATING && <Progress size="xs" isIndeterminate w="80%" />}

            {(currentView === ERROR || web3Error) && (
                <>
                    <Heading color="white" fontSize={"xl"} align="center">
                        Error authenticating
                    </Heading>
                    {error && <Text color="red.300">{error}</Text>}
                    {web3Error && <Text color="red.300">{web3Error}</Text>}

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

            {currentView === AUTHENTICATED && (
                <>
                    <Image
                        src="/img/user/riftly-success.gif"
                        boxSize={{ sm: "40px", md: "60px", lg: "80px" }}
                    />

                    <Heading color="white" fontSize={"xl"} align="center" w="100%">
                        Congrats!
                    </Heading>

                    {isSignUp && (
                        <Text w="100%" color="brand.neutral0" align="center" fontSize="md">
                            Wallet linked successfully
                        </Text>
                    )}
                    {!isSignUp && (
                        <Text w="100%" color="brand.neutral0" align="center" fontSize="md">
                            You finished wallet authentication. Return to challenges to claim your
                            reward.
                        </Text>
                    )}

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
        </ModalWrapper>
    );
};

export default WalletAuthQuestModal;
