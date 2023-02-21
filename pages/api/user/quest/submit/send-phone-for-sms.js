import { prisma } from "@context/PrismaContext";
import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import Enums from "enums";
import { AccountStatus } from "@prisma/client";
import { utils } from "ethers";

const sendPhoneToSmsHandler = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            // 
            const { account, type, phoneNumber, token } = req.body;
            try {
                //TODO: Apply rate limit or similar
                if (!phoneNumber) {
                    return res.status(200).json({
                        isError: true,
                        message: "Missing phone number!",
                    });
                }

                const accountSid = process.env.TWILIO_ACCOUNT_SID;
                const authToken = process.env.TWILIO_AUTH_TOKEN;
                const client = require("twilio")(accountSid, authToken);

                // validate phone number, an error is throw into catch below
                const result = await client.lookups.phoneNumbers(phoneNumber).fetch();

                let e164PhoneNumber = result.phoneNumber;

                //finding userId based on req
                let userQuery;
                switch (type) {
                    case Enums.WALLET:
                        userQuery = await prisma.whiteList.findUnique({
                            where: {
                                wallet: utils.getAddress(account)
                            }
                        })
                        break;
                    case Enums.DISCORD:
                        userQuery = await prisma.whiteList.findFirst({
                            where: {
                                discordId: account
                            }
                        })
                        break;
                    case Enums.TWITTER:
                        userQuery = await prisma.whiteList.findFirst({
                            where: {
                                twitterId: account
                            }
                        })
                        break;
                    case Enums.EMAIL:
                        userQuery = await prisma.whiteList.findUnique({
                            where: {
                                email: account
                            }
                        })
                        break;
                    default:
                        throw new Error("Unknown account type")
                }

                if (!userQuery) {
                    throw new Error(`Unknown user ${account}`)
                }

                const { userId } = userQuery;

                // let currentQuest = await prisma.quest.findUnique({
                //     where: {
                //         questId,
                //     },
                //     include: {
                //         type: true,
                //     },
                // });

                // const { type } = currentQuest;

                // if (type.name !== Enums.SMS_VERIFICATION) {
                //     return res.status(200).json({
                //         isError: true,
                //         message: "This route is for sms verifcation!",
                //     });
                // }

                let smsRecord = await prisma.smsVerification.findUnique({
                    where: {
                        attemptedPhone: e164PhoneNumber,
                    },
                });

                if (smsRecord && smsRecord.userId !== userId) {
                    return res.status(200).json({
                        isError: true,
                        message: "Phone number used!",
                    });
                }

                if (smsRecord && smsRecord.valid) {
                    return res.status(200).json({
                        isError: true,
                        message: "Already approved.",
                    });
                }

                //send to phone
                let codeSendOp = await client.verify.v2
                    .services(process.env.TWILIO_SERVICE_ID)
                    .verifications.create({ to: e164PhoneNumber, channel: "sms" });

                console.log(codeSendOp);
                if (codeSendOp.sid && codeSendOp.status === "pending") {
                    await prisma.whiteList.update({
                        where: { userId },

                        data: {
                            smsVerification: {
                                upsert: {
                                    create: {
                                        attemptedPhone: e164PhoneNumber,
                                        status: AccountStatus.PENDING, //codeSendOp.status,
                                        valid: false,
                                    },
                                    update: {
                                        attemptedPhone: e164PhoneNumber,
                                    },
                                },
                            },
                        },
                    });
                    return res
                        .status(200)
                        .json({ message: `Verification code sent to phone number ${phoneNumber}` });
                }

                return res
                    .status(200)
                    .json({ isError: true, message: `Cannot send sms through provider.` });
            } catch (error) {
                console.log("** Error at send-phone-for-sms **");

                console.log(error);

                if (
                    error.message.indexOf(
                        `The requested resource /PhoneNumbers/${phoneNumber} was not found`
                    )
                ) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "Phone format is invalid or not found." });
                }
                return res.status(200).json({ isError: true, message: error.message });
            }
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default sendPhoneToSmsHandler;
