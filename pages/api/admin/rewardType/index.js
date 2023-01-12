import { getAllRewardTypes } from "repositories/admin";

export default async function rewardTypesQuery(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                let types = await getAllRewardTypes();
                res.status(200).json(types);
            } catch (err) {
                res.status(200).json({ isError: true, error: err.message });
            }
            break;
        default:
            res.setHeader("Allow", ["GET", "PUT"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
