import { utils } from "ethers";
const webpush = require("web-push");
// should block with internal api key

let subScriptions = [
    //chrome
    {
        endpoint:
            "https://fcm.googleapis.com/fcm/send/fC4JbgiQ5ho:APA91bGCebPaeGjvgQOSvjx4tR5_U1nJc1R7P61C_j_g0ZTog2HvZIVdPq4qAYhgR1w9b-SdIsa6V6dkhAR-j2-oGaxLJFigB6dlE9aXSEj0IP-dwquYuyOAzHZvAJeAdLdySIVEKypx",
        expirationTime: null,
        keys: {
            p256dh: "BCfkg6HLBoOcbOwL0v1cQgrbSo20dwMABz3AFUhQgOixKL1guodF-8QfwaiyfRg6-SlEq8Op4Dd_CpSAydhYSuE",
            auth: "NzahZ_yDsaTOXvshzFO2LA",
        },
    },
    //brave
    {
        endpoint:
            "https://fcm.googleapis.com/fcm/send/dptn3a_0Pok:APA91bETqWW7lrlvu4pDh8kkFc28dIdBpqPX8DegYt-2PK4bqOCLixvGRtwm9Co3ddU2rPwDPXaEzmix3fL2GbhOfi1NF2P58W5vcOTCrUj_XCno3GiDSn1gMTcxeECkLrSP8Gyq5SFL",
        expirationTime: null,
        keys: {
            p256dh: "BF3Dm63ojfc8Org2-mAkeLLv3Ds5OxRs3xujVpaeadX3yGLZd4P38HWTgw8oahOmb_ltq3g9SZkdGHKj0RKEmYs",
            auth: "iptv4lJCrZCkDtPp8-bXeg",
        },
    },
    //firefox
    {
        endpoint:
            "https://updates.push.services.mozilla.com/wpush/v2/gAAAAABj4…mGIBTIij0z9ETT3uOMUuIdrD4uJNUPxIFaBlBc4C2ygqEham6PwraG902zeg",
        expirationTime: null,
        keys: {
            auth: "OfAOFYdHr-c_OpYESiZNWw",
            p256dh: "BKrVVlsiIhQR9eNw6qeq4e7V8ImVJn8EgtV0ldBlC0Z1XNwdcdcrpuSCPEd4cLEIkSlTLKe02fOGOPDqRt0R8QE",
        },
    },
];
export default async function pushNotification(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const vapidKeys = {
                    publicKey:
                        "BHVgKdVS-qTStVoxSfoJXjq7jkih61cy3FGFA4IHqM_vh4xWUbgzJKq2fFrcwdssflAqxaYWzleTFzWiLdbkBz8",
                    privateKey: "-1gR-Fl-Ra9SQLwHcVEecO-JcUOfZ5Hr502y0srGt08",
                };
                webpush.setVapidDetails(
                    "mailto:myuserid@email.com",
                    vapidKeys.publicKey,
                    vapidKeys.privateKey
                );
                // let subscription = {
                //     endpoint:
                //         "https://fcm.googleapis.com/fcm/send/dptn3a_0Pok:APA91bETqWW7lrlvu4pDh8kkFc28dIdBpqPX8DegYt-2PK4bqOCLixvGRtwm9Co3ddU2rPwDPXaEzmix3fL2GbhOfi1NF2P58W5vcOTCrUj_XCno3GiDSn1gMTcxeECkLrSP8Gyq5SFL",
                //     expirationTime: null,
                //     keys: {
                //         auth: "iptv4lJCrZCkDtPp8-bXeg",
                //         p256dh: "BF3Dm63ojfc8Org2-mAkeLLv3Ds5OxRs3xujVpaeadX3yGLZd4P38HWTgw8oahOmb_ltq3g9SZkdGHKj0RKEmYs",
                //     },
                // };

                let t = { "endpoint": "https://updates.push.services.mozilla.com/wpush/v2/gAAAAABj4GEHaVRXJOYchNnpwN72Lmsa3J4JHPBCt3G6VObMsOYuttMQOQfntQ8RGOm--pvW-Z7n0CdoWVc-9Zoh66DRiFIkTiNnDwD4dff_26MbpULQ-deXP_0f6ggke50Tb8K-fRrYm3m7Px6Ism4QT4RNk1A3H8LVOrB2Gt1vcx0UfQFYgI4", "expirationTime": null, "keys": { "auth": "hkXqRcr9PKqfhoQYOEzV7g", "p256dh": "BEIIEq-EY9FmH7KTlz6WSIPMs9ccZd4iBJgZgaR_KDvHSB8-ag8m0VAM_71IGtDoJRCQUyUEInueQeNbQPj1spQ" } }
                webpush.sendNotification(t, "Message test");
                // let pushOp = subScriptions.forEach((s) => {
                //     webpush.sendNotification(s, "Message test");
                // });

                // await Promise.all(pushOp);

                res.status(200).json({ message: "ok" });
            } catch (err) {
                console.log(err);
                res.status(500).json({ isError: true, message: err.message });
            }
            break;
        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
