import React, { useEffect, useState, useCallback } from "react";
import s from "/sass/claim/claim.module.css";
import Enums from "enums";
import { withUserCollaborationQuestQuery, withUserQuestSubmit } from "shared/HOC/quest";
import { useRouter } from "next/router";
import { BoardLargeDollarSign } from "..";

import { useToast } from "@chakra-ui/react";
import { BoardTitle, DisconnectButton, ScrollableContent } from "../shared";
import { doQuestUtility } from "../shared/doQuestUtility";
import { isAlphabeticallly, isNotDoneFirst } from "@utils/sort";
import RenderBoardImage from "../shared/BoardImage";

const CollaborationQuestBoard = ({
    session,
    isFetchingUserQuests,
    isFetchingUserRewards,
    userQuests,
    onSubmit,
    isSubmitting,
    submittedQuest,
    collaboration,
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
        handleRenderCollaborationQuest();
    }, [userQuests]);

    const handleRenderCollaborationQuest = async () => {
        if (userQuests && userQuests.length > 0) {
            userQuests.sort(isAlphabeticallly);
            userQuests.sort(isNotDoneFirst);
            setCurrentQuests(userQuests);
        }
    };
    const doQuest = useCallback(
        async (quest) => {
            let updatedQuestArr = await doQuestUtility(router, quest, currentQuests, onSubmit);
            setCurrentQuests(updatedQuestArr);
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

const firstHOC = withUserQuestSubmit(CollaborationQuestBoard);
export default withUserCollaborationQuestQuery(firstHOC);
