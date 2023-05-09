import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'

const applyMiddleware = (middleware) => (request, response) =>
  new Promise((resolve, reject) => {
    middleware(request, response, (result) =>
      result instanceof Error ? reject(result) : resolve(result),
    )
  })
const getIP = (request) =>
  request.ip ||
  request.headers['x-forwarded-for'] ||
  request.headers['x-real-ip'] ||
  request.connection.remoteAddress


const fivePerMinute = ({
  limit = 55,
  windowMs = 60 * 1000,
  delayAfter = Math.round(5 / 3),
  delayMs = 2000,
} = {}) => [
    slowDown({ keyGenerator: getIP, windowMs, delayAfter, delayMs }),
    rateLimit({ keyGenerator: getIP, windowMs, max: limit }),
  ]
const fivePerMinuteMiddlewares = fivePerMinute()
export async function fivePerMinuteRateLimit(request, response) {
  await Promise.all(
    fivePerMinuteMiddlewares.map(applyMiddleware).map((middleware) => middleware(request, response)),
  )
}

/* sign up routes */
const signUp = ({
  limit = 5,
  windowMs = 86400000,
  delayAfter = 3,
  delayMs = 2000,
} = {}) => [
    slowDown({ keyGenerator: getIP, windowMs, delayAfter, delayMs }),
    rateLimit({
      keyGenerator: getIP, windowMs, max: limit, handler: (req, res, next) => {
        console.log("signup Limit reached test")
        res.status(429).send("Too many request")
      }
    }),
  ]
const signUpMiddlewares = signUp()
export async function signUpRateLimit(request, response) {
  await Promise.all(
    signUpMiddlewares.map(applyMiddleware).map((middleware) => middleware(request, response)),
  )
}

/* submit quest routes */
const submitQuest = ({
  limit = 15,
  windowMs = 3600000,
  delayAfter = 10,
  delayMs = 2000,
} = {}) => [
    slowDown({ keyGenerator: getIP, windowMs, delayAfter, delayMs }),
    rateLimit({
      keyGenerator: getIP, windowMs, max: limit, handler: () => {
        console.log("Limit reached test")
      }
    }),
  ]
const submitQuestMiddlewares = submitQuest()
export async function submitQuestRateLimit(request, response) {
  await Promise.all(
    submitQuestMiddlewares.map(applyMiddleware).map((middleware) => middleware(request, response)),
  )
}

/* submit quest routes */
const claimQuest = ({
  limit = 15,
  windowMs = 3600000,
  delayAfter = 10,
  delayMs = 2000,
} = {}) => [
    slowDown({ keyGenerator: getIP, windowMs, delayAfter, delayMs }),
    rateLimit({
      keyGenerator: getIP, windowMs, max: limit, handler: () => {
        console.log("Limit reached test")
      }
    }),
  ]
const claimQuestMiddlewares = claimQuest()
export async function claimQuestRateLimit(request, response) {
  await Promise.all(
    claimQuestMiddlewares.map(applyMiddleware).map((middleware) => middleware(request, response)),
  )
}


/* redeem shop item routes */
const redeemShop = ({
  limit = 1,
  windowMs = 20 * 1000,
  delayAfter = 1,
  delayMs = 2000,
} = {}) => [
    slowDown({ keyGenerator: getIP, windowMs, delayAfter, delayMs }),
    rateLimit({ keyGenerator: getIP, windowMs, max: limit }),
  ]
const redeemShopMiddlewares = redeemShop()
export async function redeemShopRateLimit(request, response) {
  await Promise.all(
    redeemShopMiddlewares.map(applyMiddleware).map((middleware) => middleware(request, response)),
  )
}