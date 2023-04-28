import { prisma } from 'context/PrismaContext'
import { NextApiRequest, NextApiResponse } from 'next'

// should only return Id, not secret so we need to early exit in case someone tries to query one.
const UserConfigsQueryAPI = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req

  if (method !== 'GET') {
    return res.status(200).json({ isError: true })
  }

  try {
    const { type } = req.query

    if (type !== 'discordId' && type !== 'twitterId') {
      return res.status(200).json({ isError: true, message: 'Only for querying Social Type Id' })
    }
    const configs = await prisma.questVariables.findFirst()
    const configType = configs[type]

    return res.status(200).json(configType)
  } catch (err) {
    console.log(err)
    res.status(200).json({ isError: true, message: err.message })
  }
}
export default UserConfigsQueryAPI
