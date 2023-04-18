import { prisma } from '@context/PrismaContext'
import alchemyWebhookMiddleware from '@middlewares/alchemyWebhookMiddleware'
import { Prisma, RedeemStatus } from '@prisma/client'
import { ethers, utils } from 'ethers'
import { getShopItemByContractAddress } from 'repositories/shop'

const handler = async (req, res) => {
  const { method } = req

  if (method !== 'POST') {
    return res.status(200).json({
      isError: true,
      message: `Post only`,
    })
  }


  try {

    const webhookEvent = req.body; // data parsed from middleware
    console.log("webhookEvent", webhookEvent)
    if (webhookEvent.event.data.block.logs.length > 0) {
      console.log(webhookEvent.event.data.block.logs)
      const transactionHash = webhookEvent.event.data.block.logs[0]?.transaction?.hash;

      let abi = [
        "event Redeemed(address tokenContract, address receiver, uint256 slotId)"
      ];
      let iface = new ethers.utils.Interface(abi)

      const redeemLogEvent = webhookEvent.event.data.block.logs[0]?.transaction?.logs[webhookEvent.event.data.block.logs[0]?.transaction?.logs.length - 1]

      let eventDataReceived = iface.parseLog(redeemLogEvent);

      const contract = eventDataReceived.args[0]
      const receiver = eventDataReceived.args[1]
      const slotId = eventDataReceived.args[2]?.toString();


      console.log("slotId", slotId)
      /* find shop item base on contract*/
      const shopItem = await getShopItemByContractAddress(contract)

      const user = await prisma.whiteList.findUnique({
        where: {
          wallet: utils.getAddress(receiver)
        }
      })

      /* find shop item redeemed by this user and its slot id*/
      const shopItemRedeem = await prisma.shopItemRedeem.findFirst({
        where: {
          redeemedBy: {
            userId: user.userId
          },
          id: parseInt(slotId),
          shopItemId: shopItem.id,
          status: RedeemStatus.PENDING
        }
      })

      // save to error table when cannot find redeem item, (!shopItemRedeem) 

      await prisma.shopItemRedeem.update({
        where: {
          id: shopItemRedeem.id
        },
        data: {
          status: RedeemStatus.REDEEMED
        }
      })
    }

    return res.status(200).json({ message: "ok" })

  } catch (error) {
    // console.log(error)
    return res.status(200).json({
      isError: true,
      message: error.message,
    })
  }
}
export default handler
// export default alchemyWebhookMiddleware(handler)


/*alternative to decode

  // const data = webhookEvent.event.data.block.logs[0]?.transaction?.logs[1].data;
  // const decodeData = ethers.utils.defaultAbiCoder.decode(
  //   ['address', 'address'],
  //   data
  // );
  // console.log("decodeData", decodeData);
*/

// export const config = {
//   api: {
//     bodyParser: true,
//   },
// };