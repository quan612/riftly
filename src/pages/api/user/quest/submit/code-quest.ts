import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'
import Enums from 'enums'
import userQuestSubmitMiddleware from '@middlewares/userQuestSubmitMiddleware'
import {
  getUserQuest,
  trackCorrectCodeQuestSubmit,
  trackWrongCodeQuestSubmit,
} from 'repositories/user-quest'
import moment from 'moment'

import { NextApiResponse } from 'next'
import { WhiteListApiRequest } from 'types/common'
import { UserQuest } from 'models/user-quest'

const submitCodeQuest = async (req: WhiteListApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.json({ isError: true, message: 'Only POST' })
  }
  const { userId } = req.whiteListUser
  const { questId, inputCode } = req.body

  const currentQuest = req.currentQuest // got from userQuestSubmitMiddleware
  let userQuest

  try {
    if (!inputCode) {
      return res.status(200).json({
        isError: true,
        message: 'Missing input!',
      })
    }

    const { type, extendedQuestData } = currentQuest

    if (type.name !== Enums.CODE_QUEST) {
      return res.status(200).json({
        isError: true,
        message: 'This route is for code quest!',
      })
    }

    let foundOtherAnswersCorrect = -1

    if (extendedQuestData?.otherAnswers) {
      const { otherAnswers } = extendedQuestData
      const answersArray = otherAnswers.split(',')

      foundOtherAnswersCorrect = answersArray.findIndex((element) => {
        return (
          element.trimStart().trimEnd().toLowerCase() ===
          inputCode.trimStart().trimEnd().toLowerCase()
        )
      })
    }

    const userEntry: UserQuest = await getUserQuest(userId, questId)

    let extendedUserQuestData: any = {}

    if (userEntry) {
      extendedUserQuestData = {
        ...userEntry.extendedUserQuestData,
        count: userEntry.extendedUserQuestData.count + 1,
      }
    } else {
      extendedUserQuestData.count = 1
    }

    extendedUserQuestData.lastSubmitted = moment.utc(new Date().toISOString())

    // either matching secret code, or similar answers
    if (
      inputCode.toLowerCase() === extendedQuestData.secretCode.toLowerCase() ||
      foundOtherAnswersCorrect !== -1
    ) {
      userQuest = await trackCorrectCodeQuestSubmit(userId, questId, extendedUserQuestData)
      return res.status(200).json(userQuest)
    } else {
      userQuest = await trackWrongCodeQuestSubmit(userId, questId, extendedUserQuestData)
      return res.status(200).json({ isError: true, message: 'Wrong code submitted' })
    }
  } catch (error) {
    console.log(error)
    res.status(200).json({ isError: true, message: error.message, questId })
  }
}

export default whitelistUserMiddleware(userQuestSubmitMiddleware(submitCodeQuest))
