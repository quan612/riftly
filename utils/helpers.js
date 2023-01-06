import Enums from "enums";
import axios from "axios";

// these are configs that can be queried on client side
export const getDiscordAuthLink = async () => {

  let discordIdConfig = await axios
    .get(`${Enums.BASEPATH}/api/user/configs?type=discordId`)
    .then((r) => r.data);

  if (!discordIdConfig) {
    throw new Error("Cannot find Discord Id from Config.")
  }
  let currentDomain = process.env.NEXT_PUBLIC_WEBSITE_HOST;
  return `https://discord.com/api/oauth2/authorize?client_id=${discordIdConfig}&redirect_uri=${currentDomain}%2Fchallenger%2Fapi%2Fauth%2Fdiscord%2Fredirect&response_type=code&scope=identify`;
};

export const getTwitterAuthLink = async () => {

  let twitterIdConfig = await axios
    .get(`${Enums.BASEPATH}/api/user/configs?type=twitterId`)
    .then((r) => r.data);

  if (!twitterIdConfig) {
    throw new Error("Cannot find Twitter Id from Config.")
  }
  let currentDomain = process.env.NEXT_PUBLIC_WEBSITE_HOST;
  return `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${twitterIdConfig}&redirect_uri=${currentDomain}/challenger/api/auth/twitter/redirect&scope=tweet.read%20users.read&state=state&code_challenge=challenge&code_challenge_method=plain`;
};