import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";

const handler = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                res.status(200).json(req.whiteListUser);
            } catch (err) {
                console.log(err);
                res.status(500).json({ err });
            }
            break;

        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default whitelistUserMiddleware(handler);
