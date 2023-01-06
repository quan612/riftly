import axios from "axios";
import url from "url";
import { getSession } from "next-auth/react";
import { utils } from "ethers";
import Enums from "enums";
import { isWhiteListUser } from "repositories/session-auth";
import { getQuestType, getQuestByTypeId } from "repositories/quest";
import { updateTwitterUserAndAddRewardTransaction } from "repositories/transactions";
import { prisma } from "@context/PrismaContext";

const TOKEN_TWITTER_AUTH_URL = "https://api.twitter.com/2/oauth2/token";
const USERINFO_TWITTER_URL = "https://api.twitter.com/2/users/me";



const ROUTE = "/api/auth/twitter/redirect";
// @dev this is used for twitter auth quest only
export default async function twitterRedirect(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const session = await getSession({ req });

                let whiteListUser = await isWhiteListUser(session);


                const { code } = req.query;
                if (!code) {
                    let error = "Missing auth code. Please contact the administrator.";
                    return res.status(200).redirect(`/challenger/quest-redirect?error=${error}`);
                }

                let allConfigs = await prisma.questVariables.findFirst();
                let twitterId = allConfigs?.twitterId;
                let twitterSecret = allConfigs?.twitterSecret;

                if (!twitterId || !twitterSecret) {
                    let error = "Missing Twitter Client Configuration. Please contact the administrator.";
                    return res.status(200).redirect(`/challenger/quest-redirect?error=${error}`);
                }
                let currentDomain = process.env.NEXT_PUBLIC_WEBSITE_HOST;

                const formData = new url.URLSearchParams({
                    client_id: twitterId,
                    client_secret: twitterSecret,
                    grant_type: "authorization_code",
                    code: code.toString(),
                    redirect_uri: `${currentDomain}/challenger/api/auth/twitter/redirect`,
                    code_verifier: "challenge",
                });

                const response = await axios.post(TOKEN_TWITTER_AUTH_URL, formData.toString(), {
                    headers: {
                        "Content-type": `application/x-www-form-urlencoded`,
                    },
                });

                if (!response || !response?.data?.access_token) {
                    let error =
                        "Couldn't authenticate with Twitter Auth Oath2. Please contact administrator.";
                    return res.status(200).redirect(`/challenger/quest-redirect?error=${error}`);
                }

                const userInfo = await axios.get(USERINFO_TWITTER_URL, {
                    headers: {
                        Authorization: `Bearer ${response.data.access_token}`,
                    },
                });

                if (!userInfo) {
                    let error = "Couldn't retrieve twitter info, pls retry later!";
                    return res.status(200).redirect(`/challenger/quest-redirect?error=${error}`);
                }

                // checked if existed
                let existingTwitterUser = await prisma.whiteList.findFirst({
                    where: {
                        twitterId: userInfo?.data?.data?.id,
                    },
                });
                if (existingTwitterUser) {
                    let error = "Same twitter user authenticated";
                    return res.status(200).redirect(`/challenger/quest-redirect?error=${error}`);
                }

                let twitterAuthQuestType = await getQuestType(Enums.TWITTER_AUTH);
                if (!twitterAuthQuestType) {
                    let error =
                        "Cannot find quest type twitter auth. Pleaes contact administrator.";
                    return res.status(200).redirect(`/challenger/quest-redirect?error=${error}`);
                }

                let twitterQuest = await getQuestByTypeId(twitterAuthQuestType.id);
                if (!twitterQuest) {
                    let error = "Cannot find any quest associated with twitter auth.";
                    return res.status(200).redirect(`/challenger/quest-redirect?error=${error}`);
                }

                const questId = twitterQuest.questId;
                if (whiteListUser) {
                    let twitterQuestOfThisUser = await prisma.userQuest.findFirst({
                        where: {
                            userId: whiteListUser?.userId,
                            questId: questId,
                        },
                    });

                    if (twitterQuestOfThisUser) {
                        let error = "Twitter quest has finished.";
                        return res
                            .status(200)
                            .redirect(`/challenger/quest-redirect?error=${error}`);
                    }
                }

                await updateTwitterUserAndAddRewardTransaction(
                    twitterQuest,
                    whiteListUser,
                    userInfo.data.data
                );

                let twitterSignUp = `Sign Up With Twitter Successfully`;
                res.status(200).redirect(`/challenger/quest-redirect?result=${twitterSignUp}`);

            } catch (err) {
                console.log(err);
                res.status(200).json({ error: err.message });
            }
            break;
        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
