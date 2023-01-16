import { prisma } from "@context/PrismaContext";
import adminMiddleware from "middlewares/adminMiddleware";
import axios from "axios";

const approveImageQuestAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                const { questId, extendedUserQuestData, user } = req.body;
                const { discordChannel, imageUrl } = extendedUserQuestData;

                // query discord backend and backend secret
                let variables = await prisma.questVariables.findFirst();

                const { discordSecret, discordBackend } = variables;

                if (discordSecret.trim().length < 1 || discordBackend.trim().length < 1) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "Missing Discord Server Config!" });
                }

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

                // trying upload on cloudinary



                /**
                 * 1. Post a message to discord channel
                 * 2. Update UserQuest with discord message id
                 */

                let discordMsg = await axios.post(
                    `${discordBackend}/api/v1/channels/image-quest`,
                    {
                        user,
                        imageUrl,
                        discordChannel,
                    },
                    {
                        headers: {
                            Authorization: `Bot ${discordSecret}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

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
                        isHidden: true, // successful post should hide this image from approval
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



export default adminMiddleware(approveImageQuestAPI);