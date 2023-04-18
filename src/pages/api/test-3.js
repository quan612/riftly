import axios from "axios"

export default async function testHandler(req, res) {
  const { method } = req

  switch (method) {
    case 'POST':
      try {

        let smsVerify = await axios
          .post(
            `http://localhost:9007/sendSMSToPhone`,
            {
              userId: '713ebdbe-1694-42ab-a953-6eaada5487fg',
              phoneNumber: '+16479153596',
            },
            // {
            //   headers: {
            //     'Content-Type': 'application/json',
            //   },
            // },
          )
          .then((r) => r.data)
          .catch((err) => console.log(err))

        console.log('smsVerify', smsVerify)
      } catch (err) {
        console.log(err)
        return res.status(429).send('Too many requests')
      }

      res.status(200).json('ok')

      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
