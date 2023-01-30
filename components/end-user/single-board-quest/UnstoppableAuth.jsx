import React, { useEffect, useState, useContext, useCallback } from "react";
import { Web3Context } from "@context/Web3Context";
import s from "/sass/claim/claim.module.css";
import {
    withUserUnstoppableAuthQuestQuery,
    withUserUnstoppableAuthQuestSubmit,
} from "shared/HOC/quest";
import Enums from "enums";
import { useRouter } from "next/router";
import {
    DisconnectButton,
    BackToMainBoardButton,
    BoardSmallDollarSign,
    PinkLargeButton,
} from "../shared";

import UAuth from "@uauth/js";
const { default: Resolution } = require("@unstoppabledomains/resolution");
const resolution = new Resolution();

const uauth = new UAuth({
    clientID: process.env.NEXT_PUBLIC_UNSTOPPABLE_CLIENT_ID,
    redirectUri: process.env.NEXT_PUBLIC_UNSTOPPABLE_REDIRECT_URI,
    scope: "openid wallet",
});

const STEP_1 = 1;
const STEP_2 = 2;
const STEP_3 = 3;
const STEP_4 = 4;
const SUBMITTED = 5;
const OVERDUE = 6;
const ERROR = 7;

const UnstoppableAuth = ({ session, onSubmit, isSubmitting, isFetchingUserQuests, userQuests }) => {
    const [submissionQuest, setSubmissionQuest] = useState(null);
    const [error, setError] = useState(null);
    const [uauthUser, setUauthUser] = useState(null);
    const { SignOut } = useContext(Web3Context);
    const [currentView, setView] = useState(STEP_1);
    const router = useRouter();

    useEffect(async () => {
        if (userQuests) {
            let unstoppableAuthQuest = userQuests.find(
                (q) => q.type.name === Enums.UNSTOPPABLE_AUTH
            );

            if (!unstoppableAuthQuest) {
                return setView(OVERDUE);
            }

            setSubmissionQuest(unstoppableAuthQuest);

            if (unstoppableAuthQuest.hasStarted) {
                return setView(SUBMITTED);
            }
        }
    }, [userQuests]);

    const handleUnstoppableLogin = async () => {
        // let auth = "quan612.crypto";

        try {
            const authorization = await uauth.loginWithPopup();
            // console.log(authorization);
            // let test = await resolution.owner(auth);
            if (authorization) {
                let user = await uauth.user();
                // console.log(user);
                setUauthUser(user.sub);
                setView(STEP_4);
            } else {
                // console.log(authorization);
                setError("something wrong");
                setView(ERROR);
            }
        } catch (error) {
            setError(error.message);
            setView(ERROR);
        }
    };

    async function handleOnSubmit() {
        /** Submit this quest */
        const { questId, type, rewardTypeId, quantity, extendedQuestData } = submissionQuest;
        if (!uauthUser) {
            return;
        }
        let submission = {
            questId,
            type,
            rewardTypeId,
            quantity,
            extendedQuestData,
            uauthUser,
        };
        let res = await onSubmit(submission, userQuests);

        if (res.isError) {
            setError(res.message);
            setView(ERROR);
        } else {
            setSubmissionQuest((prevState) => ({ ...prevState, isDone: true }));
            return setView(SUBMITTED);
        }
    }

    return (
        <div className={s.board}>
            <div className={s.board_container}>
                <BoardSmallDollarSign />
                <div className={s.board_wrapper}>
                    <div className={s.board_content}>
                        {(isSubmitting || isFetchingUserQuests) && <BoardSmallLoadingContainer />}
                        {!isSubmitting && !isFetchingUserQuests && (
                            <>
                                {submissionQuest && currentView === STEP_1 && (
                                    <>
                                        <div className={s.board_title}>Welcome!</div>

                                        <div className={s.board_text}>
                                            Link your Unstoppable Domain
                                        </div>

                                        <PinkLargeButton
                                            text={"Next"}
                                            onClick={() => setView(STEP_2)}
                                        />
                                    </>
                                )}
                                {currentView === STEP_2 && (
                                    <>
                                        <div className={s.board_title}>Buy Your Crypto Domain</div>
                                        <div className={s.board_text}>
                                            Visit unstoppabledomain.com to purchase your domain.
                                        </div>
                                        <PinkLargeButton
                                            text={"Go Next"}
                                            onClick={() => setView(STEP_3)}
                                        />
                                    </>
                                )}
                                {currentView === STEP_3 && (
                                    <>
                                        <div className={s.board_title}>Authenticate the Domain</div>
                                        <div className={s.board_text}>
                                            To authenticate your crypto domain, click the button
                                            below.
                                        </div>
                                        <UnstoppableButton
                                            text={"Authenticate"}
                                            onClick={() => handleUnstoppableLogin()}
                                        />
                                    </>
                                )}
                                {currentView === STEP_4 && (
                                    <>
                                        <div className={s.board_text}>
                                            {uauthUser} has been authenticated
                                        </div>
                                        <ClaimButton
                                            onClick={handleOnSubmit}
                                            isSubmitting={isSubmitting}
                                            isFetchingUserQuests={isFetchingUserQuests}
                                            submissionQuest={submissionQuest}
                                        />
                                    </>
                                )}
                                {currentView === ERROR && (
                                    <>
                                        <div className={s.board_text}>{error}</div>
                                        <PinkLargeButton
                                            text={"Go Back"}
                                            onClick={() => setView(STEP_1)}
                                        />
                                    </>
                                )}

                                {submissionQuest && currentView === SUBMITTED && (
                                    <>
                                        <div className={s.board_title}>
                                            Success! Your Unstoppable Domain has been linked!
                                        </div>
                                        <BackToMainBoardButton />
                                    </>
                                )}
                                {currentView === OVERDUE && (
                                    <>
                                        <div className={s.board_title}>
                                            Sorry, you're too late. All the $SHELL has been found
                                            for this quest.
                                        </div>
                                        <BackToMainBoardButton />
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <DisconnectButton />
        </div>
    );
};

const firstHOC = withUserUnstoppableAuthQuestSubmit(UnstoppableAuth);
export default withUserUnstoppableAuthQuestQuery(firstHOC);

const BoardSmallLoadingContainer = () => {
    return (
        <div className={s.board_loading}>
            <div className={s.board_loading_wrapper}>
                <img
                    src={`${Enums.BASEPATH}/img/sharing-ui/Loading_Blob fish.gif`}
                    alt="Loading data"
                />
                <div className={s.board_loading_wrapper_text}>
                    Loading
                    <span className={s.board_loading_wrapper_text_ellipsis} />
                </div>
            </div>
        </div>
    );
};

const ClaimButton = ({ onClick, isSubmitting, isFetchingUserQuests, submissionQuest }) => {
    return (
        <div className={s.claimBtn}>
            <button
                onClick={onClick}
                disabled={submissionQuest.hasStarted || isSubmitting || isFetchingUserQuests}
            >
                <img
                    src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large.png`}
                    alt="Submit"
                />
                <div>
                    <div>
                        Claim {submissionQuest.quantity}
                        {submissionQuest.rewardType.reward.match("hell") && (
                            <img
                                src={`${Enums.BASEPATH}/img/sharing-ui/invite/shell.png`}
                                alt="reward icon"
                            />
                        )}
                        {submissionQuest.rewardType.reward.match(/bowl|Bowl/) && (
                            <img
                                src={`${Enums.BASEPATH}/img/sharing-ui/invite/bowl10frames.gif`}
                                alt="reward icon"
                            />
                        )}
                    </div>
                </div>
            </button>
        </div>
    );
};

const UnstoppableButton = ({ text = "", onClick }) => {
    return (
        <button className={s.unstoppableBtn} onClick={onClick}>
            <img
                src={`${Enums.BASEPATH}/img/sharing-ui/invite/unstoppable.png`}
                alt="Unstoppable Authenticate"
            />
            <div>
                <svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M23 2.34473V9.93093L1 18.8965L23 2.34473Z"
                        fill="#2FE9FF"
                    />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M18.875 2V15.1034C18.875 18.9123 15.797 22 12 22C8.20304 22 5.125 18.9123 5.125 15.1034V9.58621L9.25 7.31034V15.1034C9.25 16.4365 10.3273 17.5172 11.6562 17.5172C12.9852 17.5172 14.0625 16.4365 14.0625 15.1034V4.65517L18.875 2Z"
                        fill="white"
                    />
                </svg>
                <span>{text}</span>
            </div>
        </button>
    );
};
