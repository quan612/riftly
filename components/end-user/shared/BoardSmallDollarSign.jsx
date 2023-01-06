import React, { useEffect, useState, useContext } from "react";
import s from "/sass/claim/claim.module.css";
import Enums from "enums";
import { useUserRewardQuery } from "@shared/HOC";
import { Web3Context } from "@context/Web3Context";

function BoardSmallDollarSign() {
    const { session } = useContext(Web3Context);
    const [userRewards, userRewardLoading] = useUserRewardQuery(session);
    const [rewardAmount, setRewardAmount] = useState(null);

    useEffect(async () => {
        if (userRewards && userRewards.length > 0) {
            let shellReward = userRewards.find(
                (r) =>
                    r.rewardType.reward.match("hell") ||
                    r.rewardType.reward.match("$Shell") ||
                    r.rewardType.reward.match("$SHELL")
            );
            setRewardAmount(shellReward.quantity);
        }
    }, [userRewards]);
    return (
        <div className={s.board_dollar}>
            <div className={s.board_dollar_content}>
                {rewardAmount !== null && process.env.NEXT_PUBLIC_CAN_SEE_SHELL === "true" && (
                    <>
                        <img
                            src={`${Enums.BASEPATH}/img/sharing-ui/invite/shell.png`}
                            alt="reward icon"
                        />
                        {rewardAmount}
                    </>
                )}

                {(rewardAmount === null || process.env.NEXT_PUBLIC_CAN_SEE_SHELL === "false") && (
                    <>
                        <img
                            src={`${Enums.BASEPATH}/img/sharing-ui/invite/shell.png`}
                            alt="reward icon"
                        />
                        <img
                            src={`${Enums.BASEPATH}/img/sharing-ui/invite/shell.png`}
                            alt="reward icon"
                        />
                        <img
                            src={`${Enums.BASEPATH}/img/sharing-ui/invite/shell.png`}
                            alt="reward icon"
                        />
                    </>
                )}
            </div>
        </div>
    );
}
export default React.memo(BoardSmallDollarSign);
