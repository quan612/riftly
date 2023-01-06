import applyRateLimit from "@middlewares/applyRateLimit";

export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                await applyRateLimit(req, res)
            } catch {
                return res.status(429).send('Too many requests')
            }

            res.status(200).json("ok");

            break;
        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
