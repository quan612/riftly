import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'
import { prisma } from '@context/PrismaContext'
const cloudinary = require('cloudinary').v2
import { NextApiResponse } from 'next'
import { WhiteListApiRequest } from 'types/common'

//@TODO: rate limit
const AvatarUploadAPI = async (req: WhiteListApiRequest, res: NextApiResponse) => {
  const { method } = req

  switch (method) {
    case 'POST':
      try {
        const whiteListUser = req.whiteListUser
        const { data } = req.body

        const variables = await prisma.configImageHosting.findFirst()
        const { cloudinaryKey, cloudinaryName, cloudinarySecret, avatarPreset } = variables
        if (!cloudinaryKey || !cloudinaryName || !cloudinarySecret) {
          throw new Error('Missing upload configurations')
        }

        cloudinary.config({
          cloud_name: cloudinaryName,
          api_key: cloudinaryKey,
          api_secret: cloudinarySecret,
        })

        const uploaded = await cloudinary.uploader.upload(data, {
          public_id: whiteListUser.userId,
          upload_preset: avatarPreset,
        })

        if (uploaded.secure_url) {
          await prisma.whiteList.update({
            where: {
              userId: whiteListUser.userId,
            },
            data: {
              avatar: uploaded.secure_url,
            },
          })
          return res.status(200).json({ message: 'Upload avatar successfully' })
        }
        res
          .status(200)
          .json({ isError: true, message: 'Cannot upload avatar. Please contact administrator.' })
      } catch (err) {
        console.log(err)
        res.status(200).json({ isError: true, message: err.message })
      }
      break

    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
export default whitelistUserMiddleware(AvatarUploadAPI)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}
