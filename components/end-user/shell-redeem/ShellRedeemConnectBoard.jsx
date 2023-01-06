import React, { useEffect, useState, useContext } from "react";
import s from "/sass/claim/claim.module.css";
import { Web3Context } from "@context/Web3Context";
import Enums from "enums";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { BoardSmallDollarSign } from "..";
import { useDeviceDetect } from "lib/hooks";

const util = require("util");

export const WELCOME = 0;
export const CONNECT_OPTIONS = 1;
export const SIGNIN_OPTIONS = 2;
export const WALLET_AUTH = 3;
export const SOCIAL_AUTH = 4;
export const AUTHENTICATING = 5;

export default function ShellRedeemConnectBoard() {
    let router = useRouter();
    const { web3Error, tryConnectAsUser, setWeb3Error } = useContext(Web3Context);
    const [currentPrompt, setPrompt] = useState(WELCOME);

    const [isMetamaskDisabled, setIsMetamaskDisabled] = useState(false);
    const { isMobile } = useDeviceDetect();
    useEffect(() => {
        const ethereum = window.ethereum;
        setIsMetamaskDisabled(!ethereum || !ethereum.on);
    }, []);

    const changeView = async (viewState) => {
        setPrompt(viewState);
    };

    const authenticateUsingWallet = async (walletType) => {
        changeView(AUTHENTICATING);
        tryConnectAsUser(walletType);
    };

    const GoBack = () => {
        if (currentPrompt === SIGNIN_OPTIONS) {
            return changeView(CONNECT_OPTIONS);
        }
        if (currentPrompt === WALLET_AUTH) {
            return changeView(SIGNIN_OPTIONS);
        }
        if (currentPrompt === SOCIAL_AUTH) {
            return changeView(SIGNIN_OPTIONS);
        }
        if (currentPrompt === AUTHENTICATING) {
            setWeb3Error(null);
            return changeView(CONNECT_OPTIONS);
        }
    };

    return (
        <div className={s.board}>
            <div className={s.board_container}>
                <BoardSmallDollarSign />
                <div className={s.board_wrapper}>
                    <div className={s.board_content}>
                        <>
                            {web3Error && (
                                <>
                                    <div className={s.board_text}>{web3Error}</div>
                                </>
                            )}

                            {currentPrompt === WELCOME && !web3Error && (
                                <>
                                    <img
                                        className={s.board_headingIcon}
                                        src={`${Enums.BASEPATH}/img/sharing-ui/invite/starfish.gif`}
                                    />
                                    <div className={s.board_title}>
                                        Welcome to the Cove’s DeepSea Shell Redemption!
                                    </div>
                                    <div className={s.board_text}>Connect to continue</div>
                                    <button
                                        className={s.board_pinkBtn}
                                        onClick={() => changeView(CONNECT_OPTIONS)}
                                    >
                                        <img
                                            src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large.png`}
                                            alt="connectToContinue"
                                        />
                                        <div>
                                            <span>Connect</span>
                                        </div>
                                    </button>
                                </>
                            )}
                            {currentPrompt === CONNECT_OPTIONS && !web3Error && (
                                <div className={` ${s.board_signin_wrapper}`}>
                                    <div className={s.board_signin_content}>
                                        {process.env.NEXT_PUBLIC_ENABLE_CHALLENGER === "true" && (
                                            <button
                                                className={s.board_orangeBtn}
                                                onClick={() => router.push(`/user/signup`)}
                                            >
                                                <img
                                                    src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large 2.png`}
                                                    alt="connectToContinue"
                                                />
                                                <div>
                                                    <span>Sign Up</span>
                                                </div>
                                            </button>
                                        )}
                                        <button
                                            className={s.board_tealBtn}
                                            onClick={() => changeView(SIGNIN_OPTIONS)}
                                        >
                                            <img
                                                src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large 3.png`}
                                                alt="connectToContinue"
                                            />
                                            <div>
                                                <span>Login</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {currentPrompt === SIGNIN_OPTIONS && !web3Error && (
                                <div className={` ${s.board_signin_wrapper}`}>
                                    <div className={s.board_signin_content}>
                                        <button
                                            className={s.board_orangeBtn}
                                            onClick={() => changeView(WALLET_AUTH)}
                                        >
                                            <img
                                                src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large 2.png`}
                                                alt="connectToContinue"
                                            />
                                            <div>
                                                <span>Wallet</span>
                                            </div>
                                        </button>
                                        <button
                                            className={s.board_tealBtn}
                                            onClick={() => changeView(SOCIAL_AUTH)}
                                        >
                                            <img
                                                src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large 3.png`}
                                                alt="connectToContinue"
                                            />
                                            <div>
                                                <span>Social Media</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {currentPrompt === SOCIAL_AUTH && !web3Error && (
                                <div className={` ${s.board_signin_wrapper}`}>
                                    <div className={s.board_signin_content}>
                                        <button
                                            className={s.board_purpleBtn}
                                            onClick={() => {
                                                signIn("discord");
                                            }}
                                        >
                                            <img
                                                src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large 4.png`}
                                                alt="connectToContinue"
                                            />
                                            <div>
                                                <span> Discord</span>
                                            </div>
                                        </button>
                                        <button
                                            className={s.board_tealBtn}
                                            onClick={() => {
                                                signIn("twitter");
                                            }}
                                        >
                                            <img
                                                src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large 3.png`}
                                                alt="connectToContinue"
                                            />
                                            <div>
                                                <span> Twitter</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {currentPrompt === WALLET_AUTH && !web3Error && (
                                <div className={` ${s.board_signin_wrapper}`}>
                                    <div className={s.board_signin_content}>
                                        {!isMetamaskDisabled && !isMobile && (
                                            <button
                                                className={s.board_orangeBtn}
                                                onClick={() =>
                                                    authenticateUsingWallet(Enums.METAMASK)
                                                }
                                            >
                                                <img
                                                    src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large 2.png`}
                                                    alt="connectToContinue"
                                                />
                                                <div>
                                                    <span> MetaMask</span>
                                                </div>
                                            </button>
                                        )}
                                        <button
                                            className={s.board_tealBtn}
                                            onClick={() =>
                                                authenticateUsingWallet(Enums.WALLETCONNECT)
                                            }
                                        >
                                            <img
                                                src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large 3.png`}
                                                alt="connectToContinue"
                                            />
                                            <div>
                                                <span> Wallet Connect</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {currentPrompt === AUTHENTICATING && !web3Error && (
                                <div className={s.board_loading}>
                                    <div className={s.board_loading_wrapper}>
                                        <img
                                            src={`${Enums.BASEPATH}/img/sharing-ui/Loading_Blob fish.gif`}
                                            alt="Loading data"
                                        />
                                        <div className={s.board_loading_wrapper_text}>
                                            Awaiting
                                            <span
                                                className={s.board_loading_wrapper_text_ellipsis}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    </div>
                </div>
            </div>
            {((currentPrompt !== WELCOME &&
                currentPrompt !== CONNECT_OPTIONS &&
                currentPrompt !== AUTHENTICATING) ||
                web3Error) && (
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
    );
}
