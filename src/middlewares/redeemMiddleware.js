
import { QuestDuration, ItemType, RedeemStatus } from '@prisma/client'
import moment from 'moment'
import { prisma } from '@context/PrismaContext'
import { RequirementType } from 'models/requirement-type'

/** This middle apply to all redeem middleware*/

const redeemMiddleware = (handler) => {
  return async (req, res) => {

    const { id: shopItemId } = req.body
    const { userId } = req.whiteListUser;

    if (!shopItemId) {
      return res.status(200).json({
        isError: true,
        message: 'Missing shop item',
      })
    }

    const shopItem = await prisma.ShopItem.findUnique({
      where: {
        id: shopItemId,
      },
      include: {
        requirements: true,
      },
    })

    /**** check if is paused, available, on pending, if reached max per account ****/

    if (shopItem.isEnabled === false) {
      return res.status(200).json({
        isError: true,
        message: 'Shop paused',
      })
    }
    const redeemSlotAvailable = await prisma.ShopItemRedeem.findFirst({
      where: {
        shopItemId,
        redeemedBy: null,
        status: RedeemStatus.AVAILABLE
        // we count PENDING status as redeemed already, if on PENDING and somehow it is not processed, then we would try to fix the issue later.
      }
    })

    if (!redeemSlotAvailable) { // we dont care the shop item availabe, as that number is used only to create Many ShopItemRedeem records initially from admin
      return res.status(200).json({
        isError: true,
        message: `${shopItem.title} is redeemed all`,
      })
    }

    const redeemedByThisUser = await prisma.ShopItemRedeem.findMany({
      where: {
        shopItemId,
        redeemedBy: {
          userId
        }
        // we count PENDING / REDEEMED status as redeemed, track PENDING for in case something is wrong and need to manual fix
      }
    })
    console.log("slots redeemed By This User", redeemedByThisUser.length);
    if (redeemedByThisUser.length >= shopItem.maxPerAccount) { // we dont care the shop item availabe, as that number is used only to create Many ShopItemRedeem records initially from admin
      return res.status(200).json({
        isError: true,
        message: 'Redeemable amount reached max per account.',
      })
    }


    /**** check requirements. Check Last as this take long****/

    const userReward = await prisma.Reward.findMany({
      where: { userId },
      select: {
        rewardTypeId: true,
        rewardType: true,
        quantity: true,
      },
    })

    const userQuests = await prisma.UserQuest.findMany({
      where: { userId },
      include: {
        quest: true,
      },
    })

    let allowToRedeem = true;

    let notAllowToRedeemMessage = ';'
    for (const requirement of shopItem.requirements) {
      // check if requirement satisfied
      if (requirement.requirementType === RequirementType.REWARD) {
        const rewardCondition = requirement.conditional?.has;
        const rewardRelationIndex = userReward.findIndex(ur => ur.rewardType.id === requirement.relationId);
        if (rewardRelationIndex === -1) {
          allowToRedeem = false;
          notAllowToRedeemMessage = `User does not have reward as requirement`
          break;
        }
        const userRewardQty = userReward[rewardRelationIndex].quantity;
        if (userRewardQty < rewardCondition) {
          allowToRedeem = false;
          notAllowToRedeemMessage = `User reward not enough to redeem`
          break;
        }
      }

      if (requirement.requirementType === RequirementType.QUEST) {

        const questRelationIndex = userQuests.findIndex(uq => uq.quest.id === requirement.relationId);
        if (questRelationIndex === -1) {
          allowToRedeem = false;
          let missingQuest = await prisma.Quest.findFirst({
            where: {
              id: parseInt(requirement.relationId)
            }
          })
          notAllowToRedeemMessage = `User have not finished the quest "${missingQuest.text}"`
          break;
        }
      }
    }

    if (!allowToRedeem) {
      return res.status(200).json({ isError: true, message: notAllowToRedeemMessage })
    }

    req.shopItem = shopItem
    return handler(req, res)
  }
}

export default redeemMiddleware
