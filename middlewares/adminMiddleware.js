import { getSession } from "next-auth/react";

const adminMiddleware = (handler) => {
    return async (req, res) => {

        const session = await getSession({ req });

        if (!session || !session.user?.isAdmin) {
            return res.status(200).json({
                message: "Non-admin authenticated",
                isError: true,
            });
        }
        return handler(req, res);
    };
};
export default adminMiddleware;
