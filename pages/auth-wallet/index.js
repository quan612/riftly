import React, { useEffect, useState, useContext, useRef } from "react";
import s from "/sass/claim/claim.module.css";
import { Web3Context } from "@context/Web3Context";
import { useRouter } from "next/router";
import Enums from "enums";
import { BoardSmallDollarSign } from "@components/end-user";
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

function WalletAuth({ session }) {
  const [currentPrompt, setPrompt] = useState(SIGNUP_WALLET);
  const { web3Error, doWalletAuth, setWeb3Error } = useContext(Web3Context);
  const router = useRouter();
  const [isMetamaskDisabled, setIsMetamaskDisabled] = useState(false);
  const { isMobile } = useDeviceDetect();
  let redirectTimeout;


  useEffect(() => {
    if (!session) {
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
    try {
      let signUpResult;
      signUpResult = await doWalletAuth(typeOfSignUp);
      if (signUpResult === true) {
        changeView(SIGNUP_SUCCESS);

        redirectTimeout = setTimeout(() => {
          router.push("/");
        }, 2500);
      } else {
        changeView(SIGNUP_ERROR);
      }
    } catch (error) {

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
                      Link Crypto Wallet to existing Account!
                    </div>

                    <button
                      className={s.board_orangeBtn}
                      onClick={() => {
                        changeView(SIGNUP_CAPTCHA)
                      }}
                    >
                      <img
                        src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large 2.png`}
                        alt="Continue"
                      />
                      <div>
                        <span>Continue</span>
                      </div>
                    </button>
                  </>
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
                {currentPrompt === SIGNUP_AWAIT && !web3Error && (
                  <div className={s.board_loading}>
                    <div className={s.board_loading_wrapper}>
                      <img
                        src={`${Enums.BASEPATH}/img/sharing-ui/Loading_Blob fish.gif`}
                        alt="Loading data"
                      />
                      <div className={s.board_loading_wrapper_text}>
                        Awaiting doing connect wallet quest
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
                    Wallet Authenticate successfully. Redirecting to user page...
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

export default WalletAuth;

import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from 'pages/api/auth/[...nextauth]'
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
