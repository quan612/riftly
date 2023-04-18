import * as crypto from "crypto";

const alchemyWebhookMiddleware = (handler) => {
  return async (req, res) => {
    try {
      const verify = await isValidSignature(req);
      if (!verify) {
        console.log("Unauthorised Alchemy")
        return res.status(200).json({ isError: true, message: "Unauthorised" })
      }
      console.log("Alchemy authorised")
      return handler(req, res)
    } catch (error) {
      console.log(error)
      return res.status(200).json({ isError: true, message: `webhook error: ${error.message}` })
    }

  }
}

export default alchemyWebhookMiddleware


async function isValidSignature(request) {
  try {
    const token = process.env.ALCHEMY_REDEEM_SIGNING_KEY;
    const headers = request.headers;
    const signature = headers['x-alchemy-signature']; // Lowercase for NodeJS

    const body = request.body;

    const digest = crypto.createHmac('sha256', token.toString()).update(JSON.stringify(body), 'utf8').digest('hex') // Create a HMAC SHA256 hash using the auth token


    console.log("digest", digest)
    console.log("signature", signature)

    return (signature === digest); // If signature equals your computed hash, return true
  } catch (error) {
    console.log(error)
    return false;
  }

}
