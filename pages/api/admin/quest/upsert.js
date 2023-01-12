import { prisma } from "context/PrismaContext";
import Enums from "enums";
import { questUpsert } from "repositories/quest";
import adminMiddleware from "middlewares/adminMiddleware";

const ROUTE = "/api/admin/quest/upsert";
const AdminQuestUpsertAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        /*  
            @dev Create a new quest for user
        */
        case "POST":
            try {
                const {
                    id,
                    type,
                    description,
                    text,
                    completedText,
                    rewardTypeId,
                    quantity,
                    isEnabled,
                    isRequired,
                    extendedQuestData,
                } = req.body;

                // look for quest type id of this type
                let questType = await prisma.questType.findUnique({
                    where: {
                        name: type,
                    },
                });

                if (!questType) {
                    return res
                        .status(200)
                        .json({ isError: true, message: `Cannot find quest type ${type}` });
                }
                let newExtendedQuestData;

                if (id === 0) {
                    // add new userquest
                    console.log(`** Creating new quest **`);
                    newExtendedQuestData = { ...extendedQuestData };

                    let existingQuests = await prisma.quest.findMany({
                        include: {
                            type: true,
                        },
                    });

                    let unstoppableAuth = unstoppableAuthCheck(existingQuests, questType.name);
                    if (unstoppableAuth) {
                        return res.status(200).json({
                            message: `Cannot add more than one "${type}" type for same auth `,
                            isError: true,
                        });
                    }

                    let existingDiscordTwitterAuth = discordTwitterAuthCheck(
                        existingQuests,
                        questType.name
                    );
                    if (existingDiscordTwitterAuth) {
                        return res.status(200).json({
                            message: `Cannot add more than one "${type}" type for same auth `,
                            isError: true,
                        });
                    }

                    let existingJoinDiscord = joinDiscordCheck(
                        existingQuests,
                        extendedQuestData,
                        questType.name
                    );
                    if (existingJoinDiscord) {
                        return res.status(200).json({
                            message: `Cannot add more than one "${type}" type`,
                            isError: true,
                        });
                    }

                    let existingTwitterRetweet = retweetCheck(
                        existingQuests,
                        extendedQuestData,
                        questType.name
                    );
                    if (existingTwitterRetweet) {
                        return res.status(200).json({
                            message: `Cannot add more than one "${type}" type for same tweetId "${extendedQuestData.tweetId}"`,
                            isError: true,
                        });
                    }

                    let existingFollowTwitter = followTwitterCheck(
                        existingQuests,
                        extendedQuestData,
                        questType.name
                    );
                    if (existingFollowTwitter) {
                        return res.status(200).json({
                            message: `Cannot add more than one "${type}" type for same twitter "${extendedQuestData.followAccount}".`,
                            isError: true,
                        });
                    }

                    let existingFollowInstagram = followInstagramCheck(
                        existingQuests,
                        extendedQuestData,
                        questType.name
                    );
                    if (existingFollowInstagram) {
                        return res.status(200).json({
                            message: `Cannot add more than one "${type}" type for same instagram "${extendedQuestData.followAccount}".`,
                            isError: true,
                        });
                    }

                    let ownNftCheck = owningNftCheck(
                        existingQuests,
                        extendedQuestData,
                        questType.name
                    );
                    if (ownNftCheck) {
                        return res.status(200).json({
                            message: `Cannot add more than one "${type}" type to quest list `,
                            isError: true,
                        });
                    }

                    let existingCollaboration = collaborationClaimQuestCheck(
                        existingQuests,
                        extendedQuestData,
                        questType.name
                    );
                    if (existingCollaboration) {
                        return res.status(200).json({
                            message: `Cannot add more than one "${type}" type of quest for same collaboration "${extendedQuestData.collaboration}".`,
                            isError: true,
                        });
                    }

                    let existingCodeQuest = codeQuestCheck(
                        existingQuests,
                        extendedQuestData,
                        questType.name
                    );
                    if (existingCodeQuest) {
                        return res.status(200).json({
                            message: `Cannot add more than one "${type}" type of code quest for same event "${extendedQuestData.codeEvent}".`,
                            isError: true,
                        });
                    }

                    let existingImageUploadQuest = imageUploadQuestCheck(
                        existingQuests,
                        extendedQuestData,
                        questType.name
                    );

                    if (existingImageUploadQuest) {
                        return res.status(200).json({
                            message: `Cannot add more than one "${type}" type of image quest for same event "${extendedQuestData?.eventName}" or same discord channel "${extendedQuestData.discordChannel}".`,
                            isError: true,
                        });
                    }
                } else {
                    // update userquest, we need to get original extendedQuestData and create a new object to avoid data loss
                    console.log(`** Upserting a quest **`);
                    let originalQuest = await prisma.quest.findUnique({
                        where: { id },
                    });

                    if (originalQuest) {
                        newExtendedQuestData = {
                            ...originalQuest.extendedQuestData,
                            ...extendedQuestData,
                        };
                    }
                }

                let newQuest = await questUpsert(
                    id,
                    questType.id,
                    description,
                    text,
                    completedText,
                    rewardTypeId,
                    quantity,
                    isEnabled,
                    isRequired,
                    newExtendedQuestData
                );

                if (!newQuest) {
                    res.status(200).json({
                        isError: true,
                        message: `Cannot upsert quest ${id}, type ${type}`,
                    });
                }

                res.status(200).json(newQuest);
            } catch (err) {
                console.log(err);
                res.status(500).json({ err });
            }
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

// DISCORD_AUTH: "Discord Authenticate",
// TWITTER_AUTH: "Twitter Authenticate",
// TWITTER_RETWEET: "Retweet a Tweet",
// FOLLOW_TWITTER: "Follow Twitter Account",
// FOLLOW_INSTAGRAM: "Follow Instagram Account",
// IMAGE_UPLOAD_QUEST: "Image Upload Quest",

const unstoppableAuthCheck = (existingQuests, type) => {
    if (type != Enums.UNSTOPPABLE_AUTH) return;

    let unstoppableAuthQuest = existingQuests.filter((q) => q.type.name === Enums.UNSTOPPABLE_AUTH);

    if (unstoppableAuthQuest?.length >= 1 && type === Enums.UNSTOPPABLE_AUTH) {
        return true;
    }
    return false;
};

const discordTwitterAuthCheck = (existingQuests, type) => {
    if (type != Enums.DISCORD_AUTH && type != Enums.TWITTER_AUTH) return;

    let discordAuthQuest = existingQuests.filter((q) => q.type.name === Enums.DISCORD_AUTH);
    let twitterAuthQuest = existingQuests.filter((q) => q.type.name === Enums.TWITTER_AUTH);

    if (
        (discordAuthQuest?.length >= 1 && type === Enums.DISCORD_AUTH) ||
        (twitterAuthQuest?.length >= 1 && type === Enums.TWITTER_AUTH)
    ) {
        return true;
    }
    return false;
};

const joinDiscordCheck = (existingQuests, type) => {
    if (type != Enums.JOIN_DISCORD) return;

    let joinDiscordQuest = existingQuests.filter((q) => q.type.name === Enums.JOIN_DISCORD);

    return joinDiscordQuest.some(
        (q) => q.extendedQuestData.discordServer === extendedQuestData.discordServer
    );
};
const followTwitterCheck = (existingQuests, extendedQuestData, type) => {
    if (type !== Enums.FOLLOW_TWITTER) return;
    let followTwitterQuest = existingQuests.filter((q) => q.type.name === Enums.FOLLOW_TWITTER);

    return followTwitterQuest.some(
        (q) => q.extendedQuestData.followAccount === extendedQuestData.followAccount
    );
};
const followInstagramCheck = (existingQuests, extendedQuestData, type) => {
    if (type !== Enums.FOLLOW_INSTAGRAM) return;

    let followInstagramQuest = existingQuests.filter((q) => q.type.name === Enums.FOLLOW_INSTAGRAM);

    return followInstagramQuest.some(
        (q) => q.extendedQuestData.followAccount === extendedQuestData.followAccount
    );
};
const retweetCheck = (existingQuests, extendedQuestData, type) => {
    if (type !== Enums.TWITTER_RETWEET) return;
    let twitterRetweetQuest = existingQuests.filter((q) => q.type.name === Enums.TWITTER_RETWEET);

    return twitterRetweetQuest.some(
        (q) => q.extendedQuestData.tweetId === extendedQuestData.tweetId
    );
};

const owningNftCheck = (existingQuests, extendedQuestData, type) => {
    if (type != Enums.OWNING_NFT_CLAIM) return;

    let owningNftQuests = existingQuests.filter((q) => q.type.name === Enums.OWNING_NFT_CLAIM);

    // false if same nft name existed
    return owningNftQuests.some((q) => q.extendedQuestData.nft === extendedQuestData.nft);
};

const collaborationClaimQuestCheck = (existingQuests, extendedQuestData, type) => {
    if (type !== Enums.COLLABORATION_FREE_SHELL) return;
    let collaborationClaim = existingQuests.filter(
        (q) => q.type.name === Enums.COLLABORATION_FREE_SHELL
    );

    return collaborationClaim.some(
        (q) => q.extendedQuestData.collaboration === extendedQuestData.collaboration
    );
};
const codeQuestCheck = (existingQuests, extendedQuestData, type) => {
    if (type !== Enums.CODE_QUEST) return;

    let existingCodeQuests = existingQuests.filter((q) => q.type.name === Enums.CODE_QUEST);

    return existingCodeQuests.some(
        (q) => q.extendedQuestData.codeEvent === extendedQuestData.codeEvent
    );
};

const imageUploadQuestCheck = (existingQuests, extendedQuestData, type) => {
    if (type !== Enums.IMAGE_UPLOAD_QUEST) return;

    let existingCodeQuests = existingQuests.filter((q) => q.type.name === Enums.IMAGE_UPLOAD_QUEST);

    return existingCodeQuests.some(
        (q) =>
            q.extendedQuestData.eventName.toLowerCase() ===
            extendedQuestData.eventName.toLowerCase() ||
            q.extendedQuestData.discordChannel === extendedQuestData.discordChannel
    );
};

export default adminMiddleware(AdminQuestUpsertAPI);
