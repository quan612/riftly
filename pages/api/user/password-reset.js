import { utils } from "ethers";
import { prisma } from "@context/PrismaContext";
import Enums from "@enums/index";

import { validateEmail } from "util/index";
const bcrypt = require("bcrypt")

export default async function passwordReset(req, res) {
    const { method } = req;

    switch (method) {
        case "POST":
            try {

                const { email, password } = req.body;

                const existingUser = await prisma.whiteList.findUnique({
                    where: {
                        email
                    }
                })

                if (!existingUser) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "Non existent user." });
                }

                if (password.trim().length === 0) {
                    throw new Error("Blank password.");
                }

                const hash = await bcrypt.hash(password, 10);

                await prisma.whiteList.update({
                    where: {
                        email
                    },
                    data: {
                        password: hash
                    },
                });

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