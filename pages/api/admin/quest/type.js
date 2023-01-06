import { prisma } from "context/PrismaContext";

const ROUTE = "/api/admin/quest/type";

export default async function questTypesQuery(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                let types = await prisma.questType.findMany();
                res.status(200).json(types);
            } catch (err) {
                console.log(err);
                res.status(500).json({ err });
            }
            break;
        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
