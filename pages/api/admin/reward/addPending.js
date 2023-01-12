import { prisma } from "@context/PrismaContext";
import Enums from "enums";
import axios from "axios";
import { createPendingReward } from "repositories/reward";
import adminMiddleware from "middlewares/adminMiddleware";

const AddPendingRewardAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        /*  
            @dev Create a new pending reward
            0. Check if req is from an admin
            1. Look for user in database if exists
            2. Create a pending reward since we found the user
            3. Show in discord if ShowInDiscord is true
        */
        case "POST":
            try {
                const { username, type, rewardTypeId, quantity, postInDiscordChannels } = req.body;

                let userCondition = username;

                if (type === Enums.DISCORD && username.trim().length > 0) {
                    userCondition = { discordUserDiscriminator: username };
                } else if (type === Enums.TWITTER && username.trim().length > 0) {
                    userCondition = { twitterUserName: username };
                } else {
                    userCondition = { wallet: username };
                }

                let user = await prisma.whiteList.findFirst({
                    where: userCondition,
                });

                if (!user) {
                    res.status(200).json({
                        message: `Cannot find any user with id ${username}.`,
                        isError: true,
                    });
                    return;
                }

                // query discordBotToken backend and hostUrl
                let variables = await prisma.questVariables.findFirst();

                const { discordBotToken, hostUrl } = variables;

                if (discordBotToken.trim().length < 1 || hostUrl.trim().length < 1) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "Missing Server Config To Reward User!" });
                }

                console.log(`** Pending Reward: Create reward for user**`);
                let pendingReward = await createPendingReward(rewardTypeId, quantity, user);

                if (!pendingReward) {
                    return res.status(200).json({
                        isError: true,
                        message: `Cannot add pending reward for user ${user.userId}`,
                    });
                }

                pendingReward.imageUrl = variables?.pendingRewardImageUrl;
                pendingReward.embededLink = `${hostUrl}/claim/${user.userId}?specialcode=${pendingReward.generatedURL}`;

                if (user.discordId != null && user.discordId.trim().length > 0) {
                    pendingReward.receivingUser = `<@${user.discordId.trim()}>`;
                } else if (user.uathUser != null && user.uathUser.trim().length > 0) {
                    pendingReward.receivingUser = user.uathUser;
                } else if (user.twitterUserName != null && user.twitterUserName.trim().length > 0) {
                    pendingReward.receivingUser = user.twitterUserName;
                } else if (user.wallet != null && user.wallet.trim().length > 0) {
                    pendingReward.receivingUser = user.wallet;
                } else {
                    pendingReward.receivingUser = user.userId;
                }

                let messageContent = `** ${pendingReward.receivingUser} has just discovered a treasure chest...** `;
                let description = `Click [here](${pendingReward.embededLink}) to open your chest and reveal what's inside!`;

                let errorArray = [];
                if (postInDiscordChannels.length > 0) {

                    let discordOp = postInDiscordChannels.map(async (discord, index) => {
                        console.log(discord.channelId)
                        await axios
                            .post(
                                `https://discord.com/api/channels/${discord.channelId}/messages`,
                                {
                                    content: messageContent,
                                    embeds: [
                                        {
                                            image: {
                                                url: "https://res.cloudinary.com/deepsea/image/upload/v1673395967/Others/Treasure-Chest_txlqb4.gif",
                                            },
                                            description,
                                        },
                                    ],
                                },
                                {
                                    headers: {
                                        Authorization: `Bot ${discordBotToken}`,
                                        "Content-Type": "application/json",
                                    },
                                }
                            )
                            .catch((err) => {
                                // console.log(err.response)
                                errorArray.push({ index, error: `Catch error for channel ${discord.channel}, ${err?.response.data.message}.` })
                            });
                    })

                    await Promise.all(discordOp)
                }
                if (errorArray.length > 0) {
                    pendingReward.errorArray = errorArray
                }
                res.status(200).json(pendingReward);
            } catch (err) {
                console.log(err);
                res.status(200).json({ isError: true, err: err.message });
            }
            break;
        default:
            res.setHeader("Allow", ["GET", "PUT"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default adminMiddleware(AddPendingRewardAPI);

/* Using nodejs server
await axios
    .post(
        `${discordBackend}/api/v1/channels/pendingReward`,
        {
            pendingReward,
            postInDiscord: { postInBotChannel, postInGeneralChannel },
            user
        },
        {
            headers: {
                Authorization: `Bot ${discordSecret}`,
                "Content-Type": "application/json",
            },
        }
    )
    .catch((err) => {
        // console.log(err);
    });
    */