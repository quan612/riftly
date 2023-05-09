/**
 * @swagger
 * components:
 *  schemas:
 *    WhiteList:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        wallet:
 *          type: string
 *        twitterId:
 *          type: string
 *        twitterUserName:
 *          type: string
 *        discordId:
 *          type: string
 *        discordUserDiscriminator:
 *          type: string
 *        userId:
 *          type: string
 *          format: uuid
 *        email:
 *          type: string
 *        signUpOrigin:
 *          type: string
 *        createdAt:
 *          type: string
 *          format: date-time
 */


import { AccountStatus } from "@prisma/client"; // need to use enums from prisma
import { Reward } from "./reward";
import { UserQuest } from "./user-quest";

export interface WhiteList {
  id: number,
  wallet?: string,
  twitterId?: string,
  twitterUserName?: string,
  userId: string,
  discordId?: string,
  discordUserDiscriminator?: string,
  createdAt: Date,
  updatedAt: Date,
  rewards?: Reward[],
  userQuest?: UserQuest[],
  nonce?: string,
  uathUser?: string,
  email?: string,
  password?: string,
  avatar?: string,
  status?: AccountStatus,
  signUpOrigin?: string,

}