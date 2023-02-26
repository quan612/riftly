import React, { useEffect, useState, useContext } from "react";
import { Web3Context } from "@context/Web3Context";
import Enums from "enums";
import { useDeviceDetect } from "lib/hooks";
import { MetamaskIcon, WalletConnectIcon } from "@components/shared/Icons";
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
import { ShortContainer } from "containers/user";
import { useSession } from "next-auth/react"
import { useRouter } from "next/router";

const CONNECTABLE = 1;
const AUTHENTICATING = 2;
const AUTHENTICATED = 3;
const ERROR = 4;

export default function AdminSignIn() {
  const { adminSignIn, web3Error } = useContext(Web3Context);
  const [isMetamaskDisabled, setIsMetamaskDisabled] = useState(false);
  const { isMobile } = useDeviceDetect();
  const [currentView, setView] = useState(CONNECTABLE);
  const [error, errorSet] = useState();

  const { data: session, status } = useSession()
  const router = useRouter();

  useEffect(() => {

    if (session && session?.user?.isAdmin) {
      router.push("/admin")
    }
    const ethereum = window.ethereum;
    setIsMetamaskDisabled(!ethereum || !ethereum.on);
  }, []);

  return (
    <ShortContainer>
      <Flex gap={{ base: "1rem", lg: "3rem" }} direction="column" w="80%" h="80%" alignItems={"center"} justifyContent="center">
        {currentView === CONNECTABLE && (
          <>
            <Heading color="white" fontSize={"xl"} align="center">
              Admin Sign In
            </Heading>

            {!isMetamaskDisabled && (
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
            )}

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
    </ShortContainer>
  )
}

