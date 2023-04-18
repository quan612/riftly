/**
 * @swagger
 * components:
 *  schemas:
 *    RewardType:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        reward:
 *          type: string
 *        rewardPreview:
 *          type: string
 *        rewardIcon:
 *          type: string
 *        isEnabled:
 *          type: boolean
 */
export interface RewardType {
  id: number,
  reward: string,
  rewardPreview?: string,
  rewardIcon?: string,
  isEnabled: boolean,
}