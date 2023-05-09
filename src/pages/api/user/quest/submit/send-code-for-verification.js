import { prisma } from '@context/PrismaContext'
import Enums from 'enums'
import { AccountStatus, VerificationStatus } from '@prisma/client'
import { utils } from 'ethers'

const disabled = true

const sendCodeToTwilioVerifyHandler = async (req, res) => {
  const { method } = req
  const { account, type, code } = req.body
  let userQuest

  if (disabled) {
    return res.status(200).json({
      isError: true,
      message: 'Disabled!',
    })
  }
  switch (method) {
    case 'POST':

      try {
        if (!code) {
          return res.status(200).json({
            isError: true,
            message: 'Missing code!',
          })
        }
        // check if there is code sent attempt before

        const variables = await prisma.questVariables.findFirst()
        const { smsSid, smsAuthToken, smsServiceId } = variables

        if (!smsSid || !smsAuthToken || !smsServiceId) {
          return res.status(200).json({ isError: true, message: 'Missing SMS configuration' })
        }

        let userQuery
        switch (type) {
          case Enums.WALLET:
            userQuery = await prisma.whiteList.findUnique({
              where: {
                wallet: utils.getAddress(account),
              },
            })
            break
          case Enums.DISCORD:
            userQuery = await prisma.whiteList.findFirst({
              where: {
                discordId: account,
              },
            })
            break
          case Enums.TWITTER:
            userQuery = await prisma.whiteList.findFirst({
              where: {
                twitterId: account,
              },
            })
            break
          case Enums.EMAIL:
            userQuery = await prisma.whiteList.findUnique({
              where: {
                email: account,
              },
            })
            break
          default:
            throw new Error('Unknown account type')
        }

        if (!userQuery) {
          throw new Error(`Unknown user ${account}`)
        }
        const { userId } = userQuery
        let smsRecord = await prisma.smsVerification.findUnique({
          where: { userId },
        })

        if (!smsRecord) {
          return res.status(200).json({
            isError: true,
            message: 'Missing phone attempt verification.',
          })
        }

        if (smsRecord && smsRecord.valid) {
          return res.status(200).json({
            isError: true,
            message: 'Already approved.',
          })
        }

        let phoneNumberSent = smsRecord.attemptedPhone

        const client = require('twilio')(smsSid, smsAuthToken)

        let verificationOp = await client.verify.v2
          .services(smsServiceId)
          .verificationChecks.create({
            to: phoneNumberSent,
            code,
          })

        if (verificationOp && verificationOp.status === 'approved' && verificationOp.valid) {
          let whitelistUpdate = await prisma.whiteList.update({
            where: { userId },
            data: {
              status: AccountStatus.ACTIVE,
              smsVerification: {
                update: {
                  status: VerificationStatus.APPROVED,
                  valid: verificationOp.valid,
                },
              },
            },
          })

          return res.status(200).json({ message: `Verification success. Account is active` })
        }

        return res.status(200).json({ isError: true, message: `Wrong code submitted.` })
      } catch (error) {
        console.log('** Error at send-code-for-verification **')

        if (error.message.indexOf('VerificationCheck was not found') !== -1) {
          return res.status(200).json({ isError: true, message: 'Code expired' })
        }

        res.status(200).json({ isError: true, message: error.message })
      }
      break;
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default sendCodeToTwilioVerifyHandler

/*
   let currentQuest = await prisma.quest.findUnique({
       where: {
           questId,
       },
       include: {
           type: true,
       },
   }
   const { type } = currentQues
   if (type.name !== Enums.SMS_VERIFICATION) {
       return res.status(200).json({
           isError: true,
           message: "This route is for sms verifcation!",
       });
   }

   let userQuest = prisma.userQuest.create({
       data: {
           userId,
           questId,
           isClaimable: true,
       },
   
   await prisma.$transaction([whitelistUpdate, userQuest]);
*/
