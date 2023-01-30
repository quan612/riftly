import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { isWhiteListUser } from "repositories/session-auth";

const whitelistUserMiddleware = (handler) => {
    return async (req, res) => {

        const session = await unstable_getServerSession(req, res, authOptions)
        console.log(session)
        if (!session) {
            return res.status(200).json({
                message: "Missing session auth",
                isError: true,
            });
        }
        let whiteListUser = await isWhiteListUser(session);
        if (!whiteListUser) {
            return res.status(200).json({
                message: "Not authenticated for user route",
                isError: true,
            });
        }

        if (process.env.NEXT_PUBLIC_ENABLE_CHALLENGER === "false") {
            return res
                .status(200)
                .json({ isError: true, message: "Challenger is not enabled." });
        }

        req.whiteListUser = whiteListUser;
        return handler(req, res);
    };
};

export default whitelistUserMiddleware;
