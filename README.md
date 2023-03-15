# Description

This is the repo for the Sharing-UI of project Anomura.

Some endpoints which post a message to a discord server, we need a nodejs server to handle discordjs package, currently we cannot have discordjs within this repo due to Vercel only supports Node runtime execution up to v14 at the time of development. Discordjs needs v16.

Vercel Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/qhuynhvhslab/test&env=DATABASE_URL,NEXTAUTH_URL,NEXT_PUBLIC_NEXTAUTH_SECRET,NEXT_PUBLIC_INFURA_ID,envDescription=Postgresql%Db,URL%20For%20Next-Auth,Enter%20Your%20Next-Auth%20Secret%20Key,Infura%20For%20Login,Enable%20Challenger)

```
INSERT INTO public."Admin" (id, wallet, nonce) VALUES (1, 'ENTER YOUR WALLET HERE', '123456789123456789');

INSERT INTO public."QuestType" (id, name, description) VALUES (1, 'Discord Authenticate', NULL);
INSERT INTO public."QuestType" (id, name, description) VALUES (2, 'Twitter Authenticate', NULL);
INSERT INTO public."QuestType" (id, name, description) VALUES (3, 'Follow Twitter Account', NULL);
INSERT INTO public."QuestType" (id, name, description) VALUES (4, 'Follow Instagram Account', NULL);
INSERT INTO public."QuestType" (id, name, description) VALUES (5, 'Retweet a Tweet', NULL);
INSERT INTO public."QuestType" (id, name, description) VALUES (6, 'Image Upload Quest', NULL);
INSERT INTO public."QuestType" (id, name, description) VALUES (9, 'Limited Free $SHELL', NULL);
INSERT INTO public."QuestType" (id, name, description) VALUES (10, 'Join our Discord', NULL);
INSERT INTO public."QuestType" (id, name, description) VALUES (11, 'Daily Shell Quest', NULL);
INSERT INTO public."QuestType" (id, name, description) VALUES (12, 'Code Quest', NULL);
INSERT INTO public."QuestType" (id, name, description) VALUES (13, 'Wallet Authenticate', NULL);
INSERT INTO public."QuestType" (id, name, description) VALUES (14, 'Claim Reward For Owning NFT', NULL);
INSERT INTO public."QuestType" (id, name, description) VALUES (15, 'Unstoppable Domain Authenticate', NULL);

INSERT INTO public."RewardType" (id, reward) VALUES (1, '$Shell');
INSERT INTO public."RewardType" (id, reward) VALUES (2, 'Mint List');
INSERT INTO public."RewardType" (id, reward) VALUES (3, 'Mystery Bowl');
```

## How to use

<details>
  <summary> Setup database</summary>
 
-------------------
  ### Modify env file (.env.development)
```js
     DATABASE_URL=postgres://username:password@localhost:5432/database_name
```
  ### Apply prisma migration
```js
      dotenv -e .env.development -- npx prisma migrate dev
```

### Expected:

In any sql client, the tables should be created.

### Populate data

Using the sql above

<details>
  <summary> Reward Types Config</summary>
  
> Add / Edit Reward Type

**This is needed before any reward can be awarded to a user**

Image Preview are used for Preview Mode when reward a user from Admin Reward Page, or when a user goes to claim page and claim a certain reward, then
the image is embded into discord.

![Screenshot](screenshots/reward_config_1.png)

Icon is optional

</details>

</details>
<br/>

<details>
  <summary> Start up</summary>
 
### Start the project
```js
npm run dev
```

Go to admin site on
http://localhost:3000/admin

Create quest (Should only be done after all below configs are completed)
Under http://localhost:3000/admin/quest

- Join Discord Type: server should be name of server (anomuragame, atarix,...)
- Discord Authenticate (Link current session with discord)
- Twitter Authenticate (Link current session with twitter)
- Twitter Retweet
- Twitter Follow
- Instagram Follow
- Wallet Authenticate
- Code Quest
- Image Upload
- Daily
- Claim Reward for owning NFT

### Must create these three quest once:

Discord Authenticate
Twitter Authenticate
Wallet Authenticate

</details>

<details>
  <summary> Discord Config</summary>
 
> Add Discord Bot

**This is needed for bot to post an embeded message on any channel within your server**

[Add a bot application](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)

Then the bot token can be used for this config
![Screenshot](screenshots/bot_token_config.png)

[Add bot to server](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links)

> Add Discord Authentication

**This is needed for Discord Authentication Quest**

[Follow this link under **Getting an OAuth2 URL**] (https://discordjs.guide/oauth2/#setting-up-a-basic-web-server)

There are two links needed:
![Screenshot](screenshots/discord_oath2_url.png)

ClientId and Client Secret should be for this config.
![Screenshot](screenshots/discord_oath2_client_config.png)

</details>

<details>
  <summary> Twitter Config</summary>
  
 
> Add Twitter Authentication

**This is needed for Twitter Authentication Quest**

[Go to Twitter Developer Portal](https://developer.twitter.com/en/portal)

Add a new App ![Screenshot](screenshots/twitter_auth_1.png)
Edit Authentication Setup ![Screenshot](screenshots/twitter_auth_2.png)
Edit Type Of App ![Screenshot](screenshots/twitter_auth_3.png)
Add Callback and Redirect URL ~ two links ![Screenshot](screenshots/twitter_auth_4.png)
Obtain ClientId and Secret ![Screenshot](screenshots/twitter_auth_5.png)
Save to server config ![Screenshot](screenshots/twitter_auth_6.png)

</details>

<details>
  <summary> Miscellaneous Config</summary>
  
 ![Screenshot](screenshots/misc_config_1.png)
 
> Add Pending Reward Image Url

**This is needed for General Discord Embed message when a reward is awarded to a user but Not Claimed.**

![Screenshot](screenshots/misc_config_2.png)

> Add Host Url

A general hostname, without any trailing slash at the end.

</details>
