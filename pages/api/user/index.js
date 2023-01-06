import { utils } from "ethers";
import { getWhiteListUserByWallet } from "repositories/user";

export default async function whitelistWalletSignIn(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const { address } = req.query;
                let wallet = utils.getAddress(address);
                let user = await getWhiteListUserByWallet(wallet);

                if (!user) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "Cannot find this user in our record" });
                }

                res.status(200).json(user);
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
