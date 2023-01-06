import React, { useEffect, useState, useRef } from "react";
import Enums from "enums";
import s from "/sass/claim/claim.module.css";
import { BoardLargeDollarSign } from "..";
import RenderBoardImage from "../shared/BoardImage";

const ANOMURA_DISCORD_SERVER = "851558628032905286";

/* This Component is rarely used, hard to customize for reusable, has same layout as Individual Quest Board, but the info is different*/
export default function Leaderboard({ questData, isLoading }) {
    const [questsRanking, setQuestRanking] = useState([]);
    const [scroll, setScroll] = useState({
        canScrollUp: false,
        canScrollDown: true,
    });

    useEffect(async () => {
        if (questData?.userQuests?.length > 0) {
            let questsNotRanked = [...questData.userQuests];
            let questFilter = questsNotRanked.filter((q) => q.extendedUserQuestData.reaction !== 0);

            questFilter.sort(sortOnReactionCountAndCreateDateFirst);

            setQuestRanking(questFilter);
        }
    }, [questData]);

    const scrollRef = useRef();

    const onScroll = (e) => {
        if (
            e.target.scrollTop >=
            scrollRef.current.scrollHeight - scrollRef.current.offsetHeight - 16
        ) {
            setScroll((prevState) => ({ ...prevState, canScrollDown: false, canScrollUp: true }));
            return;
        }
        if (
            e.target.scrollTop <
                scrollRef.current.scrollHeight - scrollRef.current.offsetHeight - 16 &&
            e.target.scrollTop > 0
        ) {
            setScroll((prevState) => ({ ...prevState, canScrollDown: true, canScrollUp: true }));
            return;
        }

        if (e.target.scrollTop === 0) {
            setScroll((prevState) => ({ ...prevState, canScrollDown: true, canScrollUp: false }));
            return;
        }
    };
    const onScrollDown = () => {
        let scrollValue = scrollRef.current.scrollTop + scrollRef.current.offsetHeight + 12;
        scrollRef.current.scrollTo({
            top: scrollValue,
            behavior: "smooth",
        });
    };
    const onScrollUp = () => {
        let scrollValue = scrollRef.current.scrollTop - scrollRef.current.offsetHeight - 16;
        scrollRef.current.scrollTo({
            top: scrollValue,
            behavior: "smooth",
        });
    };

    return (
        <div className={s.boardLarge}>
            <div className={s.boardLarge_layout}>
                <div className={s.boardLarge_wrapper}>
                    <RenderBoardImage />
                    <BoardLargeDollarSign />
                    <div className={s.boardLarge_container}>
                        <div className={s.boardLarge_content}>
                            <div className={s.boardLarge_title}>Submission Quest Ranking</div>

                            {!isLoading &&
                                questData &&
                                !questData.isError &&
                                questData?.type.name == Enums.IMAGE_UPLOAD_QUEST && (
                                    <div className={s.boardLarge_rankingCol}>
                                        <div>User</div>
                                        <div>Reactions</div>
                                    </div>
                                )}

                            <div
                                ref={scrollRef}
                                onScroll={onScroll}
                                className={s.boardLarge_scrollableArea}
                            >
                                {!questData ||
                                    (!questData?.userQuests && (
                                        <div className="text-center">Not a valid quest page.</div>
                                    ))}
                                {/* Is Loading */}
                                {isLoading && (
                                    <div className={s.boardLarge_loading}>
                                        <div className={s.boardLarge_loading_wrapper}>
                                            <img
                                                src={`${Enums.BASEPATH}/img/sharing-ui/Loading_Blob fish.gif`}
                                                alt="Loading data"
                                            />
                                            <div className={s.boardLarge_loading_wrapper_text}>
                                                Fetching data
                                                <span
                                                    className={
                                                        s.boardLarge_loading_wrapper_text_ellipsis
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {questsRanking &&
                                    questsRanking.map((item, index, row) => {
                                        const {
                                            wallet,
                                            questId,
                                            user,
                                            extendedUserQuestData: {
                                                reaction,
                                                discordServer,
                                                discordChannel,
                                                messageId,
                                            },
                                        } = item;

                                        return (
                                            <React.Fragment key={index}>
                                                <div
                                                    className={s.boardLarge_list_ranking_container}
                                                >
                                                    <span
                                                        className={`${s.boardLarge_list_ranking_digit}`}
                                                    >
                                                        {index + 1}
                                                    </span>
                                                    <div
                                                        className={`${s.boardLarge_list_ranking_numberContainer}`}
                                                    >
                                                        {/* ranking 1 */}
                                                        {index === 0 && (
                                                            <img
                                                                className={`${s.boardLarge_list_ranking_numberContainer_img}`}
                                                                src={`${Enums.BASEPATH}/img/sharing-ui/invite/Ranking_Number 1.png`}
                                                            />
                                                        )}
                                                        {/* ranking 2 */}
                                                        {index === 1 && (
                                                            <img
                                                                className={`${s.boardLarge_list_ranking_numberContainer_img}`}
                                                                src={`${Enums.BASEPATH}/img/sharing-ui/invite/Ranking_Number 2.png`}
                                                            />
                                                        )}
                                                        {/* ranking 3 */}
                                                        {index === 2 && (
                                                            <img
                                                                className={`${s.boardLarge_list_ranking_numberContainer_img}`}
                                                                src={`${Enums.BASEPATH}/img/sharing-ui/invite/Ranking_Number 3.png`}
                                                            />
                                                        )}
                                                        {/* rest */}
                                                        {index !== 0 &&
                                                            index !== 1 &&
                                                            index !== 2 && (
                                                                <img
                                                                    className={`${s.boardLarge_list_ranking_numberContainer_img}`}
                                                                    src={`${Enums.BASEPATH}/img/sharing-ui/invite/Ranking_Number 4.png`}
                                                                />
                                                            )}
                                                    </div>
                                                    <a
                                                        className={s.boardLarge_list_ranking_text}
                                                        href={`https://discord.com/channels/${ANOMURA_DISCORD_SERVER}/${discordChannel}/${messageId}`}
                                                        target="_blank"
                                                    >
                                                        <div>
                                                            {user.discordUserDiscriminator !=
                                                                null &&
                                                            user.discordUserDiscriminator.trim()
                                                                .length > 0
                                                                ? user.discordUserDiscriminator
                                                                : shortenAddress(user.wallet)}
                                                        </div>
                                                        <div>{reaction || 0}</div>
                                                    </a>
                                                </div>
                                            </React.Fragment>
                                        );
                                    })}
                            </div>
                            {/*  Render board footer arrows */}
                            <div className={s.boardLarge_footer}>
                                <button className={s.boardLarge_arrow} onClick={onScrollUp}>
                                    <img
                                        src={
                                            scroll.canScrollUp
                                                ? `${Enums.BASEPATH}/img/sharing-ui/invite/Arrow_Up_Blue.png`
                                                : `${Enums.BASEPATH}/img/sharing-ui/invite/arrow_up.png`
                                        }
                                        alt="scroll up"
                                    />
                                </button>
                                <button className={s.boardLarge_arrow} onClick={onScrollDown}>
                                    <img
                                        src={
                                            scroll.canScrollDown
                                                ? `${Enums.BASEPATH}/img/sharing-ui/invite/Arrow_Down_Blue.png`
                                                : `${Enums.BASEPATH}/img/sharing-ui/invite/arrow_down.png`
                                        }
                                        alt="scroll down"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DisconnectButton />
        </div>
    );
}

const sortOnReactionCountAndCreateDateFirst = (a, b) => {
    if (a.extendedUserQuestData.reaction === b.extendedUserQuestData.reaction) {
        return new Date(a.createdAt) - new Date(b.createdAt);
    } else {
        return b.extendedUserQuestData.reaction - a.extendedUserQuestData.reaction;
    }
};

const shortenAddress = (address) =>
    `${address.slice(0, 5)}...${address.slice(address.length - 10)}`;
