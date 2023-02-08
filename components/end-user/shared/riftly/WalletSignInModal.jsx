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
} from "@chakra-ui/react";

import { CloseButton } from "@chakra-ui/react";
import { useDeviceDetect } from "lib/hooks";
import { MetamaskIcon, WalletConnectIcon } from "./RiftlyIcon";
import { Web3Context } from "@context/Web3Context";
import Enums from "@enums/index";
import { RiftlyModalCloseButton } from "@components/riftly/Buttons";
import { useRouter } from "next/router";

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
                  Connect with wallet
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

            {currentView === AUTHENTICATING && (
              <Progress size="xs" isIndeterminate w="80%" />
            )}

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
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default WalletSignInModal;
