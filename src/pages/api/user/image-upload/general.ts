import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'
// let cloudinary = require('cloudinary').v2
import { NextApiResponse } from 'next'
import { WhiteListApiRequest } from 'types/common'


const handler = async (req: WhiteListApiRequest, res: NextApiResponse) => {
  const { method } = req

  switch (method) {
    case 'POST':
      res.status(200).json({ isError: true, message: "disabled" })
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default whitelistUserMiddleware(handler)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb',
    },
  },
}
