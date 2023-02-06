import { utils } from "ethers";
import { prisma } from "@context/PrismaContext";
import Enums from "@enums/index";


const bcrypt = require("bcrypt")

export default async function webPushSubscriptionHanlder(req, res) {
    const { method } = req;

    switch (method) {
        case "POST":
            try {

                // saving subscriptions to db

                return res.status(200).json({ message: "Password reset." });
            } catch (error) {
                console.log(error)
                return res.status(200).json({ isError: true, message: error.message });
            }
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}