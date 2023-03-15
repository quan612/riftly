import { prisma } from '@context/PrismaContext'
import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'
import Enums from 'enums'
import { AccountStatus, VerificationStatus } from '@prisma/client'
import { utils } from 'ethers'

const sendPhoneToSmsHandler = async (req, res) => {
  const { method } = req

  const { account, type, phoneNumber, token } = req.body
  switch (method) {
    case 'POST':

      try {
        //TODO: Apply rate limit or similar
        if (!phoneNumber) {
          return res.status(200).json({
            isError: true,
            message: 'Missing phone number!',
          })
        }

        const variables = await prisma.questVariables.findFirst()
        const { smsSid, smsAuthToken, smsServiceId } = variables

        if (!smsSid || !smsAuthToken || !smsServiceId) {
          return res.status(200).json({ isError: true, message: 'Missing SMS configuration' })
        }

        const client = require('twilio')(smsSid, smsAuthToken)

        // validate phone number, an error is throw into catch below
        const result = await client.lookups.phoneNumbers(phoneNumber).fetch()

        let e164PhoneNumber = result.phoneNumber

        //finding userId based on req
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
          where: {
            attemptedPhone: e164PhoneNumber,
          },
        })

        if (smsRecord && smsRecord.userId !== userId) {
          return res.status(200).json({
            isError: true,
            message: 'Phone number used!',
          })
        }

        if (smsRecord && smsRecord.valid) {
          return res.status(200).json({
            isError: true,
            message: 'Already approved.',
          })
        }

        //send to phone
        let codeSendOp = await client.verify.v2
          .services(smsServiceId)
          .verifications.create({ to: e164PhoneNumber, channel: 'sms' })

        if (codeSendOp.sid && codeSendOp.status === 'pending') {
          await prisma.whiteList.update({
            where: { userId },

            data: {
              smsVerification: {
                upsert: {
                  create: {
                    attemptedPhone: e164PhoneNumber,
                    status: VerificationStatus.PENDING, //codeSendOp.status,
                    valid: false,
                  },
                  update: {
                    attemptedPhone: e164PhoneNumber,
                  },
                },
              },
            },
          })
          return res
            .status(200)
            .json({ message: `Verification code sent to phone number ${phoneNumber}` })
        }

        return res.status(200).json({ isError: true, message: `Cannot send sms through provider.` })
      } catch (error) {
        console.log('** Error at send-phone-for-sms **')

        console.log(error)

        if (
          error.message.indexOf(`The requested resource /PhoneNumbers/${phoneNumber} was not found`)
        ) {
          return res
            .status(200)
            .json({ isError: true, message: 'Phone format is invalid or not found.' })
        }
        res.status(200).json({ isError: true, message: error.message })
      }
      break;
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default sendPhoneToSmsHandler
