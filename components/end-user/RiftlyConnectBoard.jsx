import React, { useEffect, useState, useContext, useCallback, useRef } from "react";
import { Web3Context } from "@context/Web3Context";

import { useRouter } from "next/router";
import { useDeviceDetect } from "lib/hooks";

import {
    Heading,
    Box,
    Flex,
    Text,
    Button,
    useColorMode,
    useColorModeValue,
    useDisclosure,
    Divider,
    ButtonGroup,
    Icon,
    Container,
    VStack,
    HStack,
    Center,
    Progress,
    Image,
    Input,
    Checkbox,
} from "@chakra-ui/react";

const WELCOME = 0;
const SIGNIN_OPTIONS = 2;
const SIGNUP_OPTIONS = 3;

const SIGNIN_EMAIL = 20;
const SIGNUP_EMAIL = 21;
const SIGNUP_EMAIL_SUCCESS = 22;
const FORGOT_PASSWORD = 23;
const RESET_PASSWORD_SUCCESS = 24;
const AUTHENTICATING = 10;
const GONE_FISHING = 11;

import { BsTwitter, BsDiscord, BsGoogle } from "react-icons/bs";
import { RiWallet3Fill } from "react-icons/ri";
import { HeadingLg } from "@components/riftly/Typography";
import debounce from "@utils/debounce";
import { getDiscordAuthLink, getTwitterAuthLink } from "@utils/helpers";
import axios from "axios";

import { ShortContainer } from "containers/user";
import { RiftlyLogoWhiteText } from "@components/riftly/Logo";

export default function RiftlyConnectBoard() {
    let router = useRouter();
    const { web3Error, signInWithWallet, setWeb3Error, tryConnectAsUnstoppable } =
        useContext(Web3Context);
    const [currentView, setView] = useState(WELCOME);
    const [isMetamaskDisabled, setIsMetamaskDisabled] = useState(false);
    const { isMobile } = useDeviceDetect();
    const [email, emailSet] = useState("");
    const [inputError, setInputError] = useState(null);

    const emailRefs = {
        emailRef: useRef(null),
        passwordRef: useRef(null),
    };

    // useEffect(() => {
    //     const ethereum = window.ethereum;
    //     setIsMetamaskDisabled(!ethereum || !ethereum.on);

    //     if (process.env.NEXT_PUBLIC_ENABLE_CHALLENGER === "true") {
    //         setView(WELCOME);
    //     } else {
    //         setView(GONE_FISHING);
    //     }
    // }, []);

    const authenticateUsingWallet = async (walletType) => {
        setView(AUTHENTICATING);
        signInWithWallet(walletType);
    };

    const handleOnChange = (e, error) => {
        if (error) {
            setInputError(null);
        }
    };

    const debouncedChangeHandler = useCallback(debounce(handleOnChange, 300), []);

    const authenticateUsingUnstoppable = async () => {
        setView(AUTHENTICATING);
        tryConnectAsUnstoppable();
    };

    const goBack = () => {
        if (currentView === SIGNIN_OPTIONS || currentView === SIGNUP_OPTIONS) {
            return setView(WELCOME);
        }

        if (currentView === SIGNIN_EMAIL) {
            return setView(SIGNIN_OPTIONS);
        }
        if (currentView === SIGNUP_EMAIL) {
            return setView(SIGNUP_OPTIONS);
        }

        if (currentView === AUTHENTICATING) {
            setWeb3Error(null);
            return setView(CONNECT_OPTIONS);
        }
    };
    const goNext = () => {
        if (currentView === SIGNIN_OPTIONS) {
            return setView(SIGNIN_EMAIL);
        }
        if (currentView === SIGNUP_OPTIONS) {
            return setView(SIGNUP_EMAIL);
        }
        if (currentView === SIGNUP_EMAIL) {
            return setView(SIGNUP_EMAIL_SUCCESS);
        }
    };

    return (
        <Box
            position="absolute"
            w="100%"
            h="100%"
            backgroundImage="/img/user/banner.png"
            backgroundPosition="center"
            backgroundSize={"cover"}
            backgroundRepeat="no-repeat"
            display={"flex"}
            alignItems="center"
            justifyContent={"center"}
        >
            <ShortContainer>
                <RiftlyLogoWhiteText />

                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Heading size="lg" color="#fff" mb="16px">
                        Welcome to Riftly
                    </Heading>
                    <Text fontSize="lg" color={"brand.neutral1"}>
                        Join Riftly or sign in to continue
                    </Text>
                </Flex>
                <ButtonGroup spacing="16px" display={"flex"} flexDirection="row">
                    <Button
                        w={{ base: "192px" }}
                        // onClick={() => setView(SIGNUP_OPTIONS)}
                        onClick={() => router.push("/user/sign-up")}
                        size="lg"
                        variant="blue"
                    >
                        Get Started
                    </Button>

                    <Button
                        w={{ base: "192px" }}
                        // onClick={() => setView(SIGNIN_OPTIONS)}
                        onClick={() => router.push("/user/sign-in")}
                        size="lg"
                        variant="signIn"
                    >
                        Sign In
                    </Button>
                </ButtonGroup>
            </ShortContainer>

            {/* {(currentView === SIGNIN_EMAIL || currentView === SIGNUP_EMAIL) && !web3Error && (
                <TallContainer>
                    <EmailWrapper
                        currentView={currentView}
                        goBack={goBack}
                        setView={setView}
                        ref={emailRefs}
                    />
                </TallContainer>
            )}
            {currentView === SIGNUP_EMAIL_SUCCESS && (
                <ShortContainer>
                    <Image
                        src="/img/user/riftly-success.gif"
                        boxSize={{ sm: "40px", md: "60px", lg: "80px" }}
                    />
                    <Box color="green.300" exit={{ opacity: 0 }}>
                        Sign up successful.
                    </Box>
                    <Button variant="blue" fontSize="18px" onClick={() => setView(SIGNIN_OPTIONS)}>
                        Back to Sign In
                    </Button>
                </ShortContainer>
            )}

            {currentView === FORGOT_PASSWORD && <ForgotPassword setView={setView} />}
            {currentView === RESET_PASSWORD_SUCCESS && (
                <ShortContainer>
                    <Image
                        src="/img/user/riftly-success.gif"
                        boxSize={{ sm: "40px", md: "60px", lg: "80px" }}
                    />
                    <Box color="green.300" exit={{ opacity: 0 }}>
                        Password reset successful.
                    </Box>
                    <Button variant="blue" fontSize="18px" onClick={() => setView(SIGNIN_OPTIONS)}>
                        Back to Sign In
                    </Button>
                </ShortContainer>
            )} */}
            {/* {currentView === AUTHENTICATING && !web3Error && (
                            <Progress size="xs" isIndeterminate w="80%" />
                        )} */}
        </Box>
    );
}
