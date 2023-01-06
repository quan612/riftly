import { utils } from "ethers";
import { prisma } from "@context/PrismaContext";
import { updateUserWalletAndAddRewardTransaction } from "repositories/transactions";
import { getSession } from "next-auth/react";
import { isWhiteListUser } from "repositories/session-auth";
import { getQuestByTypeId, getQuestType } from "repositories/quest";
import Enums from "@enums/index";
import { getWhiteListUserByWallet } from "repositories/user";
import { recoverPersonalSignature } from "@metamask/eth-sig-util";
import { bufferToHex } from "ethereumjs-util";

export default async function walletAuthQuest(req, res) {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                if (process.env.NEXT_PUBLIC_ENABLE_CHALLENGER === "false") {
                    return res.status(200).json({ isError: true, message: "challenger is not enabled." });
                }

                const session = await getSession({ req });
                let whiteListUser = await isWhiteListUser(session);

                if (!session || !whiteListUser) {
                    let error = "Attempt to access without authenticated.";
                    return res.status(200).json({ isError: true, message: error });
                }

                console.log(`**Sign up new user**`);
                const { address, signature, secret } = req.body;

                // let checkMessage = await checkRequest(req, res)
                // if (checkMessage !== "") {
                //     return res.status(200).json({ isError: true, message: checkMessage });
                // }

                if (!signature || !address) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "Missing user info for sign up." });
                }

                //recover the address from signature here to ensure only one address can sign up with no replay attack
                const msg = `${Enums.USER_SIGN_MSG}`;
                const msgBufferHex = bufferToHex(Buffer.from(msg, "utf8"));

                const originalAddress = recoverPersonalSignature({
                    data: msgBufferHex,
                    signature: signature.trim(),
                });

                if (originalAddress.toLowerCase() !== address.toLowerCase())
                    return res
                        .status(200)
                        .json({ isError: true, message: "Invalid signature" });


                let wallet = utils.getAddress(address);
                let isValid = utils.isAddress(address);
                if (!wallet || !isValid) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "The wallet address is not valid" });
                }

                let existingUserOfWallet = await getWhiteListUserByWallet(wallet);
                if (existingUserOfWallet && existingUserOfWallet.userId !== whiteListUser.userId) {
                    let error =
                        "Wallet used with another user.";
                    return res.status(200).json({ isError: true, message: error });
                }

                let walletAuthQuestType = await getQuestType(Enums.WALLET_AUTH);
                if (!walletAuthQuestType) {
                    let error =
                        "Cannot find quest type wallet auth. Pleaes contact administrator.";
                    return res.status(200).json({ isError: true, message: error });
                }

                let walletAuthQuest = await getQuestByTypeId(walletAuthQuestType.id);
                if (!walletAuthQuest) {
                    let error = "Cannot find any quest associated with wallet authenticate.";
                    return res.status(200).json({ isError: true, message: error });
                }

                const questId = walletAuthQuest.questId;
                if (whiteListUser) {
                    let walletAuthQuestOfThisUser = await prisma.userQuest.findFirst({
                        where: {
                            userId: whiteListUser?.userId,
                            questId: questId,
                        },
                    });

                    if (walletAuthQuestOfThisUser) {
                        return res
                            .status(200)
                            .json({ isError: true, message: "Quest finished before." });
                    }

                    let correctAddress = utils.getAddress(address)
                    await updateUserWalletAndAddRewardTransaction(walletAuthQuest, whiteListUser, correctAddress)

                    res.status(200).json({ message: "ok" });
                } else {
                    let error = "No Session.";
                    return res.status(200).json({ isError: true, message: error });
                }


            } catch (error) {

                return res.status(200).json({ isError: true, message: error.message });
            }
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

const trackRequest = async (req) => {
    const { url, headers } = req;

    const referer = headers['referer'];
    const userAgent = headers['user-agent'];
    const wallet = utils.getAddress(req.body.address);
    const forwarded = req.headers["x-forwarded-for"]
    const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress

    await prisma.logRegister.create({
        data: {
            url,
            referer,
            userAgent,
            wallet,
            ip
        }
    })
}

const blockedUserAgentArr = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
    //"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
]

const blockIPArr = [
    "103.152.220.44"
]

const checkRequest = async (req, res) => {
    console.log(`**Check Request**`);
    const { url, headers } = req;

    const forwarded = req.headers["x-forwarded-for"]
    const userAgent = headers['user-agent'];

    // if (blockedUserAgentArr.includes(userAgent)) {
    //     let message = "User Agent blacklist"
    //     console.log(message)
    //     return message
    // }
    const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress

    if (blockIPArr.includes(ip)) {
        let message = "Ip black list"
        console.log(message)
        return message
    }
    let sameRequest = await prisma.logRegister.findMany({
        where: {
            ip
        }
    })
    if (sameRequest.length > 2) {
        let message = "Found same request from same location"
        console.log(message)
        return message

    }
    return ""

}
