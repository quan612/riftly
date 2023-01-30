import React, { useEffect, useState, useContext, useCallback, useRef } from "react";
import { Web3Context } from "@context/Web3Context";
import Enums from "enums";
import { signIn } from "next-auth/react";
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
import { ChakraBox } from "@theme/additions/framer/FramerChakraComponent";
import WalletSignInModal from "./shared/riftly/WalletSignInModal";

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

    useEffect(() => {
        const ethereum = window.ethereum;
        setIsMetamaskDisabled(!ethereum || !ethereum.on);

        if (process.env.NEXT_PUBLIC_ENABLE_CHALLENGER === "true") {
            setView(WELCOME);
        } else {
            setView(GONE_FISHING);
        }
    }, []);

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
        <>
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
                {/* {web3Error && (
                            <Text fontSize="lg" color="red.500">
                                {web3Error}
                            </Text>
                        )} */}
                {currentView === WELCOME && !web3Error && (
                    <ShortContainer>
                        <RiftlyLogo />

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
                                onClick={() => setView(SIGNUP_OPTIONS)}
                                size="lg"
                                variant="blue"
                            >
                                Get Started
                            </Button>

                            <Button
                                w={{ base: "192px" }}
                                onClick={() => setView(SIGNIN_OPTIONS)}
                                size="lg"
                                variant="signIn"
                            >
                                Sign In
                            </Button>
                        </ButtonGroup>
                    </ShortContainer>
                )}
                {(currentView === SIGNIN_OPTIONS || currentView === SIGNUP_OPTIONS) &&
                    !web3Error && (
                        <TallContainer>
                            <SignInSignUpWrapper
                                currentView={currentView}
                                goBack={goBack}
                                goNext={goNext}
                                ref={emailRefs}
                            />
                        </TallContainer>
                    )}

                {(currentView === SIGNIN_EMAIL || currentView === SIGNUP_EMAIL) && !web3Error && (
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
                        <Button
                            variant="blue"
                            fontSize="18px"
                            onClick={() => setView(SIGNIN_OPTIONS)}
                        >
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
                        <Button
                            variant="blue"
                            fontSize="18px"
                            onClick={() => setView(SIGNIN_OPTIONS)}
                        >
                            Back to Sign In
                        </Button>
                    </ShortContainer>
                )}
                {/* {currentView === AUTHENTICATING && !web3Error && (
                            <Progress size="xs" isIndeterminate w="80%" />
                        )} */}
            </Box>
        </>
    );
}

const RiftlyLogo = () => {
    return (
        <Flex flexDirection={"column"} gap="2%" alignItems={"center"}>
            <Box mb="12px">
                <svg
                    width="100"
                    height="47"
                    viewBox="0 0 100 47"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M99.042 23.1719C99.042 24.5865 97.8798 25.7397 96.4542 25.7397C89.2795 25.7397 83.4839 31.5058 83.4839 38.6096C83.4839 40.0242 82.3217 41.1774 80.8961 41.1774C79.4705 41.1774 78.3083 40.0242 78.3083 38.6096C78.3083 31.4904 72.4972 25.7397 65.338 25.7397C58.1788 25.7397 52.3678 31.5058 52.3678 38.6096V43.7606C52.3678 45.1752 51.2056 46.3284 49.7799 46.3284C48.3543 46.3284 47.1921 45.1752 47.1921 43.7606V38.6096C47.1921 31.4904 41.3811 25.7397 34.2219 25.7397C27.0627 25.7397 21.2516 31.5058 21.2516 38.6096C21.2516 40.0242 20.0894 41.1774 18.6638 41.1774C17.2381 41.1774 16.0759 40.0242 16.0759 38.6096C16.0759 31.4904 10.2649 25.7397 3.10569 25.7397C1.68005 25.7397 0.517838 24.5865 0.517838 23.1719C0.517838 21.7573 1.68005 20.6041 3.10569 20.6041C10.2804 20.6041 16.0759 14.838 16.0759 7.73421C16.0759 6.3196 17.2381 5.16639 18.6638 5.16639C20.0894 5.16639 21.2516 6.3196 21.2516 7.73421C21.2516 14.8534 27.0627 20.6041 34.2219 20.6041C41.3811 20.6041 47.1921 14.838 47.1921 7.73421V2.56782C47.1921 1.15321 48.3543 0 49.7799 0C51.2056 0 52.3678 1.15321 52.3678 2.56782V7.71884C52.3678 14.838 58.1788 20.5887 65.338 20.5887C72.4972 20.5887 78.3083 14.8226 78.3083 7.71884C78.3083 6.30423 79.4705 5.15102 80.8961 5.15102C82.3217 5.15102 83.4839 6.30423 83.4839 7.71884C83.4839 14.838 89.295 20.5887 96.4542 20.5887C97.8798 20.5887 99.042 21.7419 99.042 23.1565V23.1719Z"
                        fill="#1D63FF"
                    />
                </svg>
            </Box>
            <svg
                width="139"
                height="22"
                viewBox="0 0 139 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M11.932 22L8.3369 14.8039H5.51661V22H0V0.780884H10.7078C15.4496 0.780884 18.1459 3.90224 18.1459 7.83854C18.1459 11.5288 15.868 13.497 13.8845 14.2043L18.2389 22H11.9165H11.932ZM9.88651 5.39373H5.53211V10.1603H9.88651C11.3276 10.1603 12.5518 9.23777 12.5518 7.77704C12.5518 6.3163 11.3276 5.39373 9.88651 5.39373Z"
                    fill="white"
                />
                <path d="M29.1017 22V0.780884H34.6183V22H29.1017Z" fill="white" />
                <path
                    d="M46.4108 22V0.780884H62.0929V5.39373H51.9274V8.93025H61.8759V13.5739H51.9274V22H46.4108Z"
                    fill="white"
                />
                <path
                    d="M77.6045 22V5.54749H71.6075V0.780884H89.0871V5.54749H83.1211V22H77.6045Z"
                    fill="white"
                />
                <path d="M99.0356 22V0.780884H104.552V17.2334H113.153V22H99.0356Z" fill="white" />
                <path
                    d="M125.41 22V13.4355L117.29 0.765503H123.504L128.153 8.59197L132.74 0.765503H139L130.927 13.4355V22H125.41Z"
                    fill="white"
                />
            </svg>
        </Flex>
    );
};

const SignInSignUpWrapper = React.forwardRef(({ currentView, goBack, goNext }, ref) => {
    const walletModal = useDisclosure();

    return (
        <>
            {walletModal?.isOpen && (
                <WalletSignInModal
                    isOpen={walletModal.isOpen}
                    onClose={() => {
                        walletModal.onClose();
                    }}
                />
            )}
            <Flex
                flexDirection={"column"}
                gap="8px"
                justify="flex-start"
                w="100%"
                justifyContent={"flex-start"}
            >
                <Heading fontSize="24px" color="#fff" fontWeight={"700"}>
                    {currentView === SIGNIN_OPTIONS ? "Welcome Back!" : "Let's get started"}
                </Heading>
                <Text fontSize="md" color={"brand.neutral1"}>
                    {currentView === SIGNIN_OPTIONS
                        ? "Sign in with your credentials"
                        : "Create an account with your preferred method"}
                </Text>
            </Flex>
            <ButtonGroup spacing="16px" w="100%" justifyContent={"space-between"}>
                <Button
                    w={{ base: "192px" }}
                    onClick={async () => {
                        if (currentView === SIGNIN_OPTIONS) {
                            signIn("discord");
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
                        <Icon transition="0.8s" color="purple.300" as={BsDiscord} />
                        <Text>Discord</Text>
                    </HStack>
                </Button>

                <Button
                    w={{ base: "192px" }}
                    onClick={async () => {
                        if (currentView === SIGNIN_OPTIONS) {
                            signIn("twitter");
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
                        <Icon transition="0.8s" color="blue.300" as={BsTwitter} />
                        <Text>Twitter</Text>
                    </HStack>
                </Button>
            </ButtonGroup>
            <ButtonGroup spacing="16px" w="100%" justifyContent={"space-between"}>
                <Button
                    w={{ base: "192px" }}
                    onClick={() => {
                        if (currentView === SIGNIN_OPTIONS) {
                            // signIn("google");signIn("twitter");
                        } else {
                            // let twitterLink = await getTwitterAuthLink();
                            // return window.open(twitterLink, "_self");
                        }
                    }}
                    variant="google"
                    size="lg"
                    borderRadius="48px"
                    fontWeight="semibold"
                    fontSize="18px"
                >
                    <HStack>
                        <Icon transition="0.8s" color="red.300" as={BsGoogle}></Icon>
                        <Text>Google</Text>
                    </HStack>
                </Button>

                <Button
                    w={{ base: "192px" }}
                    // onClick={() => authenticateUsingWallet(Enums.METAMASK)}
                    onClick={() => {
                        if (currentView === SIGNIN_OPTIONS) {
                            // signIn("google");signIn("twitter");
                            walletModal.onOpen();
                        } else {
                            // let twitterLink = await getTwitterAuthLink();
                            // return window.open(twitterLink, "_self");
                        }
                    }}
                    variant="wallet"
                    size="lg"
                    borderRadius="48px"
                    fontWeight="semibold"
                    fontSize="18px"
                >
                    <HStack>
                        <Icon transition="0.8s" color="orange.300" as={RiWallet3Fill}></Icon>
                        <Text>Wallet</Text>
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
                    ref={ref.emailRef}
                    variant={"riftly"}
                    type="text"
                    size="lg"
                    placeholder="Email"
                />
                <Button w="100%" variant="blue" size="lg" fontSize="18px" onClick={goNext}>
                    Continue
                </Button>
                <Button variant="ghost-blue" fontSize="18px" onClick={goBack}>
                    Back
                </Button>
            </Flex>
        </>
    );
});

const EmailWrapper = React.forwardRef(({ currentView, goBack, goNext, setView }, ref) => {
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
            goNext();
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
                {currentView === SIGNIN_EMAIL
                    ? "Continue with your email"
                    : "Sign up with your email"}
            </Heading>

            <Input
                ref={ref.emailRef}
                defaultValue={ref.emailRef.current.value}
                variant={"riftly"}
                type="text"
                size="lg"
                placeholder="Email"
                // onChange={(e) => debouncedChangeHandler(e, inputError)}
            />
            <Input
                ref={ref.passwordRef}
                variant={"riftly"}
                type="password"
                size="lg"
                placeholder="Password"
                // onChange={(e) => debouncedChangeHandler(e, inputError)}
            />
            <Button
                w="100%"
                variant="blue"
                size="lg"
                fontSize="18px"
                onClick={() => {
                    if (currentView === SIGNIN_EMAIL) {
                        emailSignIn();
                    } else {
                        emailSignUp();
                    }
                }}
            >
                {currentView === SIGNIN_EMAIL ? "Sign In" : "Create Account"}
            </Button>

            <Button variant="ghost-blue" fontSize="18px" onClick={goBack}>
                Back
            </Button>

            {error && (
                <ChakraBox layout color="red.300" key="email-sign-up-error" exit={{ opacity: 0 }}>
                    {error}
                </ChakraBox>
            )}

            {currentView === SIGNIN_EMAIL && (
                <Flex justifyContent={"space-between"}>
                    {/* <Checkbox color="brand.neutral1">Remember me</Checkbox> */}
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

const TallContainer = ({ children }) => {
    return (
        <Container
            maxW="container.sm"
            bg={"brand.neutral4"}
            color="#262626"
            height={"536px"}
            borderRadius="16px"
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
        >
            <Flex
                w="66%"
                h="80%"
                flexDirection={"column"}
                alignItems={"center"}
                justifyContent={"space-around"}
                gap="24px"
            >
                {children}
            </Flex>
        </Container>
    );
};
const ShortContainer = ({ children }) => {
    return (
        <Container
            maxW="container.sm"
            bg={"brand.neutral4"}
            color="#262626"
            height={"429px"}
            borderRadius="16px"
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            zIndex="2"
        >
            <Flex
                w="66%"
                h="80%"
                flexDirection={"column"}
                alignItems={"center"}
                justifyContent={"space-around"}
            >
                {children}
            </Flex>
        </Container>
    );
};

// return (
//     <div className={s.board}>
//         <div className={s.board_container}>
//             <BoardSmallDollarSign />
//             <div className={s.board_wrapper}>
//                 <div className={s.board_content}>
//                     <>
//                         {web3Error && (
//                             <>
//                                 <div className={s.board_text}>{web3Error}</div>
//                             </>
//                         )}
//                         {currentView === WELCOME && !web3Error && (
//                             <>
//                                 <img
//                                     className={s.board_headingIcon}
//                                     src={`${Enums.BASEPATH}/img/sharing-ui/invite/starfish.gif`}
//                                 />
//                                 <div className={s.board_title}>
//                                     Welcome to the Cove’s DeepSea Challenger!
//                                 </div>
//                                 <div className={s.board_text}>Connect to continue</div>
//                                 <button
//                                     className={s.board_pinkBtn}
//                                     onClick={() => setView(CONNECT_OPTIONS)}
//                                 >
//                                     <img
//                                         src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large.png`}
//                                         alt="connectToContinue"
//                                     />
//                                     <div>
//                                         <span>Connect</span>
//                                     </div>
//                                 </button>
//                             </>
//                         )}
//                         {currentView === GONE_FISHING && !web3Error && (
//                             <>
//                                 <div className={s.board_goneFishTitle}>
//                                     CLOSED - GONE FISHIN'
//                                 </div>
//                                 <div className={s.board_goneFishText}>
//                                     The DeepSea Challenger has been paused.
//                                 </div>
//                                 <div className={s.board_goneFishText}>
//                                     Check back on <span>November 15</span>!
//                                 </div>
//                                 <button
//                                     className={s.board_pinkBtn}
//                                     onClick={() => setView(CONNECT_OPTIONS)}
//                                 >
//                                     <img
//                                         src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large.png`}
//                                         alt="connectToContinue"
//                                     />
//                                     <div>
//                                         <span>Connect</span>
//                                     </div>
//                                 </button>
//                             </>
//                         )}
//                         {currentView === CONNECT_OPTIONS && !web3Error && (
//                             <div className={` ${s.board_signin_wrapper}`}>
//                                 <div className={s.board_signin_content}>
//                                     {process.env.NEXT_PUBLIC_ENABLE_CHALLENGER === "true" && (
//                                         <button
//                                             className={s.board_orangeBtn}
//                                             onClick={() => router.push(`/user/signup`)}
//                                         >
//                                             <img
//                                                 src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large 2.png`}
//                                                 alt="Sign Up"
//                                             />
//                                             <div>
//                                                 <span>Sign Up</span>
//                                             </div>
//                                         </button>
//                                     )}
//                                     <button
//                                         className={s.board_tealBtn}
//                                         onClick={() => setView(SIGNIN_OPTIONS)}
//                                     >
//                                         <img
//                                             src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large 3.png`}
//                                             alt="connectToContinue"
//                                         />
//                                         <div>
//                                             <span>Login</span>
//                                         </div>
//                                     </button>
//                                 </div>
//                             </div>
//                         )}

//                         {currentView === SIGNIN_OPTIONS && !web3Error && (
//                             <div className={` ${s.board_signin_wrapper}`}>
//                                 <div className={s.board_signin_content}>
//                                     <button
//                                         className={s.board_orangeBtn}
//                                         onClick={() => setView(WALLET_AUTH)}
//                                     >
//                                         <img
//                                             src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large 2.png`}
//                                             alt="connectToContinue"
//                                         />
//                                         <div>
//                                             <span>Wallet</span>
//                                         </div>
//                                     </button>
//                                     <button
//                                         className={s.board_tealBtn}
//                                         onClick={() => setView(SOCIAL_AUTH)}
//                                     >
//                                         <img
//                                             src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large 3.png`}
//                                             alt="connectToContinue"
//                                         />
//                                         <div>
//                                             <span>Social Media</span>
//                                         </div>
//                                     </button>
//                                 </div>
//                             </div>
//                         )}

//                         {currentView === SOCIAL_AUTH && !web3Error && (
//                             <div className={` ${s.board_signin_wrapper}`}>
//                                 <div className={s.board_signin_content}>
//                                     <button
//                                         className={s.board_purpleBtn}
//                                         onClick={() => {
//                                             signIn("discord");
//                                         }}
//                                     >
//                                         <img
//                                             src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large 4.png`}
//                                             alt="connectToContinue"
//                                         />
//                                         <div>
//                                             <span> Discord</span>
//                                         </div>
//                                     </button>
//                                     <button
//                                         className={s.board_tealBtn}
//                                         onClick={() => {
//                                             signIn("twitter");
//                                         }}
//                                     >
//                                         <img
//                                             src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large 3.png`}
//                                             alt="connectToContinue"
//                                         />
//                                         <div>
//                                             <span> Twitter</span>
//                                         </div>
//                                     </button>
//                                 </div>
//                             </div>
//                         )}

//                         {currentView === WALLET_AUTH && !web3Error && (
//                             <div className={` ${s.board_signin_wrapper}`}>
//                                 <div className={s.board_signin_content}>
//                                     {!isMetamaskDisabled && !isMobile && (
//                                         <button
//                                             className={s.board_orangeBtn}
//                                             onClick={() =>
//                                                 authenticateUsingWallet(Enums.METAMASK)
//                                             }
//                                         >
//                                             <img
//                                                 src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large 2.png`}
//                                                 alt="Metamask Connect"
//                                             />
//                                             <div>
//                                                 <span> MetaMask</span>
//                                             </div>
//                                         </button>
//                                     )}
//                                     {/* {!isMetamaskDisabled && !isMobile && (
//                                         <button
//                                             className={s.unstoppableBtn}
//                                             onClick={() => authenticateUsingUnstoppable()}
//                                         >
//                                             <img
//                                                 src={`${Enums.BASEPATH}/img/sharing-ui/invite/unstoppable.png`}
//                                                 alt="connectToContinue"
//                                             />
//                                             <div>
//                                                 <svg
//                                                     width="36"
//                                                     height="36"
//                                                     viewBox="0 0 24 24"
//                                                     fill="none"
//                                                     xmlns="http://www.w3.org/2000/svg"
//                                                 >
//                                                     <path
//                                                         fillRule="evenodd"
//                                                         clipRule="evenodd"
//                                                         d="M23 2.34473V9.93093L1 18.8965L23 2.34473Z"
//                                                         fill="#2FE9FF"
//                                                     />
//                                                     <path
//                                                         fillRule="evenodd"
//                                                         clipRule="evenodd"
//                                                         d="M18.875 2V15.1034C18.875 18.9123 15.797 22 12 22C8.20304 22 5.125 18.9123 5.125 15.1034V9.58621L9.25 7.31034V15.1034C9.25 16.4365 10.3273 17.5172 11.6562 17.5172C12.9852 17.5172 14.0625 16.4365 14.0625 15.1034V4.65517L18.875 2Z"
//                                                         fill="white"
//                                                     />
//                                                 </svg>
//                                                 <span> Unstoppable</span>
//                                             </div>
//                                         </button>
//                                     )} */}
//                                     <button
//                                         className={s.purpleBtn}
//                                         onClick={() =>
//                                             authenticateUsingWallet(Enums.WALLETCONNECT)
//                                         }
//                                     >
//                                         <img
//                                             src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large 4.png`}
//                                             alt="connectToContinue"
//                                         />
//                                         <div>
//                                             <span> Wallet Connect</span>
//                                         </div>
//                                     </button>
//                                 </div>
//                             </div>
//                         )}

//                         {currentView === AUTHENTICATING && !web3Error && (
//                             <div className={s.board_loading}>
//                                 <div className={s.board_loading_wrapper}>
//                                     <img
//                                         src={`${Enums.BASEPATH}/img/sharing-ui/Loading_Blob fish.gif`}
//                                         alt="Loading data"
//                                     />
//                                     <div className={s.board_loading_wrapper_text}>
//                                         Awaiting
//                                         <span
//                                             className={s.board_loading_wrapper_text_ellipsis}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </>
//                 </div>
//             </div>
//         </div>
//         {((currentView !== WELCOME &&
//             currentView !== GONE_FISHING &&
//             currentView !== CONNECT_OPTIONS &&
//             currentView !== AUTHENTICATING) ||
//             web3Error) && (
//             <button className={s.board_disconnect} onClick={() => GoBack()}>
//                 <img
//                     src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Disconnect.png`}
//                     alt="Back"
//                 />
//                 <div>
//                     <span>Back</span>
//                 </div>
//             </button>
//         )}
//     </div>
// );
