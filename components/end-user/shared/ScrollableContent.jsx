import React, { useEffect, useState, useRef, useCallback } from "react";
import s from "/sass/claim/claim.module.css";
import Enums from "enums";

function ScrollableContent({
    isFetchingUserQuests,
    isSubmitting,
    isFetchingUserRewards,
    currentQuests,
    doQuest,
}) {
    const [scroll, setScroll] = useState({
        canScrollUp: false,
        canScrollDown: true,
    });
    const scrollRef = useRef();

    useEffect(() => {
        if (currentQuests?.length <= 3) {
            setScroll((prevState) => ({
                ...prevState,
                canScrollDown: false,
                canScrollUp: false,
            }));
        } else {
            setScroll((prevState) => ({
                ...prevState,
                canScrollDown: true,
                canScrollUp: false,
            }));
        }
    }, [currentQuests]);
    const onScroll = useCallback((e) => {
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
    });
    const onScrollDown = useCallback(() => {
        let scrollValue = scrollRef.current.scrollTop + scrollRef.current.offsetHeight + 12;
        scrollRef.current.scrollTo({
            top: scrollValue,
            behavior: "smooth",
        });
    });
    const onScrollUp = useCallback(() => {
        let scrollValue = scrollRef.current.scrollTop - scrollRef.current.offsetHeight - 16;
        scrollRef.current.scrollTo({
            top: scrollValue,
            behavior: "smooth",
        });
    });
    const getQuestText = useCallback((text, type, extendedQuestData) => {
        if (type?.name === Enums.FOLLOW_INSTAGRAM) {
            return (
                <span>
                    Follow
                    <span className="text-red-400">{` @${extendedQuestData.followAccount}`} </span>
                    on Instagram
                </span>
            );
        }
        if (
            type?.name === Enums.FOLLOW_TWITTER &&
            !extendedQuestData.followAccount.match(/Whale_Drop/)
        ) {
            return (
                <span>
                    Follow
                    <span className="text-teal-500">{` @${extendedQuestData.followAccount}`} </span>
                    on Twitter
                </span>
            );
        }
        if (
            type?.name === Enums.FOLLOW_TWITTER &&
            extendedQuestData.followAccount.match(/Whale_Drop/)
        ) {
            return (
                <span>
                    Follow our King Crab
                    <span className="text-teal-500">{` @${extendedQuestData.followAccount}`} </span>
                </span>
            );
        }
        if (
            type?.name === Enums.DISCORD_AUTH ||
            type?.name === Enums.TWITTER_AUTH ||
            type?.name === Enums.TWITTER_RETWEET
        ) {
            return <span>{text}</span>;
        }
        return <span>{text}</span>;
    });

    return (
        <>
            <div className={s.boardLarge_scrollableArea} ref={scrollRef} onScroll={onScroll}>
                {/* Is Loading */}
                {(isFetchingUserQuests || isSubmitting || isFetchingUserRewards) && (
                    <div className={s.boardLarge_loading}>
                        <div className={s.boardLarge_loading_wrapper}>
                            <img
                                src={`${Enums.BASEPATH}/img/sharing-ui/Loading_Blob fish.gif`}
                                alt="Loading data"
                            />
                            <div className={s.boardLarge_loading_wrapper_text}>
                                Fetching data
                                <span className={s.boardLarge_loading_wrapper_text_ellipsis} />
                            </div>
                        </div>
                    </div>
                )}

                {/*  Render individual quest board */}
                {!isFetchingUserQuests &&
                    !isSubmitting &&
                    !isFetchingUserRewards &&
                    !currentQuests?.isError &&
                    currentQuests?.length > 0 &&
                    currentQuests?.map((item, index, row) => {
                        const {
                            questId,
                            type,
                            description,
                            text,
                            completedText,
                            isEnabled,
                            isRequired,
                            quantity,
                            rewardTypeId,
                            extendedQuestData,
                            isDone,
                            rewardType,
                        } = item;

                        return (
                            <React.Fragment key={index}>
                                <div className={s.boardLarge_list_container}>
                                    <div className={s.boardLarge_list_text}>
                                        {getQuestText(text, type, extendedQuestData)}
                                    </div>
                                    <div className={s.boardLarge_list_action}>
                                        {isDone && (
                                            <button className={s.boardLarge_list_doneBtn}>
                                                <img
                                                    src={`${Enums.BASEPATH}/img/sharing-ui/invite/Quest_Done Button.png`}
                                                    alt="done"
                                                />
                                                <div>
                                                    <span>Done</span>
                                                </div>
                                            </button>
                                        )}
                                        {!isDone && (
                                            <button
                                                className={s.boardLarge_list_questBtn}
                                                onClick={() => doQuest(item)}
                                            >
                                                <img
                                                    src={`${Enums.BASEPATH}/img/sharing-ui/invite/Quest_Reward Button.png`}
                                                    alt="reward button"
                                                />
                                                <div>
                                                    <span>{quantity}</span>
                                                    {rewardType.reward.match("hell") && (
                                                        <img
                                                            src={`${Enums.BASEPATH}/img/sharing-ui/invite/shell.png`}
                                                            alt="reward icon"
                                                        />
                                                    )}

                                                    {rewardType.reward.match(/bowl|Bowl/) && (
                                                        <img
                                                            src={`${Enums.BASEPATH}/img/sharing-ui/invite/bowl10frames.gif`}
                                                            alt="reward icon"
                                                        />
                                                    )}
                                                </div>
                                            </button>
                                        )}
                                    </div>
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
                                : `${Enums.BASEPATH}/img/sharing-ui/invite/Down_Arrow.png`
                        }
                        alt="scroll down"
                    />
                </button>
            </div>
        </>
    );
}

export default React.memo(ScrollableContent);
