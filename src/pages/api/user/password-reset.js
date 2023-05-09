import { utils } from 'ethers'
import { prisma } from '@context/PrismaContext'
import Enums from '@enums/index'

import { checkPasswordStrength, validateEmail } from 'util/index'
import whitelistUserMiddleware from '@middlewares/whitelistUserMiddleware'
const bcrypt = require('bcrypt')

async function passwordReset(req, res) {
  const { method } = req
  const whiteListUser = req.whiteListUser
  switch (method) {
    case 'POST':
      try {
        const { email, password } = req.body


        if (whiteListUser.email !== email) {
          return res.status(200).json({ isError: true, message: 'Wrong action.' })
        }

        if (password.trim().length === 0) {
          throw new Error('Blank password.')
        }

        if (!checkPasswordStrength(password)) {
          throw new Error('Weak password. Please include at least one lowercase letter, one uppercase letter, one number, and have a minimum length of 8 characters.')
        }

        const hash = await bcrypt.hash(password, 10)

        await prisma.whiteList.update({
          where: {
            email,
          },
          data: {
            password: hash,
          },
        })

        return res.status(200).json({ message: 'Password reset.' })
      } catch (error) {
        console.log(error)
        res.status(200).json({ isError: true, message: error.message })
      }
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default whitelistUserMiddleware(passwordReset)
