import whitelistUserMiddleware from '@middlewares/whitelistUserMiddleware'
import { RedeemStatus } from '@prisma/client'
import { getAllEnabledShopItems, getShopRequirementCost } from 'repositories/shop'
import { NextApiResponse } from 'next'
import { WhiteListApiRequest } from 'types/common'
import { ShopItem } from 'models/shop-item'

const handler = async (req: WhiteListApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.json({ isError: true, message: 'Only GET' })
  }

  const whiteListUser = req.whiteListUser
  const { userId } = whiteListUser

  try {

    const shopItems: ShopItem[] = await getAllEnabledShopItems()

    if (shopItems && shopItems.length > 0) {


      await Promise.all(shopItems.map(async shop => {

        const redeemSlotAvailable = shop?.shopItemRedeem?.filter(i => i.status === RedeemStatus.AVAILABLE)
        const maxPerAccount = shop.maxPerAccount;
        const redeemedFromThisAccount = shop?.shopItemRedeem?.filter(i => i.userId === userId)

        if (redeemSlotAvailable.length < 1 || maxPerAccount <= redeemedFromThisAccount.length) {
          shop.isRedeemable = false;
        } else {
          shop.isRedeemable = true;
        }

        const { cost } = await getShopRequirementCost(shop.requirements);
        shop.cost = cost;
        shop.redeemAvailable = redeemSlotAvailable.length;
        delete shop.shopItemRedeem;
        delete shop.abi;
        return shop;
      }))
    }

    // return res.status(200).json(shopItems.filter(s => s.isRedeemable === true))
    return res.status(200).json(shopItems)
  } catch (err) {
    console.log(err)
    res.status(200).json({ isError: true, message: err.message })
  }
}

export default whitelistUserMiddleware(handler)