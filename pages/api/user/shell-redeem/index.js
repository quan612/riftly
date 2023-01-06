import { prisma } from "context/PrismaContext";
import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";

// export const config = {
//     runtime: "experimental-edge",
// };

const shellRedeemQueryAPI = async (req, res) => {
    const { method } = req;

    // if (process.env.NODE_ENV === 'production') {
    //     console.log("In production, throttle the request")
    //     const checkLimit = await ipRateLimit(req)

    //     // If the status is not 200 then it has been rate limited.
    //     if (checkLimit?.status !== 200) {
    //         return res.status(500).json({ error: checkLimit.statusText })
    //     }
    //     await sleep()
    // }

    if (method !== "GET") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }

    try {
        const whiteListUser = req.whiteListUser;
        console.log(`** Get shell redeem for user **`);

        let userShellRedeem = await prisma.shellRedeemed.findUnique({
            where: { userId: whiteListUser.userId },
        });

        if (!userShellRedeem) {
            return res.status(200).json({ message: "Nothing here" });
        }

        // if (process.env.NEXT_PUBLIC_CAN_REDEEM_SHELL === "false") {
        //     return res.status(200).json({ isError: true, message: "shell redeem is not enabled." });
        // }

        // if is Redeemed then return rewards array
        if (userShellRedeem.isRedeemed) {
            userShellRedeem.rewards = userShellRedeem.rewards.splice(
                0,
                userShellRedeem.rewardPointer + 1
            );
            return res.status(200).json(userShellRedeem);
        }
        // not redeemed yet,
        else {
            return res.status(200).json({ isRedeemed: false });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export default whitelistUserMiddleware(shellRedeemQueryAPI);
