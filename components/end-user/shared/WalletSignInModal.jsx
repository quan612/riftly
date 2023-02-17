import React, { useEffect, useState, useContext, useCallback } from "react";
import { Heading, Text, Button, HStack, Progress } from "@chakra-ui/react";
import { useDeviceDetect } from "lib/hooks";
import { MetamaskIcon, WalletConnectIcon } from "@components/riftly/Icons";
import { Web3Context } from "@context/Web3Context";
import Enums from "@enums/index";
import { useRouter } from "next/router";
import ModalWrapper from "../wrappers/ModalWrapper";

const CONNECTABLE = 1;
const AUTHENTICATING = 2;
const AUTHENTICATED = 3;
const ERROR = 4;

const WalletSignInModal = ({ isOpen, onClose }) => {
    const { isMobile } = useDeviceDetect();
    const [error, errorSet] = useState();
    const { web3Error, signInWithWallet, setWeb3Error } = useContext(Web3Context);
    const [currentView, setView] = useState(CONNECTABLE);
    const router = useRouter();

    async function handleConnect(type) {
        setView(AUTHENTICATING);
        try {
            let res = await signInWithWallet(type);

            setView(AUTHENTICATED);
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
                    <Heading color="white" fontSize={"xl"} align="center">
                        Sign in with wallet
                    </Heading>

                    <Button
                        variant="wallet"
                        onClick={() => handleConnect(Enums.METAMASK)}
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
                        onClick={() => handleConnect(Enums.WALLETCONNECT)}
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
        </ModalWrapper>
    );
};

export default WalletSignInModal;
