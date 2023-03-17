import { prisma } from '@context/PrismaContext'
import { ethers, utils } from 'ethers'
import whitelistUserMiddleware from 'middlewares/whitelistUserMiddleware'
const RiftlyNFTAddress = '0x4511080B941cDcbAD6e6Ab052D6E26A7Eb30e2f4'
const RiftlyRedeemAddress = '0x5cb551e13DFB2c3B94BFAd0b141B35940Df634a1'
const TreasuryAddress = '0x9128C112f6BB0B2D888607AE6d36168930a37087'

const riftlyRedeemInteract = async (req, res) => {
  const { method } = req

  switch (method) {
    case 'POST':
      try {
        const { OPERATION_WALLET_PRIVATE_KEY, NEXT_PUBLIC_INFURA_ID, INFURA_SECRET } = process.env

        const whiteListUser = req.whiteListUser
        console.log(whiteListUser)
        const { wallet, userId } = whiteListUser

        const userReward = await prisma.Reward.findMany({
          where: { userId },
          select: {
            rewardTypeId: true,
            rewardType: true,
            quantity: true,
          },
        })

        const pointReward = userReward.find((r) => r.rewardType.reward === 'Points')

        console.log(pointReward)
        if (!pointReward.quantity || pointReward?.quantity < 10000) {
          return res.status(200).json({ message: 'Not enough point to redeem', isError: true })
        }
        if (wallet.length < 16 || !utils.getAddress(wallet)) {
          return res
            .status(200)
            .json({ message: 'Wallet not linked or invalid wallet address', isError: true })
        }

        const infuraProvider = new ethers.providers.InfuraProvider('goerli', {
          projectId: NEXT_PUBLIC_INFURA_ID,
          projectSecret: INFURA_SECRET,
        })

        const signerWallet = new ethers.Wallet(`0x${OPERATION_WALLET_PRIVATE_KEY}`, infuraProvider)

        // const signer = signerWallet.connect(infuraProvider);

        let riftlyNFTJson = require('./riftly-nft.json')

        const riftlyNFTContract = new ethers.Contract(
          utils.getAddress(RiftlyNFTAddress),
          riftlyNFTJson.abi,
          signerWallet,
        )

        const tokens = await riftlyNFTContract.tokensOfOwner(TreasuryAddress)
        // tx.wait().catch(async () => {
        //   console.error(`Transaction failed`);
        // });

        if (tokens.length > 0) {
          let tokenId = tokens[0].toString()
          let riftlyRedeemJson = require('./riftly-redeem.json')

          const riftlyRedeemContract = new ethers.Contract(
            utils.getAddress(RiftlyRedeemAddress),
            riftlyRedeemJson.abi,
            signerWallet,
          )

          const options = {
            // to: contract.address,
            value: ethers.utils.parseEther('0'),
            gasPrice: ethers.utils.parseUnits('75', 'gwei'),
          }

          // return res.status(200).json({ message: "Ok" });

          const tx = await riftlyRedeemContract.redeem(
            RiftlyNFTAddress,
            utils.getAddress(wallet),
            tokenId,
            options,
          )
          tx.wait().catch(async (err) => {
            console.log(err)
            console.error(`Transaction failed`)
            return res.status(200).json({ isError: true, message: `Transaction failed` })
          })

          console.log(tx)

          let transactionHash = tx.hash
          return res.status(200).json({ message: 'Ok', transactionHash })
        }

        return res.status(200).json({ isError: true, message: 'No more token to redeem' })
      } catch (err) {
        console.log(err)
        res.status(200).json({ isError: true, message: err.message })
      }
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default whitelistUserMiddleware(riftlyRedeemInteract)
