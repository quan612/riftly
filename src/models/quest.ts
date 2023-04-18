import { RewardType } from "./reward-type";
import { UserQuest } from "./user-quest";

/**
 * @swagger
 * components:
 *  schemas:
 *    Quest:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        text:
 *          type: string
 *        completedText:
 *          type: string
 *        rewardTypeId:
 *          type: number
 *        quantity:
 *          type: number
 *        isEnabled:
 *          type: boolean
 *        isRequired:
 *          type: boolean
 *        isDeleted:
 *          type: boolean
 *        description:
 *          type: string
 *        extendedQuestData:
 *          type: object
 *        questId:
 *          type: string
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time 
 *        rewardType:
 *          $ref: '#/components/schemas/RewardType'
 *        userQuests:
 *          $ref: '#/components/schemas/UserQuest'
 *        questTypeId:
 *          type: number
 *        image:
 *          type: string
 * */
export interface Quest {
  id: number,
  // type: QuestType,
  text: string,
  completedText: string,
  rewardTypeId: number,
  quantity: number,
  isEnabled: boolean,
  isRequired: boolean,
  isDeleted: boolean,
  description?: string,
  extendedQuestData?: any,
  questId: string,
  createdAt: Date,
  updatedAt: Date,
  rewardType: RewardType,
  userQuests: UserQuest[],
  questTypeId: number,
  // style: QuestStyle,
  // duration: QuestDuration,
  image?: string,
}