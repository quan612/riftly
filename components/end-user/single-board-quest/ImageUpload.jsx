import React, { useEffect, useState, useContext, useRef } from "react";
import { Web3Context } from "@context/Web3Context";
import s from "/sass/claim/claim.module.css";
import axios from "axios";
import { withUserImageQuestQuery, withUserImageQuestSubmit } from "shared/HOC/quest";
import Enums from "enums";
import { useRouter } from "next/router";
import { BoardSmallDollarSign } from "..";
import * as nsfwjs from "@nsfw-filter/nsfwjs";
import { BackToMainBoardButton, DisconnectButton } from "../shared";

const ANOMURA_DISCORD_SERVER = "851558628032905286";

const UPLOADABLE = 0;
const SUBMITTABLE = 1;
const SUBMITTED = 2;
const ERROR = 3;

const ImageUpload = ({
    session,
    onSubmitImageQuest,
    isSubmitting,
    isFetchingUserQuests,
    userQuests,
}) => {
    const [currentQuest, setCurrentQuest] = useState(null);
    const [submittedQuest, setSubmittedQuest] = useState(null);
    const [error, setError] = useState(null);
    const { SignOut } = useContext(Web3Context);

    const [nsfwModel, setNSFWModel] = useState(null);
    const [currentView, setView] = useState(UPLOADABLE);
    const [imageSrc, setImageSrc] = useState();
    const [imageFile, setImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { eventName } = router.query;

    const hiddenFileInput = useRef(null);
    const imageEl = useRef(null);

    useEffect(async () => {
        let model = await nsfwjs.load();
        setNSFWModel(model);
    }, []);

    useEffect(async () => {
        if (userQuests) {
            let findSubmissionQuest = userQuests.find(
                (q) =>
                    q.type?.name === Enums.IMAGE_UPLOAD_QUEST &&
                    q.extendedQuestData?.eventName?.toLowerCase() === eventName.toLowerCase()
            );

            if (!findSubmissionQuest || findSubmissionQuest == undefined) {
                setView(ERROR);
                return setError("Cannot find this quest");
            }

            if (findSubmissionQuest) {
                let submittedQuestBefore = await axios.get(
                    `${Enums.BASEPATH}/api/user/quest/${findSubmissionQuest.questId}`
                );

                if (submittedQuestBefore.data.isError) {
                    setView(ERROR);
                    return setError(submittedQuestBefore?.data?.message);
                }

                if (submittedQuestBefore) {
                    setSubmittedQuest(submittedQuestBefore.data);
                }
                if (findSubmissionQuest.isDone) {
                    setView(SUBMITTED);
                }
            }
            setCurrentQuest(findSubmissionQuest);
        }
    }, [userQuests]);

    const handleClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        hiddenFileInput.current.click();
    };

    function handleOnChange(changeEvent) {
        const reader = new FileReader();

        reader.onload = function (onLoadEvent) {
            setImageSrc(onLoadEvent.target.result);
        };

        reader.readAsDataURL(changeEvent.target.files[0]);
        setImageFile(changeEvent.target.files[0]);
        setView(SUBMITTABLE);
    }

    async function handleOnSubmit() {
        try {
            const predictions = await nsfwModel.classify(imageEl.current);

            setIsLoading(true);
            /** Checking for NSFW */
            let toContinue = true;
            let imageProcess = predictions.map((p) => {
                if (p?.className === "Porn" && p.probability >= 0.6) {
                    toContinue = false;
                }
                if (p?.className === "Hentai" && p.probability >= 0.6) {
                    toContinue = false;
                }
            });

            await Promise.all(imageProcess);
            if (!toContinue) {
                setError("Image contains NSFW content. Please reupload new image.");
                return;
            }

            const res = await axios.post("/challenger/api/user/image-upload", {
                data: imageSrc,
            });

            if (!res?.data?.secure_url) {
                console.error("Image is not cached");
                console.error(res);
                return;
            }
            /** Submit this quest */
            const { questId, type, rewardTypeId, quantity, extendedQuestData } = currentQuest;

            let submission = {
                questId,
                type,
                rewardTypeId,
                quantity,
                imageUrl: res?.data?.secure_url,
                extendedQuestData,
            };
            let questSubmit = await onSubmitImageQuest(submission, userQuests);

            if (!questSubmit.data.isError) {
                setSubmittedQuest(questSubmit);
                setView(SUBMITTED);
            } else {
                setError(questSubmit.data.message);
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    }

    return (
        <div className={s.board}>
            <div className={s.board_container}>
                <BoardSmallDollarSign />
                <div className={s.board_wrapper}>
                    <div className={s.board_content}>
                        {(isSubmitting || isFetchingUserQuests || isLoading) && (
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
                        {currentView === ERROR && (
                            <span className={`${s.board_imageUpload_imageName} text-black`}>
                                {error}
                            </span>
                        )}
                        {currentQuest && !isSubmitting && !isFetchingUserQuests && !isLoading && (
                            <>
                                {currentView === UPLOADABLE && (
                                    <>
                                        <div className={s.board_title}>{currentQuest.text}</div>

                                        <form
                                            id="image-upload"
                                            method="post"
                                            onChange={handleOnChange}
                                        >
                                            <p className={s.board_imageUpload_wrapper}>
                                                <button
                                                    className={s.board_pinkBtn}
                                                    onClick={handleClick}
                                                >
                                                    <img
                                                        src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large.png`}
                                                        alt="Choose File"
                                                    />
                                                    <div>
                                                        <span>Choose File</span>
                                                    </div>
                                                </button>
                                                <input
                                                    type="file"
                                                    name="file"
                                                    accept="image/jpeg, image/png"
                                                    style={{ display: "none" }}
                                                    ref={hiddenFileInput}
                                                />
                                            </p>
                                        </form>
                                    </>
                                )}
                                {currentView === SUBMITTABLE && (
                                    <>
                                        {!error && (
                                            <span className={s.board_imageUpload_imageName}>
                                                {imageFile.name}
                                            </span>
                                        )}
                                        {error && (
                                            <span className={s.board_imageUpload_imageName}>
                                                {error}
                                            </span>
                                        )}
                                        <img
                                            src={imageSrc}
                                            className={s.board_imageUpload_imagePreview}
                                            ref={imageEl}
                                        />

                                        <div className={s.board_buttonContainer}>
                                            <button
                                                className={s.board_blackBtn}
                                                onClick={() => {
                                                    setView(UPLOADABLE);
                                                    setImageFile(null);
                                                    setImageSrc(null);
                                                    setError(null);
                                                }}
                                            >
                                                <img
                                                    src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Small 2.png`}
                                                    alt="Go Back"
                                                />
                                                <div>
                                                    <span>Back</span>
                                                </div>
                                            </button>
                                            <button
                                                className={s.board_pinkBtn}
                                                onClick={handleOnSubmit}
                                                disabled={
                                                    currentQuest?.isDone ||
                                                    isSubmitting ||
                                                    isFetchingUserQuests ||
                                                    error
                                                }
                                            >
                                                <img
                                                    src={
                                                        !currentQuest?.isDone
                                                            ? `${Enums.BASEPATH}/img/sharing-ui/invite/Button_Small.png`
                                                            : `${Enums.BASEPATH}/img/sharing-ui/invite/Button_Small 2.png`
                                                    }
                                                    alt="Submit"
                                                />
                                                <div>
                                                    <span>{currentQuest.quantity}</span>
                                                    {currentQuest.rewardType.reward.match(
                                                        "hell"
                                                    ) && (
                                                        <img
                                                            src={`${Enums.BASEPATH}/img/sharing-ui/invite/shell.png`}
                                                            alt="reward icon"
                                                        />
                                                    )}

                                                    {currentQuest.rewardType.reward.match(
                                                        /bowl|Bowl/
                                                    ) && (
                                                        <img
                                                            src={`${Enums.BASEPATH}/img/sharing-ui/invite/bowl10frames.gif`}
                                                            alt="reward icon"
                                                        />
                                                    )}
                                                </div>
                                            </button>
                                        </div>
                                    </>
                                )}
                                {currentView === SUBMITTED && (
                                    <>
                                        <div className={s.board_title}>
                                            Thanks for your submission!
                                        </div>
                                        {submittedQuest?.extendedUserQuestData?.messageId && (
                                            <button
                                                className={s.board_purpleBtn}
                                                onClick={() => {
                                                    window.open(
                                                        `https://discord.com/channels/${ANOMURA_DISCORD_SERVER}/${submittedQuest?.extendedUserQuestData?.discordChannel}/${submittedQuest?.extendedUserQuestData?.messageId}`,
                                                        "_blank"
                                                    );
                                                }}
                                            >
                                                <img
                                                    src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large 4.png`}
                                                    alt="See In Discord"
                                                />
                                                <div>
                                                    <span>See it in Discord</span>
                                                </div>
                                            </button>
                                        )}
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

const firstHOC = withUserImageQuestSubmit(ImageUpload);
export default withUserImageQuestQuery(firstHOC);
