import { prisma } from "@context/PrismaContext";
import adminMiddleware from "middlewares/adminMiddleware";
import axios from "axios";

const { NODEJS_SECRET, DISCORD_NODEJS } = process.env;

const approveImageQuestAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                const { questId, extendedUserQuestData, user } = req.body;
                const { discordChannel, imageUrl } = extendedUserQuestData;

                let entry = await prisma.UserQuest.findUnique({
                    where: {
                        userId_questId: { userId: user.userId, questId },
                    },
                });
                if (!entry) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "Cannot find this user quest!" });
                }

                /**
                 * 1. Post a message to discord channel
                 * 2. Update UserQuest with discord message id
                 */
                let discordMsg = await discordHelper(user, discordChannel, imageUrl);

                if (!discordMsg) {
                    return res.status(200).json({
                        isError: true,
                        message: "Image cannot be uploaded. Pls contact administrator!",
                    });
                }
                if (!discordMsg?.data?.response?.id) {
                    return res.status(200).json({
                        isError: true,
                        message:
                            "Cannot get discord message id after uploaded. Pls contact administrator!",
                    });
                }

                let newExtendedUserQuestData = {
                    ...extendedUserQuestData,
                    messageId: discordMsg?.data?.response?.id,
                    reaction: 0,
                };

                let updateQuest = await prisma.UserQuest.update({
                    where: {
                        userId_questId: { userId: user.userId, questId },
                    },
                    data: {
                        extendedUserQuestData: newExtendedUserQuestData,
                    },
                });
                if (!updateQuest) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "User Quest cannot be submitted!" });
                }

                return res.status(200).json(updateQuest);
            } catch (error) {
                console.log(error);
                return res.status(200).json({ isError: true, message: error.message });
            }
            break;
        default:
            res.setHeader("Allow", ["GET", "PUT"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

const discordHelper = async (user, discordChannel, imageUrl) => {
    let discordPost = await axios.post(
        `${DISCORD_NODEJS}/api/v1/channels/image-quest`,
        {
            user,
            imageUrl,
            discordChannel,
        },
        {
            headers: {
                Authorization: `Bot ${NODEJS_SECRET}`,
                "Content-Type": "application/json",
            },
        }
    );

    return discordPost;
};

export default adminMiddleware(approveImageQuestAPI);