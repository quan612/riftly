import { prisma } from "@context/PrismaContext";
import { utils } from "ethers";

export default async function adminAPI(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const { address } = req.query;

                if (!address) {
                    return res.status(200).json({ isError: true });
                }

                let wallet = utils.getAddress(address);

                const admin = await prisma.Admin.findUnique({
                    where: {
                        wallet,
                    },
                    select: {
                        nonce: true,
                    },
                });

                res.status(200).json(admin);
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
