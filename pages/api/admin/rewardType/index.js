import { getAllRewardTypes } from "repositories/admin";

const ROUTE = "/api/admin/rewardType";

export default async function rewardTypesQuery(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                let types = await getAllRewardTypes();
                res.status(200).json(types);
            } catch (err) {
                console.log(err);
                res.status(500).json({ err });
            }
            break;
        default:
            res.setHeader("Allow", ["GET", "PUT"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
