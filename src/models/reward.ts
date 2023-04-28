/**
 * @swagger
 * components:
 *  schemas:
 *    Reward:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        rewardTypeId:
 *          type: number
 *        quantity:
 *          type: number
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 *        rewardType:
 *          $ref: '#/components/schemas/RewardType'
 *        userId:
 *          type: string
 *          format: uuid
 */

import { RewardType } from "./reward-type";

export interface Reward {
  id: number,
  rewardTypeId: number,
  quantity: number,
  createdAt: Date,
  updatedAt: Date,
  rewardType?: RewardType,
  userId?: string,
}