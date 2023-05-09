import { prisma } from '@context/PrismaContext'
import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'

import { sleep } from '@util/index'
import redeemMiddleware from '@middlewares/redeemMiddleware'
import { getShopRequirementCost } from 'repositories/shop'
import { NextApiResponse } from 'next'
import { WhiteListApiRequest } from 'types/common'
import { IntegrationType } from 'models/Integration-type'
import { WebhookSubscriber } from '@prisma/client'
import axios from 'axios'

const handler = async (req: WhiteListApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(200).json({
      isError: true,
      message: `Post only`,
    })
  }

  const { userId } = req.whiteListUser
  const { id: shopItemId } = req.body
  const shopItem = req.shopItem

  const { cost, rewardTypeId } = await getShopRequirementCost(shopItem.requirements)
  try {
    await prisma.$transaction(
      async (tx: any) => {
        await tx.$executeRaw`select * from public."ShopItemRedeem" p where p."status"='AVAILABLE' FOR UPDATE;`
        await sleep(500)

        const result =
          await tx.$executeRaw`UPDATE "ShopItemRedeem" SET "userId"=${userId}, "status"='REDEEMED' where "id" in (select id from public."ShopItemRedeem" p where p."status" = 'AVAILABLE' and p."shopItemId"=${shopItemId} limit 1);`

        if (result === 0) {
          throw new Error('Redeem Slot is occupied. No more slot available')
        }

        await tx.reward.update({
          where: {
            userId_rewardTypeId: { userId, rewardTypeId },
          },
          data: {
            quantity: {
              decrement: cost,
            },
          },
        })
      },
      {
        maxWait: 10000,
        timeout: 30000,
      },
    )

    const webhookSubscribers = await prisma.webhookSubscriber.findMany({
      where: {
        type: IntegrationType.SHOP_ITEM,
      },
    })

    if (webhookSubscribers) {
      const webhooks: WebhookSubscriber[] = webhookSubscribers.filter(
        (r) => r.eventId === shopItem.id,
      )
      if (webhooks) {
        const currentWebhook = webhooks[0]
        const {url, description, type} = currentWebhook
        const payload = {
          description,
          webhookId: currentWebhook.id,
          type,
          eventName: shopItem.title,
          userId
        }
        
        try {
          await axios.post(url, payload)
        } catch (error) {
          console.log("we should handle this on a queue, with retry mechanism, not here")
        }
        
      }
    }
    return res.status(200).json({
      message: `ok`,
    })
  } catch (error) {
    console.log(error)
    return res.status(200).json({
      isError: true,
      message: error.message,
    })
  }
}
export default whitelistUserMiddleware(redeemMiddleware(handler))
