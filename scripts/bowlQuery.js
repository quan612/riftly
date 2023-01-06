const { PrismaClient } = require("@prisma/client");
const Enums = require("../enums");
const prisma = new PrismaClient();
const Moralis = require("moralis").default;
const ethers = require("ethers");
var fs = require('fs');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'test-1-500.csv',
  header: [
    { id: 'tokenId', title: 'tokenId' },
    { id: 'owner', title: 'owner' },
    { id: 'summonPower', title: 'summonPower' },
    { id: 'starfish', title: 'starfish' },
  ]
});

async function main() {

  await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
  try {
    let data = [];;
    for (let i = 1; i <= 500; i++) {
      let dataToWrite = {}
      const query = await Moralis.EvmApi.nft.getNFTMetadata({
        address: ethers.utils.getAddress("0xe2ddf03ba8cDafd2Bb4884E52f7FB46df4FC7DC1"),
        chain: 1,
        tokenId: i,
      });

      dataToWrite.tokenId = query.data.token_id;
      dataToWrite.owner = query.data.owner_of;

      let metaData = JSON.parse(query.data.metadata);

      dataToWrite.summonPower = metaData?.attributes[0].value || "Cannot determine";
      dataToWrite.starfish = metaData?.attributes[1].value || "Cannot calculate";

      data.push(dataToWrite)
    }



    csvWriter
      .writeRecords(data)
      .then(() => console.log('The CSV file was written successfully'));
  } catch (error) {
    console.log(error)
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
