import whitelistUserMiddleware from "@middlewares/whitelistUserMiddleware";
import { prisma } from "@context/PrismaContext";
import { getWhiteListUserByUserId } from "repositories/user";

const handler = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const whiteListUser = req.whiteListUser;

                const { userquestId } = req.query;
                if (!userquestId) {
                    return res.status(200).json({ isError: true, message: "Missing query." });
                }

                // querying current user if same discord or twitter finish this quest before
                let userQuery = await getWhiteListUserByUserId(whiteListUser.userId);
                let usersOfThisQuest = await prisma.userQuest.findMany({
                    where: {
                        questId: userquestId,
                    },
                    include: {
                        user: true,
                    },
                });

                let userQuestData = await prisma.userQuest.findFirst({
                    where: {
                        questId: userquestId,
                        userId: whiteListUser.userId,
                    },
                });

                // user completed quest
                if (userQuestData) {
                    return res.status(200).json(userQuestData);
                }

                // not completed this quest yet
                let shouldAllowToDoQuest = true;
                if (usersOfThisQuest.length !== 0) {
                    let checkOp = usersOfThisQuest.map((uq) => {
                        if (
                            uq.user.discordUserDiscriminator !== null &&
                            uq.user.discordUserDiscriminator === userQuery.discordUserDiscriminator
                        ) {
                            shouldAllowToDoQuest = false;
                        }
                        if (
                            uq.user.twitterUserName !== null &&
                            uq.user.twitterUserName === userQuery.twitterUserName
                        ) {
                            shouldAllowToDoQuest = false;
                        }
                    });

                    await Promise.all(checkOp);

                    if (!shouldAllowToDoQuest) {
                        return res
                            .status(200)
                            .json({
                                isError: true,
                                message: "Same discord or twitter has been used to do this quest.",
                            });
                    }
                }

                if (userQuestData?.length > 0) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "Find more than 1 user quest per user." });
                }

                res.status(200).json(userQuestData);
            } catch (err) {
                console.log(err);
                res.status(500).json({ err });
            }
            break;
        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default whitelistUserMiddleware(handler);
