import { getAllEnableQuestsForUser, getQuestsDoneByThisUser } from 'repositories/quest'
import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'
import Enums from 'enums'
import { prisma } from 'context/PrismaContext'

const checkQueryHandler = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const { userId } = req.whiteListUser

        // get last created quest
        let lastCreatedQuest = await prisma.quest.findMany({
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        })

        console.log('lastCreatedQuest', lastCreatedQuest)
        //check again last notify for user

        //should notify?
        return res.status(200).json({ message: 'ok', shouldNotify: true })
      } catch (err) {
        res.status(200).json({ isError: true, message: err.message })
      }
      break

    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
export default whitelistUserMiddleware(checkQueryHandler)
