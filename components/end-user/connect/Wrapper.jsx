import React, { useEffect, useState, useContext, useCallback, useRef } from "react";
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
import WalletAuthQuestModal from "../shared/riftly/WalletAuthQuestModal";
import WalletSignInModal from "../shared/riftly/WalletSignInModal";
import { DiscordIcon, GoogleIcon, TwitterIcon, WalletConnectIcon } from "@components/riftly/Misc";
import { useRouter } from "next/router";
import debounce from "@utils/debounce";
import { ShortContainer } from "containers/user";
import Enums from "enums";
import { signIn } from "next-auth/react";
import axios from "axios";
import { ChakraBox } from "@theme/additions/framer/FramerChakraComponent";
import { getDiscordAuthLink, getTwitterAuthLink } from "@utils/helpers";

const NON_EMAIL = 1;
const EMAIL = 2;
const FORGOT_PASSWORD = 3;
const SIGN_UP_SUCCESS = 4;

export const SignInSignUpWrapper = ({ isSignIn = false }) => {
    let router = useRouter();
    const walletSignInModal = useDisclosure();
    const walletSignUpModal = useDisclosure();
    const [view, setView] = useState(NON_EMAIL);

    const inputRefs = {
        emailRef: useRef(""),
        passwordRef: useRef(""),
    };

    return (
        <>
            {walletSignInModal?.isOpen && (
                <WalletSignInModal
                    isOpen={walletSignInModal.isOpen}
                    onClose={() => {
                        walletSignInModal.onClose();
                    }}
                />
            )}

            {walletSignUpModal?.isOpen && (
                <WalletAuthQuestModal
                    isSignUp={true}
                    isOpen={walletSignUpModal.isOpen}
                    onClose={() => {
                        walletSignUpModal.onClose();
                    }}
                />
            )}
            {view === NON_EMAIL && (
                <>
                    <Flex
                        flexDirection={"column"}
                        gap="8px"
                        justify="flex-start"
                        w="100%"
                        justifyContent={"flex-start"}
                    >
                        <Heading fontSize="24px" color="#fff" fontWeight={"700"}>
                            {isSignIn ? "Welcome Back!" : "Let's get started"}
                        </Heading>
                        <Text fontSize="md" color={"brand.neutral1"}>
                            {isSignIn
                                ? "Sign in with your credentials"
                                : "Create an account with your preferred method"}
                        </Text>
                    </Flex>
                    <ButtonGroup spacing="16px" w="100%" justifyContent={"space-between"}>
                        <Button
                            w={{ base: "192px" }}
                            onClick={async () => {
                                if (isSignIn) {
                                    signIn("discord", {
                                        callbackUrl: `${window.location.origin}`,
                                    });
                                } else {
                                    let discordLink = await getDiscordAuthLink();
                                    return window.open(discordLink, "_self");
                                }
                            }}
                            variant="discord"
                            size="lg"
                            fontWeight="semibold"
                            fontSize="18px"
                        >
                            <HStack>
                                <DiscordIcon />
                                <Text>Discord</Text>
                            </HStack>
                        </Button>

                        <Button
                            w={{ base: "192px" }}
                            onClick={async () => {
                                if (isSignIn) {
                                    signIn("twitter", {
                                        callbackUrl: `${window.location.origin}`,
                                    });
                                } else {
                                    let twitterLink = await getTwitterAuthLink();
                                    return window.open(twitterLink, "_self");
                                }
                            }}
                            variant="twitter"
                            size="lg"
                            fontWeight="semibold"
                            fontSize="18px"
                        >
                            <HStack>
                                <TwitterIcon />
                                <Text>Twitter</Text>
                            </HStack>
                        </Button>
                    </ButtonGroup>
                    <ButtonGroup spacing="16px" w="100%" justifyContent={"space-between"}>
                        <Button
                            w={{ base: "192px" }}
                            onClick={() => {
                                if (isSignIn) {
                                    // signIn("google",{
                                    //   callbackUrl: `${window.location.origin}`,
                                    // });
                                    // signIn("twitter");
                                } else {
                                    // let twitterLink = await getTwitterAuthLink();
                                    // return window.open(twitterLink, "_self");
                                }
                            }}
                            disabled={true}
                            variant="google"
                            size="lg"
                            borderRadius="48px"
                            fontWeight="semibold"
                            fontSize="18px"
                        >
                            <HStack>
                                <GoogleIcon />
                                <Text>Google</Text>
                            </HStack>
                        </Button>

                        <Button
                            w={{ base: "192px" }}
                            onClick={() => {
                                if (isSignIn) {
                                    walletSignInModal.onOpen();
                                } else {
                                    walletSignUpModal.onOpen();
                                }
                            }}
                            variant="wallet"
                            size="lg"
                            borderRadius="48px"
                            fontWeight="semibold"
                            fontSize="18px"
                        >
                            <HStack>
                                <WalletConnectIcon /> <Text>Wallet</Text>
                            </HStack>
                        </Button>
                    </ButtonGroup>
                    <Flex w="100%" justifyContent={"center"}>
                        <Flex w="33%" alignItems={"center"}>
                            <Divider color={"#597BA1"} opacity={"1"} />
                        </Flex>

                        <Heading w="33%" color="#fff" align={"center"} fontSize="24px">
                            or
                        </Heading>
                        <Flex w="33%" alignItems={"center"}>
                            <Divider color={"#597BA1"} opacity={"1"} />
                        </Flex>
                    </Flex>
                    <Flex
                        w="100%"
                        justifyContent={"center"}
                        flexDirection="column"
                        alignItems={"center"}
                        gap="24px"
                    >
                        <Input
                            variant={"riftly"}
                            type="text"
                            size="lg"
                            placeholder="Email"
                            ref={inputRefs.emailRef}
                            defaultValue={inputRefs.emailRef.current.value}
                        />
                        <Button
                            w="100%"
                            variant="blue"
                            size="lg"
                            fontSize="18px"
                            onClick={() => {
                                setView(EMAIL);
                                // if (isSignIn) {
                                //     // router.push(
                                //     //     ///"/user/email-sign-in"
                                //     //     {
                                //     //         pathname: "/user/email-sign-in",
                                //     //         query: { email: "Someone" },
                                //     //     }
                                //     // );

                                // } else {
                                //     // router.push(
                                //     //     //"/user/email-sign-up", options:{}
                                //     //     {
                                //     //         pathname: "/user/email-sign-up",
                                //     //         query: { email: "Someone" },
                                //     //     }
                                //     // );
                                // }
                            }}
                        >
                            Continue
                        </Button>
                        <Button
                            variant="ghost-blue"
                            fontSize="18px"
                            onClick={() => {
                                router.push("/");
                            }}
                        >
                            Back
                        </Button>
                    </Flex>
                </>
            )}
            {view === EMAIL && (
                <EmailWrapper isSignIn={isSignIn} setView={setView} ref={inputRefs} />
            )}
            {view === FORGOT_PASSWORD && <ForgotPassword setView={setView} />}
            {view === SIGN_UP_SUCCESS && (
                <ShortContainer>
                    <Image
                        src="/img/user/riftly-success.gif"
                        boxSize={{ sm: "40px", md: "60px", lg: "80px" }}
                    />
                    <Text color="#fff" exit={{ opacity: 0 }} align="center" fontSize="lg">
                        Sign up successful. Redirecting to dashboard.
                    </Text>
                </ShortContainer>
            )}
        </>
    );
};

export const EmailWrapper = React.forwardRef(({ isSignIn = false, setView }, ref) => {
    let router = useRouter();
    const [error, errorSet] = useState(null);

    const emailSignIn = async () => {
        const { emailRef, passwordRef } = ref;
        let email = emailRef.current.value;
        let password = passwordRef.current.value;
        if (!email || !password) {
            return errorSet("Email or password cannot be blank");
        }
        errorSet(null);
        let signInRes = await signIn("email", {
            redirect: false,
            email,
            password,
        });

        if (signInRes?.error) {
            errorSet(signInRes.error);
        } else {
            router.push("/");
        }
    };
    const emailSignUp = async () => {
        const { emailRef, passwordRef } = ref;

        let email = emailRef.current.value;
        let password = passwordRef.current.value;
        if (!email || !password) {
            return errorSet("Email or password cannot be blank");
        }
        errorSet(null);
        let payload = {
            email: ref.emailRef.current.value,
            password: ref.passwordRef.current.value,
        };

        let signUpRes = await axios.post(`/api/user/email-sign-up`, payload).then((r) => r.data);

        if (signUpRes.isError) {
            errorSet(signUpRes.message);
        } else {
            setView(SIGN_UP_SUCCESS);

            await signIn("email", {
                redirect: false,
                email,
                password,
            });
            router.push("/");
        }
    };
    return (
        <Flex
            flexDirection={"column"}
            gap="24px"
            justify="flex-start"
            w="100%"
            justifyContent={"flex-start"}
        >
            <Heading fontSize="24px" color="#fff" fontWeight={"700"}>
                {isSignIn ? "Continue with your email" : "Sign up with your email"}
            </Heading>

            <Input
                ref={ref.emailRef}
                defaultValue={ref.emailRef.current.value}
                variant={"riftly"}
                type="text"
                size="lg"
                placeholder="Email"
            />
            <Input
                ref={ref.passwordRef}
                variant={"riftly"}
                type="password"
                size="lg"
                placeholder="Password"
            />
            <Button
                w="100%"
                variant="blue"
                size="lg"
                fontSize="18px"
                onClick={() => {
                    if (isSignIn) {
                        emailSignIn();
                    } else {
                        emailSignUp();
                    }
                }}
            >
                {isSignIn ? "Sign In" : "Create Account"}
            </Button>

            <Button variant="ghost-blue" fontSize="18px" onClick={() => setView(NON_EMAIL)}>
                Back
            </Button>

            {error && (
                <ChakraBox color="red.300" key="email-sign-up-error" exit={{ opacity: 0 }}>
                    {error}
                </ChakraBox>
            )}

            {isSignIn && (
                <Flex justifyContent={"space-between"}>
                    <Text
                        fontSize="md"
                        color="brand.neutral1"
                        onClick={() => setView(FORGOT_PASSWORD)}
                        _hover={{
                            cursor: "pointer",
                        }}
                    >
                        Forgot password?
                    </Text>
                </Flex>
            )}
        </Flex>
    );
});

const ForgotPassword = ({ setView }) => {
    const [error, errorSet] = useState(null);
    const [email, emailSet] = useState("");
    const [password, passwordSet] = useState("");

    const handleEmailChange = (e, error) => {
        if (error) {
            errorSet(null);
        }

        emailSet(e.target.value);
    };

    const handlePasswordChange = (e, error) => {
        if (error) {
            errorSet(null);
        }

        passwordSet(e.target.value);
    };

    const handleReset = async () => {
        const payload = {
            email,
            password,
        };

        const resetPassword = await axios
            .post(`/api/user/password-reset`, payload)
            .then((r) => r.data);

        if (resetPassword.isError) {
            errorSet(resetPassword.message);
        } else {
            setView(RESET_PASSWORD_SUCCESS);
        }
    };

    const debouncedEmailChangeHandler = useCallback(debounce(handleEmailChange, 300), []);
    const debouncedPasswordChangeHandler = useCallback(debounce(handlePasswordChange, 300), []);
    return (
        <ShortContainer>
            <Heading color="brand.neutral0" fontWeight="bold" exit={{ opacity: 0 }}>
                Password Reset
            </Heading>

            <Input
                variant={"riftly"}
                type="text"
                size="lg"
                placeholder="Email"
                onChange={(e) => debouncedEmailChangeHandler(e, error)}
            />
            <Input
                variant={"riftly"}
                type="password"
                size="lg"
                placeholder="New Password"
                onChange={(e) => debouncedPasswordChangeHandler(e, error)}
            />
            <Button variant="blue" fontSize="18px" onClick={() => handleReset()}>
                Reset Password
            </Button>
        </ShortContainer>
    );
};
