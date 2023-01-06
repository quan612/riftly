import React, { useEffect, useState, useCallback } from "react";
import s from "/sass/claim/claim.module.css";
import Enums from "enums";
import { withUserQuestQuery, withUserQuestSubmit } from "shared/HOC/quest";
import { useRouter } from "next/router";
import { BoardLargeDollarSign } from "..";

import { useToast } from "@chakra-ui/react";
import { BoardTitle, DisconnectButton, ScrollableContent } from "../shared";
import { doQuestUtility } from "../shared/doQuestUtility";

import { isAlphabeticallly, isNotDoneFirst } from "@utils/sort";
import RenderBoardImage from "../shared/BoardImage";

const IndividualQuestBoard = ({
    session,
    isFetchingUserQuests,
    isFetchingUserRewards,
    userQuests,
    queryError,
    onSubmit,
    isSubmitting,
    submittedQuest,
}) => {
    const [currentQuests, setCurrentQuests] = useState([]);
    let router = useRouter();
    const toast = useToast();

    useEffect(() => {
        if (submittedQuest?.isError) {
            toast({
                title: "Exception",
                description: `Catch error at questId: ${submittedQuest.questId}. Please contact admin.`,
                position: "top-right",
                status: "error",
                duration: 10000,
                isClosable: true,
            });
        }
    }, [submittedQuest]);

    useEffect(async () => {
        handleRenderUserQuest();
    }, [userQuests]);

    /* @dev exclude Code Quest, Image Upload, Collaboration Quest, Some other quests related to Twitter
     */
    const handleRenderUserQuest = useCallback(async () => {
        if (userQuests && userQuests.length > 0) {
            let twitterAuthQuest = userQuests.find((q) => q.type.name === Enums.TWITTER_AUTH);
            // check if user has authenticated twitter, to show twitter related quests
            userQuests = userQuests.filter((q) => {
                if (
                    !twitterAuthQuest.isDone &&
                    (q.type.name === Enums.TWITTER_RETWEET || q.type.name === Enums.FOLLOW_TWITTER)
                ) {
                    return false;
                }

                return true;
            });

            userQuests.sort(isAlphabeticallly);
            userQuests.sort(isNotDoneFirst);
            setCurrentQuests(userQuests);
        }
    }, [userQuests]);

    const doQuest = useCallback(
        async (quest) => {
            try {
                await doQuestUtility(router, quest, currentQuests, onSubmit);
            } catch (error) {
                console.log(error);
                toast({
                    title: "Exception",
                    description: `Catch error at quest: ${quest.text}. Please contact admin.`,
                    position: "top-right",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        },
        [currentQuests]
    );

    return (
        <div className={s.boardLarge}>
            <div className={s.boardLarge_layout}>
                <div className={s.boardLarge_wrapper}>
                    <RenderBoardImage />
                    <BoardLargeDollarSign session={session} />
                    <div className={s.boardLarge_container}>
                        <div className={s.boardLarge_content}>
                            <BoardTitle session={session} />
                            {currentQuests?.isError && <div>{currentQuests?.message}</div>}
                            <ScrollableContent
                                isFetchingUserQuests={isFetchingUserQuests}
                                isSubmitting={isSubmitting}
                                isFetchingUserRewards={isFetchingUserRewards}
                                currentQuests={currentQuests}
                                doQuest={(item) => doQuest(item)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {!isFetchingUserQuests && <DisconnectButton />}
        </div>
    );
};

const firstHOC = withUserQuestSubmit(IndividualQuestBoard);
export default withUserQuestQuery(firstHOC);
