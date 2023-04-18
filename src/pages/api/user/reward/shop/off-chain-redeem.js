import { prisma } from '@context/PrismaContext'
import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'

import { Prisma, RedeemStatus } from '@prisma/client'
import { sleep } from '@util/index'
import redeemMiddleware from '@middlewares/redeemMiddleware'
import { getShopRequirementCost } from 'repositories/shop'
import { redeemShopRateLimit } from '@middlewares/applyRateLimit'

const handler = async (req, res) => {
  const { method } = req
  console.log("off-chain")
  if (method !== 'POST') {
    return res.status(200).json({
      isError: true,
      message: `Post only`,
    })
  }

  const { userId } = req.whiteListUser
  const { id: shopItemId } = req.body
  const shopItem = req.shopItem

  const { cost, rewardTypeId } = await getShopRequirementCost(shopItem.requirements);
  try {

    // let result;
    await prisma.$transaction(
      async (tx) => {
        await tx.$executeRaw`select * from public."ShopItemRedeem" p where p."status"='AVAILABLE' FOR UPDATE;`;
        await sleep(2000)

        let result = await tx.$executeRaw`UPDATE "ShopItemRedeem" SET "userId"=${userId}, "status"='REDEEMED' where "id" in (select id from public."ShopItemRedeem" p where p."status" = 'AVAILABLE' and p."shopItemId"=${shopItemId} limit 1);`;

        if (result === 0) {
          throw new Error("Redeem Slot is occupied. No more slot available")
        }

        await tx.Reward.update({
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
        // isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 10000,
        timeout: 30000,
      },
    )

    await redeemShopRateLimit(req, res)
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




/**
 *
BEGIN;
select * from public."ShopItemRedeem" p where p."status" = 'AVAILABLE' FOR UPDATE;
select pg_sleep(5);
UPDATE "ShopItemRedeem" SET "userId"='cebed8de-ad3d-4f36-b016-f0b5642a79e8', "status" = 'PENDING'  where "id" in (select id from public."ShopItemRedeem" p where p."status" = 'AVAILABLE' limit 1);
COMMIT;
 *
 *
 */

/* redeem using retry mechanism */
    // const MAX_RETRIES = 10
    // let retries = 0
    // while (retries < MAX_RETRIES) {
    //   try {
    //     await prisma.$transaction(
    //       async (tx) => {
    //         const slotAvailable = await tx.ShopItemRedeem.findFirst({
    //           where: {
    //             shopItemId,
    //             redeemedBy: null,
    //             status: RedeemStatus.AVAILABLE,
    //           },
    //         })

    //         if (!slotAvailable) {
    //           throw new Error(`${shopItem.title} is redeemed all`)
    //         }

    //         await sleep(5000)
    //         const redeemed = await tx.ShopItemRedeem.update({
    //           where: {
    //             id: slotAvailable.id,
    //           },
    //           data: {
    //             userId,
    //             status: RedeemStatus.PENDING,
    //           },
    //         })

    //         const minusReward = await tx.Reward.update({
    //           where: {
    //             userId_rewardTypeId: { userId, rewardTypeId },
    //           },
    //           data: {
    //             quantity: {
    //               decrement: cost,
    //             },
    //           },
    //         })
    //       },
    //       {
    //         isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    //         maxWait: 5000,
    //         timeout: 10000,
    //       },
    //     )
    //   } catch (error) {
    //     if (error.code === 'P2034') {
    //       console.log('deadlock occur')
    //       await sleep(1000)
    //       retries++
    //       continue
    //     }
    //     console.log(error)
    //     throw error
    //   }
    // }

/* this use row lock mechanism */
    // const result = await prisma.$executeRaw`
    //   BEGIN;
    //   select * from public."ShopItemRedeem" p where p."status" = 'AVAILABLE' FOR UPDATE;
    //   select pg_sleep(5);
    //   UPDATE "ShopItemRedeem" SET "userId"='cebed8de-ad3d-4f36-b016-f0b5642a79e8', "status" = 'PENDING'  where "id" in (select id from public."ShopItemRedeem" p where p."status" = 'AVAILABLE' limit 1);
    //   COMMIT;
    // `;