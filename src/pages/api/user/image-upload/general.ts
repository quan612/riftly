import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'
// let cloudinary = require('cloudinary').v2
import { NextApiResponse } from 'next'
import { WhiteListApiRequest } from 'types/common'


const handler = async (req: WhiteListApiRequest, res: NextApiResponse) => {
  const { method } = req

  switch (method) {
    case 'POST':
      res.status(200).json({ isError: true, message: "For later" })
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

// const ImageUploadAPI = async (req, res) => {
//   const { method } = req

//   switch (method) {
//     case 'POST':
//       try {
//         return res.status(200).json({ isError: true, message: "For later" })
//         console.log(`** Uploading image to cloudinary **`)
//         const whiteListUser = req.whiteListUser
//         const { data } = req.body

//         let uploaded = await cloudinary.uploader.upload(data, {
//           public_id: whiteListUser.userId,
//           upload_preset: '',
//         })
//         res.status(200).json(uploaded)
//       } catch (err) {
//         console.log(err)
//         res.status(500).json({ err })
//       }
//       break

//     default:
//       res.setHeader('Allow', ['GET'])
//       res.status(405).end(`Method ${method} Not Allowed`)
//   }
// }
export default whitelistUserMiddleware(handler)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb',
    },
  },
}
