import { prisma } from "@context/PrismaContext";
import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import Enums from "enums";

const sendCodeToTwilioVerifyHandler = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            const { userId } = req.whiteListUser;
            const { questId, code } = req.body;
            let userQuest;
            try {

                if (!code) {
                    return res.status(200).json({
                        isError: true,
                        message: "Missing code!",
                    });
                }
                // check if there is code sent attempt before

                let smsRecord = await prisma.smsVerification.findUnique({
                    where: { userId }
                })

                if (!smsRecord) {
                    return res.status(200).json({
                        isError: true,
                        message: "Missing phone attempt.",
                    });
                }

                if (smsRecord && smsRecord.valid) {
                    return res.status(200).json({
                        isError: true,
                        message: "Already approved.",
                    });
                }

                let currentQuest = await prisma.quest.findUnique({
                    where: {
                        questId,
                    },
                    include: {
                        type: true,
                    },
                });

                const { type } = currentQuest;

                if (type.name !== Enums.SMS_VERIFICATION) {
                    return res.status(200).json({
                        isError: true,
                        message: "This route is for sms verifcation!",
                    });
                }

                let phoneNumberSent = smsRecord.attemptedPhone;

                //check code from previous sid
                const accountSid = process.env.TWILIO_ACCOUNT_SID;
                const authToken = process.env.TWILIO_AUTH_TOKEN;
                const client = require('twilio')(accountSid, authToken);

                let verificationOp = await client.verify.v2.services(process.env.TWILIO_SERVICE_ID)
                    .verificationChecks
                    .create({
                        to: phoneNumberSent, code,
                        // sid: 'VEd0c2ab5aac09a7a7e7e063e1a71b7801'
                    })

                if (verificationOp && verificationOp.status === 'approved' && verificationOp.valid) {

                    let whitelistUpdate = prisma.whiteList.update({
                        where: { userId },
                        data: {
                            smsVerification: {
                                update: {
                                    status: verificationOp.status,
                                    valid: verificationOp.valid
                                }
                            }
                        }
                    })

                    let userQuest = prisma.userQuest.create({
                        data: {
                            userId,
                            questId,
                            isClaimable: true
                        },
                    });

                    await prisma.$transaction([whitelistUpdate, userQuest]);
                    return res.status(200).json({ message: `ok` })
                }

                return res.status(200).json({ isError: true, message: `Wrong code submitted.` })

            } catch (error) {
                console.log("** Error at send-code-for-verification **")

                if (error.message.indexOf("VerificationCheck was not found")) {
                    return res.status(200).json({ isError: true, message: "Code expired", questId });
                }
                console.log(error);
                return res.status(200).json({ isError: true, message: error.message, questId });
            }
            break;
        default:
            res.setHeader("Allow", ["PUT"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default whitelistUserMiddleware(sendCodeToTwilioVerifyHandler);
