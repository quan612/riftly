import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import Enums from "enums";
let cloudinary = require("cloudinary").v2;

const {
    NEXT_PUBLIC_CLOUDINARY_CLOUDNAME,
    NEXT_PUBLIC_CLOUDINARY_API_KEY,
    NEXT_PUBLIC_CLOUDINARY_API_SECRET,
    NEXT_PUBLIC_CLOUDINARY_PRESET,
} = process.env;

cloudinary.config({
    cloud_name: NEXT_PUBLIC_CLOUDINARY_CLOUDNAME,
    api_key: NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

const ImageUploadAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            try {

                if (process.env.NEXT_PUBLIC_ENABLE_CHALLENGER === "false") {
                    return res.status(200).json({ isError: true, message: "Challenger is not enabled." });
                }
                console.log(`** Uploading image to cloudinary **`);
                const whiteListUser = req.whiteListUser;
                const { data } = req.body;

                let uploaded = await cloudinary.uploader.upload(data, {
                    public_id: whiteListUser.userId,
                    upload_preset: NEXT_PUBLIC_CLOUDINARY_PRESET
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
