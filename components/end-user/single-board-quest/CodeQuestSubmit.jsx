import React, { useEffect, useState, useContext, useCallback } from "react";
import { Web3Context } from "@context/Web3Context";
import s from "/sass/claim/claim.module.css";
import { withUserCodeQuestQuery, withUserCodeQuestSubmit } from "shared/HOC/quest";
import Enums from "enums";
import { useRouter } from "next/router";
import { BoardSmallDollarSign } from "..";
import { BackToMainBoardButton, DisconnectButton } from "../shared";

const SUBMITTABLE = 1;
const SUBMITTED = 2;
const OVERDUE = 3;
const UNCLAIMABLE = 4;

const CodeQuestSubmit = ({ session, onSubmit, isSubmitting, isFetchingUserQuests, userQuests }) => {
    const [submissionQuest, setSubmissionQuest] = useState(null);
    const [inputError, setInputError] = useState(null);
    const [inputCode, setInputCode] = useState(null);
    const { SignOut } = useContext(Web3Context);
    const [currentView, setView] = useState(SUBMITTABLE);
    const router = useRouter();

    useEffect(async () => {
        if (userQuests && router) {
            let event = router.query.event;

            let codeQuestOfThisEvent = userQuests.find(
                (q) => q.type.name === Enums.CODE_QUEST && q.extendedQuestData.codeEvent === event
            );

            if (!codeQuestOfThisEvent) {
                return setView(OVERDUE);
            }

            setSubmissionQuest(codeQuestOfThisEvent);

            if (
                codeQuestOfThisEvent?.extendedQuestData.hasOwnProperty("endDate") &&
                codeQuestOfThisEvent?.extendedQuestData?.endDate !== null &&
                codeQuestOfThisEvent?.extendedQuestData?.endDate.length > 0
            ) {
                let [endDate] = codeQuestOfThisEvent?.extendedQuestData?.endDate.split("T");
                let [today] = new Date().toISOString().split("T");

                if (today > endDate) {
                    return setView(OVERDUE);
                }
            }

            if (codeQuestOfThisEvent.isDone) {
                return setView(SUBMITTED);
            }
        }
    }, [userQuests]);

    const handleOnChange = (e, error) => {
        if (error) {
            setInputError(null);
        }
        let text = e.target.value;
        setInputCode(text);
    };
    const debouncedChangeHandler = useCallback(debounce(handleOnChange, 300), []);

    async function handleOnSubmit() {
        /* compare the code */
        if (!inputCode) {
            return;
        }

        // trying to find other answers as well
        let foundOtherAnswersCorrect = -1;
        if (submissionQuest?.extendedQuestData.hasOwnProperty("otherAnswers")) {
            let { otherAnswers } = submissionQuest?.extendedQuestData;
            let answersArray = otherAnswers.split(",");

            foundOtherAnswersCorrect = answersArray.findIndex((element) => {
                return (
                    element.trimStart().trimEnd().toLowerCase() ===
                    inputCode.trimStart().trimEnd().toLowerCase()
                );
            });
        }

        if (
            inputCode.toLowerCase() ===
                submissionQuest?.extendedQuestData.secretCode.toLowerCase() ||
            foundOtherAnswersCorrect !== -1
        ) {
            /** Submit this quest */
            const { questId, type, rewardTypeId, quantity, extendedQuestData } = submissionQuest;

            let submission = {
                questId,
                type,
                rewardTypeId,
                quantity,
                extendedQuestData,
                inputCode,
            };
            let res = await onSubmit(submission, userQuests);

            if (res.isError) {
                setError(res.message);
                setView(UNCLAIMABLE);
            } else {
                setSubmissionQuest((prevState) => ({ ...prevState, isDone: true }));
                return setView(SUBMITTED);
            }
        }

        setInputError("Incorrect Code");
        return;
    }

    return (
        <div className={s.board}>
            <div className={s.board_container}>
                <BoardSmallDollarSign />
                <div className={s.board_wrapper}>
                    <div className={s.board_content}>
                        {(isSubmitting || isFetchingUserQuests) && (
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
                        )}
                        {!isSubmitting && !isFetchingUserQuests && (
                            <>
                                {submissionQuest && currentView === SUBMITTABLE && (
                                    <>
                                        <div className={s.board_title}>{submissionQuest.text}</div>
                                        <div className={s.board_input_wrapper}>
                                            <input
                                                type="text"
                                                className={s.board_input_custom}
                                                placeholder="ENTER CODE"
                                                onChange={(e) =>
                                                    debouncedChangeHandler(e, inputError)
                                                }
                                                // maxLength={15}
                                            />
                                            <label className={s.board_input_error}>
                                                {inputError}
                                            </label>
                                        </div>
                                        <div className={s.board_buttonContainer}>
                                            <button
                                                className={s.board_singleClaimBtn}
                                                onClick={handleOnSubmit}
                                                disabled={
                                                    submissionQuest?.isDone ||
                                                    isSubmitting ||
                                                    isFetchingUserQuests
                                                }
                                            >
                                                <img
                                                    src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large.png`}
                                                    alt="Submit"
                                                />
                                                <div>
                                                    <div>
                                                        Claim {submissionQuest.quantity}
                                                        {submissionQuest.rewardType.reward.match(
                                                            "hell"
                                                        ) && (
                                                            <img
                                                                src={`${Enums.BASEPATH}/img/sharing-ui/invite/shell.png`}
                                                                alt="reward icon"
                                                            />
                                                        )}
                                                        {submissionQuest.rewardType.reward.match(
                                                            /bowl|Bowl/
                                                        ) && (
                                                            <img
                                                                src={`${Enums.BASEPATH}/img/sharing-ui/invite/bowl10frames.gif`}
                                                                alt="reward icon"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    </>
                                )}
                                {submissionQuest && currentView === SUBMITTED && (
                                    <>
                                        <div className={s.board_title}>
                                            Success! Quest completed.
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
                                {currentView === UNCLAIMABLE && (
                                    <>
                                        <div className={s.board_title}>Error: {error}</div>
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

const firstHOC = withUserCodeQuestSubmit(CodeQuestSubmit);
export default withUserCodeQuestQuery(firstHOC);

function debounce(func, wait) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        const later = function () {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
