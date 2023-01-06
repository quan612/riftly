const { PrismaClient } = require("@prisma/client");


const prisma = new PrismaClient();
const CryptoJS = require("crypto-js");

const adminAddresses = [
  "0x4D6EAEd5a1d1E631bbB6B3b4c6bedc4251d2DDF6",
];

/* Seeding Admin table */
async function main() {
  await prisma.whiteList.deleteMany();

  for (let i = 0; i < adminAddresses.length; i++) {
    const nonce = CryptoJS.lib.WordArray.random(16).toString();
    const user1 = await prisma.Admin.upsert({
      where: { wallet: adminAddresses[i] },
      update: { nonce },
      create: {
        wallet: adminAddresses[i],
        nonce,
      },
    });

    console.log({ user1 });
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
