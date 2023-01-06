import React, { useEffect, useState, useContext } from "react";
import { Web3Context } from "@context/Web3Context";
import s from "/sass/claim/claim.module.css";
import { withUserOwningNftQuestQuery, withUserOwningNftQuestSubmit } from "shared/HOC/quest";
import Enums from "enums";
import { useRouter } from "next/router";
import { BackToMainBoardButton, DisconnectButton } from "../shared";

const CLAIMABLE = 0;
const CLAIMED = 1;
const UNCLAIMABLE = 2;

const ClaimRewardForOwningNFT = ({
    session,
    onSubmit,
    isSubmitting,
    isFetchingUserQuests,
    userQuests,
}) => {
    const [nftQuest, setNftQuest] = useState(null);
    const [error, setError] = useState(null);
    const { SignOut } = useContext(Web3Context);

    const [isValidating, setIsValidating] = useState(false);
    const [currentView, setView] = useState(CLAIMABLE);
    let router = useRouter();

    useEffect(async () => {
        if (userQuests && router) {
            let nft = router.query.nft;

            let currentNftQuest = userQuests.find(
                (q) => q.type.name === Enums.OWNING_NFT_CLAIM && q.extendedQuestData.nft === nft
            );

            if (!currentNftQuest) {
                return setView(UNCLAIMABLE);
            }

            setNftQuest(currentNftQuest);

            if (currentNftQuest.isDone) {
                return setView(CLAIMED);
            }
        }
    }, [userQuests]);

    const onClaim = async () => {
        setIsValidating(true);
        try {
            if (nftQuest.isDone) {
                setIsValidating(false);
                return;
            }

            const { questId, type, quantity, rewardTypeId, extendedQuestData } = nftQuest;
            let submission = {
                questId,
                type,
                rewardTypeId,
                quantity,
                extendedQuestData,
            };
            let res = await onSubmit(submission, userQuests);
            if (res.isError) {
                setError(res.message);
                setView(UNCLAIMABLE);
            } else {
                setView(CLAIMED);
            }
            setIsValidating(false);
        } catch (e) {
            setIsValidating(false);
            console.log(e);
            return;
        }
    };
    return (
        <div className={s.board}>
            <div className={s.board_container}>
                <div className={s.board_dollar}>
                    <div className={s.board_dollar_content}>$$$</div>
                </div>
                <div className={s.board_wrapper}>
                    <div className={s.board_content}>
                        {(isSubmitting || isFetchingUserQuests || isValidating) && (
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
                        {nftQuest && (
                            <>
                                {currentView === CLAIMABLE &&
                                    !isSubmitting &&
                                    !isFetchingUserQuests &&
                                    !isValidating && (
                                        <>
                                            <div className={s.board_title}>
                                                {/* Claim $SHELL for owning {getNFT()} */}
                                                {nftQuest.text}
                                            </div>

                                            <button
                                                className={s.board_pinkBtn}
                                                onClick={onClaim}
                                                disabled={
                                                    nftQuest?.isDone ||
                                                    isSubmitting ||
                                                    isFetchingUserQuests
                                                }
                                            >
                                                <img
                                                    src={
                                                        !nftQuest?.isDone
                                                            ? `${Enums.BASEPATH}/img/sharing-ui/invite/Button_Small.png`
                                                            : `${Enums.BASEPATH}/img/sharing-ui/invite/Button_Small 2.png`
                                                    }
                                                    alt="connectToContinue"
                                                />
                                                <div>
                                                    {/* {!nftQuest?.isDone ? "Claim" : "Claimed"} */}
                                                    <span>{nftQuest.quantity}</span>
                                                    {nftQuest.rewardType.reward.match("hell") && (
                                                        <img
                                                            src={`${Enums.BASEPATH}/img/sharing-ui/invite/shell.png`}
                                                            alt="reward icon"
                                                        />
                                                    )}

                                                    {nftQuest.rewardType.reward.match(
                                                        /bowl|Bowl/
                                                    ) && (
                                                        <img
                                                            src={`${Enums.BASEPATH}/img/sharing-ui/invite/bowl10frames.gif`}
                                                            alt="reward icon"
                                                        />
                                                    )}
                                                </div>
                                            </button>
                                        </>
                                    )}
                                {currentView === CLAIMED && (
                                    <>
                                        <div className={s.board_title}>Claimed successfully</div>
                                        <BackToMainBoardButton />
                                    </>
                                )}
                                {currentView === UNCLAIMABLE && (
                                    <>
                                        <div className={s.board_title}>
                                            Unclaimable. {error || `You don't own this NFT`}
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

const firstHOC = withUserOwningNftQuestSubmit(ClaimRewardForOwningNFT);
export default withUserOwningNftQuestQuery(firstHOC);
