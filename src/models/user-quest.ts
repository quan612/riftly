/**
 * @swagger
 * components:
 *  schemas:
 *    UserQuest:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        questId:
 *          type: string
 *        extendedUserQuestData:
 *          type: object
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 *        rewardedQty:
 *          type: number
 *        rewardedTypeId:
 *          type: number
 *        rewardType:
 *          $ref: '#/components/schemas/RewardType'
 *        isHidden:
 *          type: boolean
 *        hasClaimed:
 *          type: boolean
 *        isClaimable:
 *          type: boolean
 *        userId:
 *          type: string
 *          format: uuid
 */

import { Quest } from "./quest";
import { RewardType } from "./reward-type";
import { WhiteList } from "./whitelist";

export interface UserQuest {
  id: number,
  questId: string,
  extendedUserQuestData?: any,
  createdAt: Date,
  rewardedQty?: number,
  rewardedTypeId?: number,
  quest?: Quest,
  rewardType?: RewardType,
  updatedAt: Date,
  isHidden: boolean,
  hasClaimed: boolean,
  isClaimable: boolean,
  user?: WhiteList,
  userId: string,
}