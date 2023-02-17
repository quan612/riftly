import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import Enums from "enums";
import { prisma } from "@context/PrismaContext";

let cloudinary = require("cloudinary").v2;


//@TODO: rate limit
const AvatarUploadAPI = async (req, res) => {
  const { method } = req;

  switch (method) {
    case "POST":
      try {


        const whiteListUser = req.whiteListUser;
        const { data } = req.body;

        //get config

        let variables = await prisma.questVariables.findFirst()
        const { cloudinaryKey, cloudinaryName, cloudinarySecret } = variables;

        if (!cloudinaryKey || !cloudinaryName || !cloudinarySecret) {
          throw new Error("Missing upload configurations")
        }

        cloudinary.config({
          cloud_name: cloudinaryName,
          api_key: cloudinaryKey,
          api_secret: cloudinarySecret,
        });

        let uploaded = await cloudinary.uploader.upload(data, {
          public_id: whiteListUser.userId,
          upload_preset: "Riftly-Avatar-Staging"
        });
        return res.status(200).json(uploaded);
      } catch (err) {
        console.log(err);
        res.status(200).json({ isError: true, message: err.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
export default whitelistUserMiddleware(AvatarUploadAPI);
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};
