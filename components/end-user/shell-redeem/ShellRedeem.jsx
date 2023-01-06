import React, { useEffect, useState, useContext, useRef } from "react";
import s from "/sass/redemption/index.module.css";
import Enums from "enums";
import { useDeviceDetect } from "lib/hooks";
import "/node_modules/nes.css/css/nes.css";
import { useUserRewardQuery, useShellRedeemQuery, withShellRedeemRollAll } from "@shared/HOC";
import useShellRedeemSound from "lib/hooks/useShellRedeemSound";
import Typed from "typed.js";

const INITIAL_0 = 0;
const INITIAL_1 = 1;
const INITIAL_2 = 2;
const IDLE = 3;
const STUCK = 4;
const PUNCH = 5;
const SHOW_REMAINING = 6;
const SHOW_REWARD = 7;
const NOT_ENOUGH_SHELL = 10;
const MACHINE_ERROR = 10;

const ShellRedeem = ({ session, isRolling, rolledData, rollError, onRollSubmit }) => {
    const [machineState, setMachineState] = useState(INITIAL_0);
    const [showFooter, setShowFooter] = useState(false);
    const [footerMessage, setFooterMessage] = useState("");
    const [boxMessage, setBoxMessage] = useState("");

    const { isMobile } = useDeviceDetect();
    const [userRewards, userRewardLoading] = useUserRewardQuery(session);
    const [rewardAmount, setRewardAmount] = useState(null);
    const [shellRedeemed, shellRedeemedLoading] = useShellRedeemQuery();
    const [currentViewReward, setCurrentViewReward] = useState(-1);
    const [rewardRedeemed, setRewardRedeemed] = useState(null);
    const [audioControl] = useShellRedeemSound();

    // Create reference to store the DOM element containing the animation
    // const el = React.useRef(null);
    // Create reference to store the Typed instance itself
    // const typed = React.useRef(null);
    // let options = {
    //     typeSpeed: 3,
    //     showCursor: false,
    // };

    const [showButtonFooter, setShowButtonFooter] = useState(false);

    const handlePlayAudio = () => {
        if (
            (machineState === INITIAL_0 || machineState === INITIAL_1) &&
            process.env.NEXT_PUBLIC_CAN_REDEEM_SHELL === "true" &&
            machineState !== SHOW_REWARD &&
            audioControl
        ) {
            audioControl.idle.playRepeat(0.45);
            audioControl.underwater.playRepeat(0.45);
            window.removeEventListener("click", handlePlayAudio);
        }
        if (machineState === SHOW_REWARD && audioControl) {
            audioControl.underwater.playRepeat(0.45);
            window.removeEventListener("click", handlePlayAudio);
        }
    };

    useEffect(async () => {}, [isMobile]);
    useEffect(async () => {
        // if redeemed is true

        if (shellRedeemed && shellRedeemed.isRedeemed) {
            setShowFooter(false);
            setRewardRedeemed([...shellRedeemed.rewards]);
            setMachineState(SHOW_REWARD);
            setCurrentViewReward(0);
        } else {
            if (!shellRedeemedLoading && !userRewardLoading) {
                setMachineState(INITIAL_1);
                let timeout = setTimeout(() => {
                    setShowFooter(true);
                    setBoxMessage(
                        `Look at this! It looks old and broken, but it still works…sort of. You can’t choose which treasure you’ll get, so it’s a surprise!`
                    );
                    clearTimeout(timeout);
                }, 500);
            }
        }
    }, [shellRedeemed]);

    useEffect(async () => {
        if (
            (machineState === INITIAL_0 ||
                machineState === INITIAL_1 ||
                machineState === SHOW_REWARD) &&
            audioControl &&
            audioControl.idle
        ) {
            window.addEventListener("click", handlePlayAudio);
        }
    }, [audioControl]);

    // useEffect(async () => {

    // }, []);

    // useEffect(async () => {
    //     options.strings = [boxMessage];
    //     typed.current?.destroy();
    //     if (el && el.current) {
    //         typed.current = new Typed(el.current, options);
    //     }
    //     typed.current?.start();
    // }, [boxMessage, showFooter]);

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

    const getRewardText = () => {
        switch (rewardRedeemed[currentViewReward]) {
            case Enums.MINT_LIST_SPOT:
            case Enums.FREE_MINT:
                return (
                    <div className={`${s.redemption_reward_text} ${s.redemption_reward_pinkText}`}>
                        {rewardRedeemed &&
                            rewardRedeemed.length > 0 &&
                            rewardRedeemed[currentViewReward].toString().toUpperCase()}
                    </div>
                );
            case Enums.BOOTS:
                return (
                    <>
                        <div className={`${s.redemption_reward_text}`}>
                            {rewardRedeemed &&
                                rewardRedeemed.length > 0 &&
                                rewardRedeemed[currentViewReward].toString().toUpperCase()}
                            <span>This boot is legendary because of how useless it is</span>
                        </div>
                    </>
                );
            case Enums.ADOPT_ANIMAL:
                return (
                    <>
                        <div className={`${s.redemption_reward_text}`}>
                            {rewardRedeemed &&
                                rewardRedeemed.length > 0 &&
                                rewardRedeemed[currentViewReward].toString().toUpperCase()}
                            <span>In partnership with Zeneca</span>
                        </div>
                    </>
                );
            case Enums.OCTOHEDZ_RELOADED:
                return (
                    <div className={s.redemption_reward_text}>
                        {rewardRedeemed && rewardRedeemed.length > 0 && "OctoHedz Reloaded NFT"}
                    </div>
                );
            case Enums.OCTOHEDZ_VX_NFT:
                return (
                    <div className={s.redemption_reward_text}>
                        {rewardRedeemed && rewardRedeemed.length > 0 && "OctoHedz VX NFT"}
                    </div>
                );
            default:
                return (
                    <div className={s.redemption_reward_text}>
                        {rewardRedeemed &&
                            rewardRedeemed.length > 0 &&
                            rewardRedeemed[currentViewReward]}
                    </div>
                );
        }
    };
    const viewNextReward = () => {
        if (currentViewReward === rewardRedeemed?.length - 1) {
            return;
        }
        setShowButtonFooter(false);
        setCurrentViewReward((prev) => prev + 1);
    };
    const viewPreviousReward = () => {
        if (currentViewReward === 0) {
            return;
        }
        setShowButtonFooter(false);
        setCurrentViewReward((prev) => prev - 1);
    };
    const handleOnInteraction = () => {
        if (machineState === INITIAL_1) {
            setBoxMessage(
                `I got a bunch’a loot…but I had to use all of my $SHELL at once - that’s the only way it worked for me.`
            );
            setMachineState(INITIAL_2);
        }
        if (machineState === INITIAL_2) {
            setShowFooter(false);
            setMachineState(IDLE);
        }
        if (machineState === MACHINE_ERROR) {
            setShowFooter(false);
            setMachineState(IDLE);
        }
        if (machineState === NOT_ENOUGH_SHELL) {
            setShowFooter(false);
            setMachineState(IDLE);
        }
        if (machineState === STUCK) {
            handleStuckToPunch();
        }
    };
    const handleStuckToPunch = () => {
        if (machineState !== STUCK || !showFooter) {
            return;
        }
        setShowFooter(false);

        let punchTimeout = setTimeout(async () => {
            setMachineState(PUNCH);
            audioControl.punch.play(0.15);
            clearTimeout(punchTimeout);

            // submit roll here
            let submitRoll = await onRollSubmit();

            if (submitRoll?.data.rewards) {
                setRewardRedeemed([...submitRoll.data.rewards]);

                let showRemainingTimeOut = setTimeout(() => {
                    setMachineState(SHOW_REMAINING);
                    audioControl.reward.play(0.25);
                    clearTimeout(showRemainingTimeOut);

                    let rewardTimeout = setTimeout(() => {
                        setCurrentViewReward(0);
                        setMachineState(SHOW_REWARD);
                        audioControl.idle.stop();
                        clearTimeout(rewardTimeout);
                    }, 2200);
                }, 1000);
            }
        }, 100);
    };
    const handleRollAll = () => {
        // if (rewardAmount < Enums.SHELL_PRICE) {
        //     setMachineState(NOT_ENOUGH_SHELL);
        //     setShowFooter(true);
        //     setBoxMessage("Uhhh .... Oh.... You need more shell to feed meeeeeeeeeeeee!!!!!");
        //     return;
        // }
        // pop up confirm here

        // get machine to stuck
        audioControl.stuck.play(0.25);
        setMachineState(STUCK);

        let footerTimeout = setTimeout(() => {
            setBoxMessage(
                `Oh man! It still gets jammed now and again - Try hitting it a couple of times to see if that works!
              `
            );
            setShowFooter(true);
            clearTimeout(footerTimeout);
        }, 2500);
    };

    if (process.env.NEXT_PUBLIC_CAN_REDEEM_SHELL === "false") {
        return (
            <>
                {(machineState === INITIAL_0 || shellRedeemedLoading || userRewardLoading) && (
                    <div className={s.redemption_loading}>Loading</div>
                )}

                {machineState !== INITIAL_0 &&
                    machineState === SHOW_REWARD &&
                    !shellRedeemedLoading &&
                    !userRewardLoading && (
                        <div className={s.redemption_reward}>
                            <div className={s.redemption_reward_container}>
                                <div className={s.redemption_reward_wrapper}>
                                    <div className={s.redemption_reward_content}>
                                        <div className={s.redemption_reward_description}>
                                            Your hard work has paid off, noble Anomura. Now go
                                            forth! Claim your treasures, spread the word, and return
                                            when you’ve acquired more $SHELL.
                                        </div>
                                        <div className={s.redemption_reward_scroll}>
                                            <div className={s.redemption_reward_scroll_left}>
                                                <div
                                                    className={
                                                        s.redemption_reward_scroll_left_wrapper
                                                    }
                                                >
                                                    {rewardRedeemed?.length > 1 && (
                                                        <img
                                                            src={
                                                                currentViewReward === 0
                                                                    ? `${Enums.BASEPATH}/img/redemption/Arrow Left_Gray.png`
                                                                    : `${Enums.BASEPATH}/img/redemption/Arrow Left_Blue.png`
                                                            }
                                                            alt="left arrow"
                                                            onClick={() => viewPreviousReward()}
                                                            className={
                                                                currentViewReward === 0
                                                                    ? s.redemption_reward_scroll_left_disable
                                                                    : s.redemption_reward_scroll_left_enable
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </div>

                                            <div className={s.redemption_reward_scroll_img}>
                                                <div
                                                    className={
                                                        s.redemption_reward_scroll_img_wrapper
                                                    }
                                                >
                                                    <img
                                                        className={
                                                            s.redemption_reward_scroll_img_star
                                                        }
                                                        src={`${Enums.BASEPATH}/img/redemption/Star Background_3x.gif`}
                                                    />
                                                    <div
                                                        className={
                                                            s.redemption_reward_scroll_img_asset
                                                        }
                                                    >
                                                        <img
                                                            src={`${getRewardPicture(
                                                                rewardRedeemed[currentViewReward]
                                                            )} `}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={s.redemption_reward_scroll_right}>
                                                <div
                                                    className={
                                                        s.redemption_reward_scroll_right_wrapper
                                                    }
                                                >
                                                    {rewardRedeemed?.length > 1 && (
                                                        <img
                                                            src={
                                                                currentViewReward ===
                                                                rewardRedeemed?.length - 1
                                                                    ? `${Enums.BASEPATH}/img/redemption/Arrow Right_Gray.png`
                                                                    : `${Enums.BASEPATH}/img/redemption/Arrow Right_Blue.png`
                                                            }
                                                            onClick={() => viewNextReward()}
                                                            alt="right arrow"
                                                            className={
                                                                currentViewReward ===
                                                                rewardRedeemed?.length - 1
                                                                    ? s.redemption_reward_scroll_right_disable
                                                                    : s.redemption_reward_scroll_right_enable
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {getRewardText()}
                                        <div className={s.redemption_reward_buttons}>
                                            <div className={s.redemption_reward_buttons_wrapper}>
                                                {getClaimButton(
                                                    rewardRedeemed[currentViewReward],
                                                    setShowButtonFooter,
                                                    setFooterMessage
                                                )}
                                                {getShareButton(rewardRedeemed[currentViewReward])}
                                            </div>
                                            {showButtonFooter && (
                                                <span
                                                    className={s.redemption_reward_buttons_footer}
                                                >
                                                    {footerMessage}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                {machineState !== INITIAL_0 &&
                    machineState !== SHOW_REWARD &&
                    !shellRedeemedLoading &&
                    !userRewardLoading && (
                        <div className={s.redemption_reward}>
                            <div className={s.redemption_reward_container}>
                                <div className={s.redemption_reward_wrapper}>
                                    <div className={s.redemption_reward_content}>
                                        <div className={s.redemption_reward_description}>
                                            Shell Redemption Is Not Live. Please go back to
                                            challenger board.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
            </>
        );
    } else {
        return (
            <>
                {(machineState === INITIAL_0 || shellRedeemedLoading || userRewardLoading) && (
                    <div className={s.redemption_loading}>Loading</div>
                )}
                {machineState !== INITIAL_0 &&
                    machineState !== SHOW_REWARD &&
                    !shellRedeemedLoading &&
                    !userRewardLoading && (
                        <div className={s.redemption_machine}>
                            <div
                                className={`${getMachineBackground(machineState)} ${
                                    s.redemption_machine_container
                                }  `}
                            >
                                <div className={s.redemption_machine_wrapper}>
                                    <div
                                        className={s.redemption_machine_content}
                                        onClick={() => {
                                            handleOnInteraction();
                                        }}
                                    >
                                        {machineState !== PUNCH &&
                                            machineState !== SHOW_REMAINING && (
                                                <div className={s.redemption_machine_shell}>
                                                    $SHELL {rewardAmount}
                                                </div>
                                            )}
                                        {machineState === SHOW_REMAINING && (
                                            <div className={s.redemption_machine_shell}>
                                                $SHELL 0
                                            </div>
                                        )}
                                        <button
                                            disabled={machineState !== IDLE}
                                            className={s.redemption_machine_roll}
                                            onClick={() => handleRollAll()}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                {machineState !== INITIAL_0 &&
                    machineState === SHOW_REWARD &&
                    !shellRedeemedLoading &&
                    !userRewardLoading && (
                        <div className={s.redemption_reward}>
                            <div className={s.redemption_reward_container}>
                                <div className={s.redemption_reward_wrapper}>
                                    <div className={s.redemption_reward_content}>
                                        <div className={s.redemption_reward_description}>
                                            Your hard work has paid off, noble Anomura. Now go
                                            forth! Claim your treasures, spread the word, and return
                                            when you’ve acquired more $SHELL.
                                        </div>
                                        <div className={s.redemption_reward_scroll}>
                                            <div className={s.redemption_reward_scroll_left}>
                                                <div
                                                    className={
                                                        s.redemption_reward_scroll_left_wrapper
                                                    }
                                                >
                                                    {rewardRedeemed?.length > 1 && (
                                                        <img
                                                            src={
                                                                currentViewReward === 0
                                                                    ? `${Enums.BASEPATH}/img/redemption/Arrow Left_Gray.png`
                                                                    : `${Enums.BASEPATH}/img/redemption/Arrow Left_Blue.png`
                                                            }
                                                            alt="left arrow"
                                                            onClick={() => viewPreviousReward()}
                                                            className={
                                                                currentViewReward === 0
                                                                    ? s.redemption_reward_scroll_left_disable
                                                                    : s.redemption_reward_scroll_left_enable
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </div>

                                            <div className={s.redemption_reward_scroll_img}>
                                                <div
                                                    className={
                                                        s.redemption_reward_scroll_img_wrapper
                                                    }
                                                >
                                                    <img
                                                        className={
                                                            s.redemption_reward_scroll_img_star
                                                        }
                                                        src={`${Enums.BASEPATH}/img/redemption/Star Background_3x.gif`}
                                                    />
                                                    <div
                                                        className={
                                                            s.redemption_reward_scroll_img_asset
                                                        }
                                                    >
                                                        <img
                                                            src={`${getRewardPicture(
                                                                rewardRedeemed[currentViewReward]
                                                            )} `}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={s.redemption_reward_scroll_right}>
                                                <div
                                                    className={
                                                        s.redemption_reward_scroll_right_wrapper
                                                    }
                                                >
                                                    {rewardRedeemed?.length > 1 && (
                                                        <img
                                                            src={
                                                                currentViewReward ===
                                                                rewardRedeemed?.length - 1
                                                                    ? `${Enums.BASEPATH}/img/redemption/Arrow Right_Gray.png`
                                                                    : `${Enums.BASEPATH}/img/redemption/Arrow Right_Blue.png`
                                                            }
                                                            onClick={() => viewNextReward()}
                                                            alt="right arrow"
                                                            className={
                                                                currentViewReward ===
                                                                rewardRedeemed?.length - 1
                                                                    ? s.redemption_reward_scroll_right_disable
                                                                    : s.redemption_reward_scroll_right_enable
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {getRewardText()}
                                        <div className={s.redemption_reward_buttons}>
                                            <div className={s.redemption_reward_buttons_wrapper}>
                                                {getClaimButton(
                                                    rewardRedeemed[currentViewReward],
                                                    setShowButtonFooter,
                                                    setFooterMessage
                                                )}
                                                {getShareButton(rewardRedeemed[currentViewReward])}
                                            </div>
                                            {showButtonFooter && (
                                                <span
                                                    className={s.redemption_reward_buttons_footer}
                                                >
                                                    {footerMessage}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                <div className={s.redemption_bubble}>
                    <div className={s.redemption_bubble_wrapper}>
                        <img src="/challenger/img/redemption/machine_bubbles_x4.gif" />
                    </div>
                </div>
                {showFooter && (
                    <div className={s.redemption_footer}>
                        <div className={s.redemption_footer_wrapper}>
                            <div
                                className={s.redemption_footer_boxes}
                                onClick={() => {
                                    handleOnInteraction();
                                }}
                            >
                                {isMobile ? (
                                    <img
                                        src={`${Enums.BASEPATH}/img/redemption/dialogue_box_center_x4.png`}
                                        alt="box"
                                    />
                                ) : (
                                    <img
                                        src={`${Enums.BASEPATH}/img/redemption/teal_box.png`}
                                        alt="box"
                                    />
                                )}
                                {/* <img
                                    src={`${Enums.BASEPATH}/img/redemption/teal_box.png`}
                                    alt="box"
                                /> */}
                                {/* <div>{boxMessage && <span >{boxMessage}</span>}</div> */}
                                <div>
                                    <span>
                                        {boxMessage}
                                        <img src="./img/redemption/dialogue_arrow.gif" />
                                    </span>
                                    {/* <span ref={el} /> */}
                                    {/* <span>
                                        <img
                                            src={`${Enums.BASEPATH}/img/redemption/dialogue_arrow.gif`}
                                        />
                                    </span> */}
                                </div>
                            </div>
                            <div className={s.redemption_footer_octopus}>
                                <img
                                    src={`${Enums.BASEPATH}/img/redemption/avatar_octo_96x96.gif`}
                                    alt="octopus"
                                />
                            </div>
                        </div>
                    </div>
                )}
                <img
                    style={{ display: "none" }}
                    src={`${Enums.BASEPATH}/img/redemption/machine_stuck_x4.gif`}
                />
                <img
                    style={{ display: "none" }}
                    src={`${Enums.BASEPATH}/img/redemption/machine_punch_x4.gif`}
                />
                <img
                    style={{ display: "none" }}
                    src={`${Enums.BASEPATH}/img/redemption/teal_box.png`}
                />
                <img
                    style={{ display: "none" }}
                    src={`${Enums.BASEPATH}/img/redemption/dialogue_box_center_x4.png`}
                />
            </>
        );
    }
};

export default withShellRedeemRollAll(ShellRedeem);

const getRewardPicture = (reward) => {
    switch (reward) {
        case Enums.BOOTS:
            return `${Enums.BASEPATH}/img/redemption/rewards/Boot_7x.png`;
        case Enums.ONE_TO_ONE:
            return `${Enums.BASEPATH}/img/redemption/rewards/one_to_one Call_7x.png`;
        case Enums.ADOPT_ANIMAL:
            return `${Enums.BASEPATH}/img/redemption/rewards/Adopt Animal_7x.png`;
        case Enums.MINT_LIST_SPOT:
            return `${Enums.BASEPATH}/img/redemption/rewards/Mint List_7x.gif`;
        case Enums.EARLY_ACCESS:
            return `${Enums.BASEPATH}/img/redemption/rewards/Early Access V1_7x.png`;
        case Enums.FREE_MINT:
            return `${Enums.BASEPATH}/img/redemption/rewards/Free Mint v2_7x.gif`;
        case Enums.GIFT_MINT_LIST_SPOT:
            return `${Enums.BASEPATH}/img/redemption/rewards/Gift to Fren_7x.png`;
        case Enums.NAME_INGAME:
            return `${Enums.BASEPATH}/img/redemption/rewards/Name character_7x.png`;
        case Enums.ANOMURA_PFP:
            return `${Enums.BASEPATH}/img/redemption/rewards/PFP_7x.png`;
        case Enums.ANOMURA_STICKER:
            return `${Enums.BASEPATH}/img/redemption/rewards/Stickers_7x.png`;
        case Enums.ANOMURA_DOWNLOADABLE_STUFFS:
            return `${Enums.BASEPATH}/img/redemption/rewards/Wallpaper_7x.png`;
        case Enums.OCTOHEDZ_VX_NFT:
            return `${Enums.BASEPATH}/img/redemption/rewards/Octohead_7x.png`;
        case Enums.OCTOHEDZ_RELOADED:
            return `${Enums.BASEPATH}/img/redemption/rewards/Octohead_7x.png`;
        case Enums.COLORMONSTER_NFT:
            return `${Enums.BASEPATH}/img/redemption/rewards/ColorMonsters_7x.png`;
        case Enums.MIRAKAI_SCROLLS_NFT:
            return `${Enums.BASEPATH}/img/redemption/rewards/Miraikai Scrolls_7x.png`;
        case Enums.ALLSTARZ_NFT:
            return `${Enums.BASEPATH}/img/redemption/rewards/AllStarz_7x.png`;
        case Enums.ETHER_JUMP_NFT:
            return `${Enums.BASEPATH}/img/redemption/rewards/Etherjump_7x.png`;
        case Enums.META_HERO_NFT:
            return `${Enums.BASEPATH}/img/redemption/rewards/MetaHero_7x.png`;
        case Enums.EX_8102_NFT:
            return `${Enums.BASEPATH}/img/redemption/rewards/8102_7x.png`;
        case Enums.VOID_RUNNERS_NFT:
            return `${Enums.BASEPATH}/img/redemption/rewards/Void Runner_7x.png`;
        case Enums.ZEN_ACADEMY_NFT:
            return `${Enums.BASEPATH}/img/redemption/rewards/ZenAcademy_7x.png`;
        case Enums.HUMAN_PARK_NFT:
            return `${Enums.BASEPATH}/img/redemption/rewards/Human Park_7x.png`;
        default:
            return `${Enums.BASEPATH}/img/redemption/rewards/Bowl new colors.gif`;
    }
};
const getMachineBackground = (state) => {
    switch (state) {
        case IDLE:
            return s.redemption_machine_idle;
        case PUNCH:
            return s.redemption_machine_punch;
        case STUCK:
            return s.redemption_machine_stuck;
        default:
            return s.redemption_machine_idle;
    }
};
const getClaimButton = (reward, setShowButtonFooter, setFooterMessage) => {
    if (reward === Enums.BOOTS) {
        return "";
    }

    switch (reward) {
        /*  type form */
        case Enums.ONE_TO_ONE:
        case Enums.ADOPT_ANIMAL:
        case Enums.EARLY_ACCESS:
        case Enums.GIFT_MINT_LIST_SPOT:
        case Enums.NAME_INGAME:
        case Enums.ANOMURA_STICKER:
        case Enums.ANOMURA_PFP:
        case Enums.ANOMURA_DOWNLOADABLE_STUFFS:
            return (
                <button
                    className={s.redemption_reward_buttons_claim}
                    onClick={() => {
                        if (reward === Enums.GIFT_MINT_LIST_SPOT) {
                            window.open(`https://d2sdt6y1io4.typeform.com/to/CKtN9ACV`, "_blank");
                        }
                        if (reward === Enums.ONE_TO_ONE) {
                            window.open(`https://d2sdt6y1io4.typeform.com/to/zbK5ysWc`, "_blank");
                        }
                        if (reward === Enums.NAME_INGAME) {
                            window.open(`https://d2sdt6y1io4.typeform.com/to/U3esvAO9`, "_blank");
                        }
                        if (reward === Enums.ANOMURA_STICKER) {
                            window.open(`https://d2sdt6y1io4.typeform.com/to/NJ9Zl1RM`, "_blank");
                        }
                        if (reward === Enums.EARLY_ACCESS) {
                            window.open(`https://d2sdt6y1io4.typeform.com/to/EWdbc5JU`, "_blank");
                        }
                        if (reward === Enums.ADOPT_ANIMAL) {
                            window.open(`https://d2sdt6y1io4.typeform.com/to/PpveRMuN`, "_blank");
                        }
                        if (reward === Enums.ANOMURA_PFP) {
                            window.open(
                                `https://www.notion.so/Congrats-Anomuran-e6202369f1714499b57cd76c72ed7f2b`,
                                "_blank"
                            );
                        }
                        if (reward === Enums.ANOMURA_DOWNLOADABLE_STUFFS) {
                            window.open(
                                `https://www.notion.so/Congrats-Anomuran-ee0d2984fad6418ba1dba606438983fd`,
                                "_blank"
                            );
                        }
                    }}
                >
                    <img src={`${Enums.BASEPATH}/img/redemption/Button_M_Pink.png`} alt="Claim" />
                    <div>
                        <span>Claim</span>
                    </div>
                </button>
            );

        /*  downloadable link */
        case Enums.ANOMURA_PFP:
        case Enums.ANOMURA_DOWNLOADABLE_STUFFS:
            return (
                <button className={s.redemption_reward_buttons_claim}>
                    <img src={`${Enums.BASEPATH}/img/redemption/Button_M_Pink.png`} alt="Claim" />
                    <div>
                        <span>Claim</span>
                    </div>
                </button>
            );
        /*  DTC */
        case Enums.OCTOHEDZ_VX_NFT:
        case Enums.OCTOHEDZ_RELOADED:
        case Enums.COLORMONSTER_NFT:
        case Enums.MIRAKAI_SCROLLS_NFT:
        case Enums.ALLSTARZ_NFT:
        case Enums.ETHER_JUMP_NFT:
        case Enums.META_HERO_NFT:
        case Enums.EX_8102_NFT:
        case Enums.VOID_RUNNERS_NFT:
        case Enums.ZEN_ACADEMY_NFT:
            return (
                <button
                    className={s.redemption_reward_buttons_claim}
                    onClick={() => {
                        setShowButtonFooter(true);
                        setFooterMessage("Open a help ticket in our Discord to claim your reward.");
                    }}
                >
                    <img src={`${Enums.BASEPATH}/img/redemption/Button_M_Pink.png`} alt="Claim" />
                    <div>
                        <span>Claim</span>
                    </div>
                </button>
            );
        case Enums.MINT_LIST_SPOT:
        case Enums.FREE_MINT:
            return (
                <button
                    className={s.redemption_reward_buttons_claim}
                    onClick={() => {
                        setShowButtonFooter(true);
                        setFooterMessage("This reward is Direct to Contract. No action needed.");
                    }}
                >
                    <img src={`${Enums.BASEPATH}/img/redemption/Button_M_Pink.png`} alt="Claim" />
                    <div>
                        <span>DTC</span>
                    </div>
                </button>
            );
        default:
            return (
                <button className={s.redemption_reward_buttons_claim}>
                    <img src={`${Enums.BASEPATH}/img/redemption/Button_M_Pink.png`} alt="Claim" />
                    <div>
                        <span>Claim</span>
                    </div>
                </button>
            );
    }
};
const getShareButton = (reward) => {
    return (
        <button
            className={s.redemption_reward_buttons_share}
            onClick={() => {
                let link = `https://twitter.com/intent/tweet?text=Hello%20world`,
                    url = "",
                    text = "",
                    hashtags = "Anomura%2CRedemptionEvent%2CEnterTheCove";

                if (reward === Enums.BOOTS) {
                    url = "https://t.co/951NZRwOVS";
                    text =
                        "I%20just%20won%20this%20beautiful%20boot%20from%20@AnomuraGame.%20It%27s%20useless%2C%20but%20at%20least%20it%27s%20cute.%0a%0a";
                }
                if (reward === Enums.MINT_LIST_SPOT) {
                    url = "https://t.co/RHjmQH1UOM";
                    text =
                        "I%20won%20a%20mintlist%20spot%20thanks%20to%20@AnomuraGame.%20Can%27t%20wait%20to%20mint%20a%20Mystery%20Bowl%20on%20Sept%206.%0a%0a";
                }
                if (reward === Enums.GIFT_MINT_LIST_SPOT) {
                    url = "https://t.co/s36FTU96aZ";
                    text =
                        "Hi%20frens%21%20I%20won%20an%20extra%20mintlist%20spot%20from%20@AnomuraGame%21%20Who%20wants%20it%3F%0a%0a";
                }
                if (reward === Enums.FREE_MINT) {
                    url = "https://t.co/7okk3uBv4d";
                    text =
                        "I%20won%20a%20FREE%20mint%20from%20@AnomuraGame%21%21%20Can%27t%20wait%20for%20their%20Mint%20Day%20on%20Sept%206%0a%0a";
                }
                if (reward === Enums.ANOMURA_DOWNLOADABLE_STUFFS) {
                    url = "https://t.co/yXN7JZ0xyi";
                    text = "I%20just%20won%20some%20Anomur-ART%20from%20@AnomuraGame%21%0a%0a";
                }
                if (reward === Enums.ANOMURA_STICKER) {
                    url = "https://t.co/uDqJhdNPki";
                    text =
                        "Can%27t%20wait%20to%20receive%20the%20Crab%20Swag%20that%20I%20won%20from%20@AnomuraGame%21%20Love%20the%20prize%20options%21%0a%0a";
                }
                if (reward === Enums.ANOMURA_PFP) {
                    url = "https://t.co/Uz9BJuTh4p";
                    text =
                        "Loving%20the%20new%20Anomura%20avatar%20that%20I%20won%20from%20@AnomuraGame%21%0a%0a";
                }
                if (reward === Enums.ONE_TO_ONE) {
                    url = "https://t.co/uPkCBLZmfg";
                    text =
                        "Excited%20to%20meet%20a%20C.R.A.B%20team%20member%20from%20@AnomuraGame%20I%20can%27t%20wait%20to%20learn%20more%20from%20the%20team.%0a%0a";
                }
                if (reward === Enums.NAME_INGAME) {
                    url = "https://t.co/wzjQcjV78R";
                    text =
                        "Wow%2C%20I%20won%20a%20chance%20to%20name%20a%20character%20in%20@AnomuraGame%21%20What%20should%20I%20name%20it%3F%0a%0a";
                }
                if (reward === Enums.EARLY_ACCESS) {
                    url = "https://t.co/6Z3avzvJTs";
                    text =
                        "Excited%20to%20be%20part%20of%20a%20private%20viewing%20of%20@AnomuraGame%27s%20concept%20demo%21%0a%0a";
                }
                if (reward === Enums.ADOPT_ANIMAL) {
                    url = "https://t.co/sMmWLCxHxg";
                    text =
                        "Amazing%21%20@AnomuraGame%20@Zeneca_33%20and%20@ZenAcademy%20will%20be%20adopting%20an%20animal%20for%20me%20from%20@TheTorontoZoo%21%20I%20love%20being%20able%20to%20give%20back.%0a%0a";
                }
                if (reward === Enums.OCTOHEDZ_VX_NFT || reward === Enums.OCTOHEDZ_RELOADED) {
                    url = "https://t.co/26kndeZ3rQ";
                    text =
                        "Wow%21%20I%20just%20won%20a%20@OctoHedz%20NFT%20from%20@AnomuraGame%27s%20%24SHELL%20Redemption%20event.%0a%0a";
                }
                if (reward === Enums.COLORMONSTER_NFT) {
                    url = "https://t.co/ii0cOHWwwI";
                    text =
                        "Wow%21%20I%20just%20won%20a%20@colormonsterNFT%20from%20@AnomuraGame%27s%20%24SHELL%20Redemption%20event.%0a%0a";
                }
                if (reward === Enums.HUMAN_PARK_NFT) {
                    url = "https://t.co/hLP8MorM3X";
                    text =
                        "Wow%21%20I%20just%20won%20a%20@FreeHumanPark%20NFT%20from%20@AnomuraGame%27s%20%24SHELL%20Redemption%20event.%0a%0a";
                }
                if (reward === Enums.EX_8102_NFT) {
                    url = "https://t.co/jJjhGUoUDU";
                    text =
                        "Wow%21%20I%20just%20won%20a%20@the8102game%20NFT%20from%20@AnomuraGame%27s%20%24SHELL%20Redemption%20event.%0a%0a";
                }
                if (reward === Enums.VOID_RUNNERS_NFT) {
                    url = "https://t.co/CgP5k6oiL4";
                    text =
                        "Wow%21%20I%20just%20won%20a%20@void__runners%20NFT%20from%20@AnomuraGame%27s%20%24SHELL%20Redemption%20event.%0a%0a";
                }
                if (reward === Enums.ETHER_JUMP_NFT) {
                    url = "https://t.co/LQqbyVODGg";
                    text =
                        "Wow%21%20I%20just%20won%20a%20@etherjump%20NFT%20from%20@AnomuraGame%27s%20%24SHELL%20Redemption%20event.%0a%0a";
                }
                if (reward === Enums.MIRAKAI_SCROLLS_NFT) {
                    url = "https://t.co/FxmDaCNqIp";
                    text =
                        "Wow%21%20I%20just%20won%20a%20@OfficialMirakai%20NFT%20from%20@AnomuraGame%27s%20%24SHELL%20Redemption%20event.%0a%0a";
                }
                if (reward === Enums.ALLSTARZ_NFT) {
                    url = "https://t.co/NGBNw9C9Gs";
                    text =
                        "Wow%21%20I%20just%20won%20a%20@allstarz_nft%20NFT%20from%20@AnomuraGame%27s%20%24SHELL%20Redemption%20event.%0a%0a";
                }
                if (reward === Enums.META_HERO_NFT) {
                    url = "https://t.co/8q1lOlX180";
                    text =
                        "Wow%21%20I%20just%20won%20a%20@Metahero_io%20NFT%20from%20@AnomuraGame%27s%20%24SHELL%20Redemption%20event.%0a%0a";
                }
                if (reward === Enums.ZEN_ACADEMY_NFT) {
                    // url = "https://t.co/8q1lOlX180";
                    text =
                        "Wow%21%20I%20just%20won%20a%20@ZenAcademy_%20NFT%20from%20@AnomuraGame%27s%20%24SHELL%20Redemption%20event.%0a%0a";
                }

                link = `https://twitter.com/intent/tweet?url=${url}&text=${text}&hashtags=${hashtags}`;
                window.open(link, "_blank");
            }}
        >
            <img src={`${Enums.BASEPATH}/img/redemption/Button_M_Blue.png`} alt="Share" />
            <div>
                <img src={`${Enums.BASEPATH}/img/redemption/Icon_Twitter.png`} alt="twitter icon" />
                <span>Share</span>
            </div>
        </button>
    );
};
