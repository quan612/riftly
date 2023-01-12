import React, { useEffect, useState, useContext, useRef } from "react";
import s from "/sass/claim/claim.module.css";
import { Web3Context } from "@context/Web3Context";
import { useRouter } from "next/router";
import Enums from "enums";
import { BoardSmallDollarSign } from "@components/end-user";
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useDeviceDetect } from "lib/hooks";

const util = require("util");

export const SIGNUP = 0;
export const SIGNUP_CAPTCHA = 1;
export const SIGNUP_OPTIONS = 2;
export const SIGNUP_WALLET = 3;
export const SIGNUP_SOCIAL = 4;

export const SIGNUP_AWAIT = 5;
export const SIGNUP_SUCCESS = 6;
export const SIGNUP_ERROR = 7;
function SignUp({ session }) {
    const [currentPrompt, setPrompt] = useState(SIGNUP);

    const { web3Error, TrySignUpWithWallet, setWeb3Error } = useContext(Web3Context);
    const router = useRouter();
    let redirectTimeout;
    const [isMetamaskDisabled, setIsMetamaskDisabled] = useState(false);
    const { isMobile } = useDeviceDetect();
    const captchaRef = useRef(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        if (session) {
            router.push("/");
        }
    }, [session]);

    useEffect(() => {
        const ethereum = window.ethereum;
        setIsMetamaskDisabled(!ethereum || !ethereum.on);
        return () => {
            clearTimeout(redirectTimeout);
        };
    }, []);

    const changeView = async (viewState) => {
        setPrompt(viewState);
    };

    const handleSignUp = async (typeOfSignUp) => {

        changeView(SIGNUP_AWAIT);

        if (typeOfSignUp == Enums.WALLETCONNECT || typeOfSignUp == Enums.METAMASK) {
            let signUpResult
            signUpResult = await TrySignUpWithWallet(typeOfSignUp);
            if (signUpResult === true) {
                changeView(SIGNUP_SUCCESS);

                redirectTimeout = setTimeout(() => {
                    router.push("/");
                }, 1500);
            } else {
                changeView(SIGNUP_ERROR);
            }
        }
        // sign up through social medioa
        else {
            if (typeOfSignUp === Enums.DISCORD_AUTH) {
                let discordLink = await getDiscordAuthLink();

                return window.open(discordLink, "_self");
            }

            if (typeOfSignUp === Enums.TWITTER_AUTH) {
                let twitterLink = await getTwitterAuthLink();
                return window.open(twitterLink, "_self");
            }
        }



    };
    const GoBack = () => {
        if (currentPrompt === SIGNUP_ERROR) {
            setWeb3Error(null);
            router.push("/");
            return
        }
        router.push("/");
        return
    };

    const handleChallenge = () => {
        // this reaches out to the hcaptcha library and runs the
        // execute function on it. you can use other functions as well
        // documented in the api:
        // https://docs.hcaptcha.com/configuration#jsapi

        captchaRef.current.execute();

        // changeView(SIGNUP_OPTIONS);
    };

    const handleVerificationSuccess = (token, ekey) => {
        try {
            captchaRef?.current?.resetCaptcha();
        } catch (error) {

        }
        changeView(SIGNUP_OPTIONS);
    }

    return (
        <>
            <div className={s.app}>
                <div className={s.board}>
                    <div className={s.board_container}>
                        <BoardSmallDollarSign />
                        <div className={s.board_wrapper}>
                            <div className={s.board_content}>
                                {(currentPrompt === SIGNUP_ERROR || web3Error) && (
                                    <>
                                        <div className={`${s.board_text}`}>{web3Error}</div>
                                        <button
                                            className={s.board_pinkBtn}
                                            onClick={() => {
                                                setWeb3Error(null);
                                                return router.push("/");
                                            }}
                                        >
                                            <img
                                                src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large.png`}
                                                alt="connectToContinue"
                                            />
                                            <div>
                                                <span>Go Back</span>
                                            </div>
                                        </button>
                                    </>
                                )}

                                {currentPrompt === SIGNUP && !web3Error && (
                                    <>
                                        <img
                                            className={s.board_headingIcon}
                                            src={`${Enums.BASEPATH}/img/sharing-ui/invite/starfish.gif`}
                                        />
                                        <div className={s.board_title}>
                                            Welcome to the Cove’s DeepSea Challenger!
                                        </div>
                                        <div className={s.board_text}>
                                            Sign Up with your account
                                        </div>

                                        <button
                                            className={s.board_orangeBtn}
                                            onClick={() => {
                                                if (process.env.NODE_ENV !== 'development') {
                                                    // on production we use captcha
                                                    changeView(SIGNUP_CAPTCHA)
                                                } else {
                                                    changeView(SIGNUP_OPTIONS)
                                                }

                                            }}
                                        >
                                            <img
                                                src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large 2.png`}
                                                alt="connectToContinue"
                                            />
                                            <div>
                                                <span>Sign Up</span>
                                            </div>
                                        </button>
                                    </>
                                )}
                                {currentPrompt === SIGNUP_OPTIONS && !web3Error && (
                                    <div className={` ${s.board_signin_wrapper}`}>
                                        <div className={s.board_signin_content}>
                                            <button
                                                className={s.board_orangeBtn}
                                                onClick={() => changeView(SIGNUP_WALLET)}
                                            >
                                                <img
                                                    src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large 2.png`}
                                                    alt="Sign Up With Wallet"
                                                />
                                                <div>
                                                    <span>Crypto Wallet</span>
                                                </div>
                                            </button>
                                            <button
                                                className={s.board_tealBtn}
                                                onClick={() => changeView(SIGNUP_SOCIAL)}
                                            >
                                                <img
                                                    src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large 3.png`}
                                                    alt="Sign Up With Social Media"
                                                />
                                                <div>
                                                    <span>Social Account</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {currentPrompt === SIGNUP_WALLET && !web3Error && (
                                    <div className={` ${s.board_signin_wrapper}`}>
                                        <div className={s.board_signin_content}>
                                            {!isMetamaskDisabled && !isMobile && (
                                                <button
                                                    className={s.board_orangeBtn}
                                                    onClick={() => handleSignUp(Enums.METAMASK)}
                                                >
                                                    <img
                                                        src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large 2.png`}
                                                        alt="connectToContinue"
                                                    />
                                                    <div>
                                                        <span>MetaMask</span>
                                                    </div>
                                                </button>
                                            )}
                                            <button
                                                className={s.board_tealBtn}
                                                onClick={() => handleSignUp(Enums.WALLETCONNECT)}
                                            >
                                                <img
                                                    src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large 3.png`}
                                                    alt="connectToContinue"
                                                />
                                                <div>
                                                    <span>Wallet Connect</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {currentPrompt === SIGNUP_SOCIAL && !web3Error && (
                                    <div className={` ${s.board_signin_wrapper}`}>
                                        <div className={s.board_signin_content}>
                                            <button
                                                className={s.board_orangeBtn}
                                                onClick={() => handleSignUp(Enums.DISCORD_AUTH)}
                                            >
                                                <img
                                                    src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large 2.png`}
                                                    alt="Sign Up With Discord"
                                                />
                                                <div>
                                                    <span>Discord</span>
                                                </div>
                                            </button>
                                            <button
                                                className={s.board_tealBtn}
                                                onClick={() => handleSignUp(Enums.TWITTER_AUTH)}
                                            >
                                                <img
                                                    src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large 3.png`}
                                                    alt="Sign Up With Twitter"
                                                />
                                                <div>
                                                    <span>Twitter</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {currentPrompt === SIGNUP_CAPTCHA && !web3Error && (
                                    <div className={` ${s.board_signin_wrapper}`}>

                                        <div className={s.board_signin_content}>
                                            <div className={s.board_signin_title}>
                                                Prove that you’re a human
                                            </div>
                                            {process.env.NODE_ENV !== 'development' && (
                                                <HCaptcha
                                                    sitekey={process.env.NEXT_PUBLIC_CAPTCHA_KEY}
                                                    onVerify={(token, ekey) => handleVerificationSuccess(token, ekey)}
                                                    ref={captchaRef}

                                                    data-size={`${isMobile ? "compact" : "normal "}`}

                                                />

                                            )}
                                        </div>
                                    </div>
                                )}

                                {currentPrompt === SIGNUP_AWAIT && !web3Error && (
                                    <div className={s.board_loading}>
                                        <div className={s.board_loading_wrapper}>
                                            <img
                                                src={`${Enums.BASEPATH}/img/sharing-ui/Loading_Blob fish.gif`}
                                                alt="Loading data"
                                            />
                                            <div className={s.board_loading_wrapper_text}>
                                                Awaiting sign up
                                                <span
                                                    className={
                                                        s.board_loading_wrapper_text_ellipsis
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentPrompt === SIGNUP_SUCCESS && (
                                    <div className={`${s.board_text}`}>
                                        Sign up successfully. Redirecting to user page...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {currentPrompt !== SIGNUP_AWAIT && currentPrompt !== SIGNUP_SUCCESS && (
                        <button className={s.board_disconnect} onClick={() => GoBack()}>
                            <img
                                src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Disconnect.png`}
                                alt="Back"
                            />
                            <div>
                                <span>Back</span>
                            </div>
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}

export default SignUp;

import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getDiscordAuthLink, getTwitterAuthLink } from "@utils/helpers";
export async function getServerSideProps(context) {
    const session = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
    );

    return {
        props: {
            session,
        },
    }
}
