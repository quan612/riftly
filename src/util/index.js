import Enums from 'enums'
import axios from 'axios'

export const shortenAddress = (address) =>
  `${address.slice(0, 5)}...${address.slice(address.length - 4)}`

export const debounce = (func, wait) => {
  let timeout
  return function () {
    const args = arguments
    const later = function () {
      timeout = null
      func.apply(this, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
}

export const remove_duplicates_es6 = (arr) => {
  let s = new Set(arr)
  let it = s.values()
  return Array.from(it)
}

export const checkPasswordStrength = (password) => {
  // Define a regular expression to match at least one lowercase letter, one uppercase letter, and one number
  var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  // Test the password against the regular expression
  if (regex.test(password)) {
    return true;
  } else {
    return false; //"Weak password. Please include at least one lowercase letter, one uppercase letter, one number, and have a minimum length of 8 characters.";
  }
}

export const getUserName = (session) => {

  switch (session?.provider) {
    case 'unstoppable-authenticate':
      return session?.user?.uathUser
    case 'discord':
      return session?.profile?.username + '#' + session?.profile?.discriminator
    case 'twitter':
      return session?.profile?.data?.username
    case 'email':
      return session?.user?.email
    default:
      if (session?.user?.wallet.length > 16) return shortenAddress(session?.user?.wallet)
      return ''
  }
}

// these are configs that can be queried on client side
export const getDiscordAuthLink = async () => {
  const discordIdConfig = await axios
    .get(`${Enums.BASEPATH}/api/user/configs?type=discordId`)
    .then((r) => r.data)

  if (!discordIdConfig) {
    throw new Error('Cannot find Discord Id from Config.')
  }
  const hostname = getHostName()
  return `https://discord.com/api/oauth2/authorize?client_id=${discordIdConfig}&redirect_uri=${hostname}/api/auth/discord/redirect&response_type=code&scope=identify`
}

export const getTwitterAuthLink = async () => {
  const twitterIdConfig = await axios
    .get(`${Enums.BASEPATH}/api/user/configs?type=twitterId`)
    .then((r) => r.data)

  if (!twitterIdConfig) {
    throw new Error('Cannot find Twitter Id from Config.')
  }
  const hostname = getHostName()
  return `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${twitterIdConfig}&redirect_uri=${hostname}/api/auth/twitter/redirect&scope=tweet.read%20users.read&state=state&code_challenge=challenge&code_challenge_method=plain`
}

const getHostName = () => {
  let hostname
  if (process.env.NODE_ENV !== 'development') {
    hostname = 'https://' + window.location.hostname
  } else {
    hostname = 'http://' + window.location.host
  }
  return hostname
}

export function sleep(ms = 500) {
  return new Promise((res) => setTimeout(res, ms))
}

export const getTomorrow = () => new Date(new Date().setDate(new Date().getDate() + 1))
export const getFirstDayCurMonth = () =>
  new Date(new Date().getFullYear(), new Date().getMonth(), 1)
export const getLastDayCurMonth = () =>
  new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
export const getFirstDayPrevMonth = () =>
  new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
export const getLastDayPrevMonth = () =>
  new Date(new Date().getFullYear(), new Date().getMonth(), 0)
export const getFirstDayOfYear = () => new Date(new Date().getFullYear(), 0, 1)

export const getFirstDayOfLastYear = () => new Date(new Date().getFullYear() - 1, 0, 1)
export const getLastDayOfLastYear = () => new Date(new Date().getFullYear() - 1, 11, 31)
