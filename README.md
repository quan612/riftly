

# Description

This is the repo for the Sharing-UI of project Anomura.

Some endpoints which post a message to a discord server, we need a nodejs server to handle discordjs package, currently we cannot have discordjs within this repo due to Vercel only supports Node runtime execution up to v14 at the time of development. Discordjs needs v16.

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
Go to ./prisma/seed/admin.js
Modifying the value with your wallet, then execute these commands:
```js
dotenv -e .env.development -- node ./prisma/seed/admin.js
dotenv -e .env.development -- node ./prisma/seed/quest-type.js
dotenv -e .env.development -- node ./prisma/seed/reward-type.js 

```

</details>
<br/>

<details>
  <summary> Start up</summary>
 
  ### Modifying BasePath
This project is configured with basepath in order to be accessed as sub domain from another repository so the default starting path would be
http://localhost:3000/[base_path_name] (http://localhost:3000/challenger)

If we use this repos as the standalone we would have to remove all the basePath value.
- Under next.config.js
- Under enums/
- Under sass/  (anything with /[base_path_name]) 

### Start the project
```js
npm run dev
```

Go to admin site on
http://localhost:3000/challenger/admin

Create quest 
Under http://localhost:3000/challenger/admin/quest

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

</details>

Go to admin site on
http://localhost:3000/challenger/admin

Create quest 
Under http://localhost:3000/challenger/admin/quest

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

</details>