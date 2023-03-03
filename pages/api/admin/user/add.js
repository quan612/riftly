import adminMiddleware from "@middlewares/adminMiddleware";
import Enums, { DISCORD, TWITTER, WALLET } from "enums";
import { prisma } from "context/PrismaContext";
import axios from "axios";
import { utils } from "ethers";
import { AccountStatus } from "@prisma/client";
import { getAccountStatusToAdd } from "repositories/user";

const AdminUserAddAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                const { user, type } = req.body;
                let accountStatus = await getAccountStatusToAdd();

                if (type === Enums.DISCORD) {
                    let existingUser = await prisma.whiteList.findFirst({ where: { discordId: user } })
                    if (existingUser) {
                        return res.status(200).json({ isError: true, message: `${user} existed on database.` });
                    }

                    let variables = await prisma.questVariables.findFirst();
                    const { discordBotToken, twitterBearerToken } = variables;

                    if (discordBotToken.trim().length < 1 || twitterBearerToken.trim().length < 1) {
                        return res.status(200).json({ isError: true, message: "Missing config for querying discord / twitter user." });
                    }

                    //resolving discordId into Discord Username
                    let discordUserQuery = await axios.get(`https://discord.com/api/users/${user}`,
                        {
                            headers: {
                                Authorization: `Bot ${discordBotToken}`,
                                "Content-Type": "application/json",
                            },
                        }).catch((err) => {
                            let message = err?.response.data.message;
                            throw new Error(message)
                        })

                    let { username, discriminator } = discordUserQuery.data
                    const newUser = await prisma.whiteList.create({
                        data: {
                            discordId: user,
                            discordUserDiscriminator: `${username}#${discriminator}`,
                            status: accountStatus,
                            signUpOrigin: DISCORD
                        },
                    });

                    return res.status(200).json(newUser);
                }
                if (type === Enums.TWITTER) {
                    let existingUser = await prisma.whiteList.findFirst({ where: { twitterId: user } })
                    if (existingUser) {
                        return res.status(200).json({ isError: true, message: `${user} existed on database.` });
                    }

                    let twitterUserQuery = await axios
                        .get(`https://api.twitter.com/2/users/by?usernames=${user}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${twitterBearerToken}`,
                                    "Content-Type": "application/json",
                                },
                            })
                        .catch((err) => {
                            let message = err?.response.data.message;
                            throw new Error(message)
                        })

                    let { id, name, username } = twitterUserQuery.data.data[0];

                    if (id && username) {
                        const newUser = await prisma.whiteList.create({
                            data: {
                                twitterId: id,
                                twitterUserName: username,
                                status: accountStatus,
                                signUpOrigin: TWITTER
                            },
                        });

                        return res.status(200).json(newUser);
                    } else {
                        return res.status(200).json({ isError: true, message: `Cannot resolve Twitter Handle ${user} to TwitterId` });
                    }

                }
                if (type === Enums.WALLET) {
                    let wallet = utils.getAddress(user)
                    let existingUser = await prisma.whiteList.findUnique({ where: { wallet } })
                    if (existingUser) {
                        return res.status(200).json({ isError: true, message: `${wallet} existed on database.` });
                    }

                    else {
                        const newUser = await prisma.whiteList.create({
                            data: {
                                wallet,
                                status: accountStatus,
                                signUpOrigin: WALLET
                            },
                        });

                        return res.status(200).json(newUser);
                    }
                }

                return res.status(200).json({ isError: true, message: "Unexpected User Type" });
            } catch (error) {
                console.log(error)
                return res.status(200).json({ isError: true, message: error.message });
            }

            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};
export default adminMiddleware(AdminUserAddAPI);
