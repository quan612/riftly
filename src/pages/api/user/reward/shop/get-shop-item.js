import whitelistUserMiddleware from '@middlewares/whitelistUserMiddleware'
import { RedeemStatus } from '@prisma/client'

import { getAllEnabledShopItems, getShopRequirementCost } from 'repositories/shop'

const handler = async (req, res) => {
  const { method } = req
  if (method !== "GET") {
    return res.status(200).json({ isError: true, message: "Only for GET" })
  }

  const whiteListUser = req.whiteListUser
  const { userId } = whiteListUser

  try {

    let shopItems = await getAllEnabledShopItems()

    if (shopItems && shopItems.length > 0) {


      await Promise.all(shopItems.map(async shop => {

        let redeemAvailable = shop?.shopItemRedeem?.filter(i => i.status === RedeemStatus.AVAILABLE)
        let maxPerAccount = shop.maxPerAccount;
        let redeemedFromThisAccount = shop?.shopItemRedeem?.filter(i => i.userId === userId)

        if (redeemAvailable < 1 || maxPerAccount <= redeemedFromThisAccount.length) {
          shop.isRedeemable = false;
        } else {
          shop.isRedeemable = true;
        }

        const { cost } = await getShopRequirementCost(shop.requirements);
        shop.cost = cost;
        shop.redeemAvailable = redeemAvailable.length;
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