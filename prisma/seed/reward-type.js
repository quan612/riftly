const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const rewardTypes = [
  { id: 1, reward: "Mystery Bowl" },
  { id: 2, reward: "$hell" },
];

async function main() {
  console.log("Seeding prisma rewardTypes db");

  for (let i = 0; i < rewardTypes.length; i++) {
    const reward = await prisma.rewardType.upsert({
      where: { id: -1 },
      update: { reward: rewardTypes[i].reward },
      create: {
        reward: rewardTypes[i].reward,
      },
    });

    console.log({ reward });
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
