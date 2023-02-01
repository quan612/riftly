import { prisma } from "@context/PrismaContext";
import whitelistUserMiddleware from "@middlewares/whitelistUserMiddleware";
import { utils } from "ethers";
const bcrypt = require("bcrypt")

async function whitelistToken(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {

        let { userId } = req.whiteListUser;
        let user = await prisma.whiteList.findUnique({
          where: { userId }
        })

        if (!user) {
          return res
            .status(200)
            .json({ isError: true, message: "Cannot find user in our record" });
        }

        const CryptoJS = require("crypto-js");
        const newNonce = CryptoJS.lib.WordArray.random(16).toString();
        const hash = await bcrypt.hash(newNonce, 10);

        await prisma.whiteList.update({
          where: { userId },
          data: {
            nonce: hash
          }
        })

        res.status(200).json({ token: newNonce });

      } catch (err) {
        console.log(err);
        res.status(500).json({ isError: true, message: err.message });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}


export default whitelistUserMiddleware(whitelistToken)