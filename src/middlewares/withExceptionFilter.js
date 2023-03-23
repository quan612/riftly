import { prisma } from '@context/PrismaContext'
import { ApiError } from 'next/dist/server/api-utils'

const withExceptionFilter = (handler) => {
  return async (req, res) => {
    try {
      await handler(req, res)
    } catch (exception) {
      const { url, headers } = req
      const statusCode = getExceptionStatus(exception)
      const message = getExceptionMessage(exception)
      const stack = getExceptionStack(exception)

      const referer = headers['referer']
      const userAgent = headers['user-agent']

      await logError(url, referer, userAgent, exception.message)
      const timestamp = new Date().toISOString()

      const responseBody = {
        isError: true,
        statusCode,
        timestamp,
        path: req.url,
        message
      }

      return res.status(statusCode).json(responseBody)
    }
  }
}

export default withExceptionFilter

function getExceptionStatus(exception) {
  return exception instanceof ApiError ? exception.statusCode : 500
}

function getExceptionMessage(exception) {
  return isError(exception) ? exception.message : `Internal Server Error`
}

function getExceptionStack(exception) {
  return isError(exception) ? exception.stack : undefined
}

function isError(exception) {
  return exception instanceof Error
}

const logError = async (url, referer, userAgent, message) => {
  await prisma.logError.create({
    data: {
      url,
      referer,
      userAgent,
      content: {
        message,
      },
    },
  })
}
