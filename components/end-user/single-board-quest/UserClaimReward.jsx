import React, { useEffect, useState, useContext } from "react";
import { Web3Context } from "@context/Web3Context";
import s from "/sass/claim/claim.module.css";
import { withClaimableRewardQuery, withClaimRewardSubmit } from "shared/HOC/reward";
import Enums from "enums";
import { BoardSmallDollarSign } from "..";
import { DisconnectButton } from "../shared";

const UserClaimReward = ({
    session,
    reward,
    onSubmitReward,
    isSubmittingReward,
    isFetchingReward,
}) => {
    const [error, setError] = useState(null);
    const { SignOut } = useContext(Web3Context);

    useEffect(async () => {
        if (session && reward?.isError) {
            setError(reward?.message);
        }
    }, [reward]);

    const onClaim = async () => {
        if (reward?.pendingReward?.isClaimed) {
            return;
        }
        await onSubmitReward(reward.pendingReward);
    };

    return (
        <div className={s.board}>
            <div className={s.board_container}>
                <BoardSmallDollarSign />
                <div className={s.board_wrapper}>
                    <div className={s.board_content}>
                        {error && (
                            <>
                                <div className={`${s.board_title} `}>Something is not right...</div>
                                <div className={`${s.board_text} `}>{error}</div>
                            </>
                        )}
                        {reward?.pendingReward && !error && (
                            <>
                                {(isSubmittingReward || isFetchingReward) && (
                                    <div className={s.board_loading}>
                                        <div className={s.board_loading_wrapper}>
                                            <img
                                                src={`${Enums.BASEPATH}/img/sharing-ui/Loading_Blob fish.gif`}
                                                alt="Loading data"
                                            />
                                            <div className={s.board_loading_wrapper_text}>
                                                Loading
                                                <span
                                                    className={
                                                        s.board_loading_wrapper_text_ellipsis
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {!isSubmittingReward && !isFetchingReward && (
                                    <>
                                        <div className={s.board_title}>
                                            You won {reward?.pendingReward.quantity}{" "}
                                            {reward?.pendingReward.rewardType.reward}
                                        </div>

                                        <button
                                            className={s.board_pinkBtn}
                                            onClick={onClaim}
                                            disabled={
                                                reward?.pendingReward?.isClaimed ||
                                                isSubmittingReward ||
                                                isFetchingReward
                                            }
                                        >
                                            <img
                                                src={
                                                    !reward?.pendingReward?.isClaimed
                                                        ? `${Enums.BASEPATH}/img/sharing-ui/invite/Button_Small.png`
                                                        : `${Enums.BASEPATH}/img/sharing-ui/invite/Button_Small 2.png`
                                                }
                                                alt="connectToContinue"
                                            />
                                            <div>
                                                <span>
                                                    {!reward?.pendingReward?.isClaimed
                                                        ? "Claim"
                                                        : "Claimed"}
                                                </span>
                                            </div>
                                        </button>
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
const SubmitReward = withClaimRewardSubmit(UserClaimReward);
export default withClaimableRewardQuery(SubmitReward);
