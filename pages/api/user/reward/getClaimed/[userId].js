import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import { getClaimedRewardsOfUser } from "repositories/reward";

const getClaimedRewardForUserAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const { userId } = req.query;
                const whiteListUser = req.whiteListUser;

                if (whiteListUser.userId !== userId) {
                    return res.status(200).json({ isError: true, message: "Not allowed to see shell" });
                }

                const rewarded = await getClaimedRewardsOfUser(userId);
                // res.setHeader('Cache-Control', 'max-age=0, s-maxage=2, stale-while-revalidate');
                console.log("getClaimed is hit")
                res.status(200).json(rewarded);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;
        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default whitelistUserMiddleware(getClaimedRewardForUserAPI);
