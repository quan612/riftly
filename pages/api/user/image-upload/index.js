import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import Enums from "enums";
let cloudinary = require("cloudinary").v2;

const {
    CLOUDINARY_CLOUDNAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    CLOUDINARY_PRESET,
} = process.env;



const ImageUploadAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            try {

                console.log(`** Uploading image to cloudinary **`);
                const whiteListUser = req.whiteListUser;
                const { data } = req.body;

                let uploaded = await cloudinary.uploader.upload(data, {
                    public_id: whiteListUser.userId,
                    upload_preset: CLOUDINARY_PRESET
                });
                return res.status(200).json(uploaded);
            } catch (err) {
                console.log(err);
                res.status(500).json({ err });
            }
            break;

        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};
export default whitelistUserMiddleware(ImageUploadAPI);
export const config = {
    api: {
        bodyParser: {
            sizeLimit: "4mb",
        },
    },
};
