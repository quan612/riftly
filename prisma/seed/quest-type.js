const { PrismaClient } = require("@prisma/client");
const Enums = require("../../enums");
const prisma = new PrismaClient();

const questTypes = [
  {
    type: Enums.JOIN_DISCORD,
  },
  {
    type: Enums.DISCORD_AUTH,
  },
  {
    type: Enums.TWITTER_AUTH,
  },
  {
    type: Enums.WALLET_AUTH,
  },
  {
    type: Enums.TWITTER_RETWEET,
  },
  {
    type: Enums.FOLLOW_TWITTER,
  },
  {
    type: Enums.FOLLOW_INSTAGRAM,
  },

  {
    type: Enums.OWNING_NFT_CLAIM,
  },

  {
    type: Enums.IMAGE_UPLOAD_QUEST,
  },

  {
    type: Enums.LIMITED_FREE_SHELL,
  },

  {
    type: Enums.DAILY_SHELL,
  },
  {
    type: Enums.CODE_QUEST,
  },
];

async function main() {
  console.log("Seeding prisma questType db");

  for (let i = 0; i < questTypes.length; i++) {
    await prisma.questType.create({
      data: {
        name: questTypes[i].type,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
