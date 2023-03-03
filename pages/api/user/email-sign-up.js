import { utils } from "ethers";
import { prisma } from "@context/PrismaContext";
import Enums, { EMAIL } from "@enums/index";

import { validateEmail } from "util/index";
import { getAccountStatusToAdd } from "repositories/user";
const bcrypt = require("bcrypt")

export default async function emailSignUp(req, res) {
    const { method } = req;

    switch (method) {
        case "POST":
            try {

                const { email, password } = req.body;

                const existingUser = await prisma.whiteList.findFirst({
                    where: {
                        email: { equals: email, mode: "insensitive" },
                    }
                })

                if (existingUser) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "This email is used." });
                }

                // let checkMessage = await checkRequest(req, res)
                // if (checkMessage !== "") {
                //     return res.status(200).json({ isError: true, message: checkMessage });
                // }

                if (!validateEmail(email)) {
                    throw new Error("Invalid email.");
                }
                if (password.trim().length === 0) {
                    throw new Error("Blank password.");
                }

                const hash = await bcrypt.hash(password, 10);
                let accountStatus = await getAccountStatusToAdd();
                await prisma.whiteList.create({
                    data: {
                        email,
                        password: hash,
                        status: accountStatus,
                        signUpOrigin: EMAIL
                    },
                });

                return res.status(200).json({ message: "New account created." });
            } catch (error) {
                // console.log(error)
                return res.status(200).json({ isError: true, message: error.message });
            }
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

const trackRequest = async (req) => {
    const { url, headers } = req;

    const referer = headers['referer'];
    const userAgent = headers['user-agent'];
    const wallet = utils.getAddress(req.body.address);
    const forwarded = req.headers["x-forwarded-for"]
    const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress

    await prisma.logRegister.create({
        data: {
            url,
            referer,
            userAgent,
            wallet,
            ip
        }
    })
}

const blockedUserAgentArr = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
    //"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
]

const blockIPArr = [
    "103.152.220.44"
]

const checkRequest = async (req, res) => {
    console.log(`**Check Request**`);
    const { url, headers } = req;

    const forwarded = req.headers["x-forwarded-for"]
    const userAgent = headers['user-agent'];

    // if (blockedUserAgentArr.includes(userAgent)) {
    //     let message = "User Agent blacklist"
    //     console.log(message)
    //     return message
    // }
    const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress

    if (blockIPArr.includes(ip)) {
        let message = "Ip black list"
        console.log(message)
        return message
    }
    let sameRequest = await prisma.logRegister.findMany({
        where: {
            ip
        }
    })
    if (sameRequest.length > 2) {
        let message = "Found same request from same location"
        console.log(message)
        return message

    }
    return ""

}
