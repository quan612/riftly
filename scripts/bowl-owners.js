const { PrismaClient } = require("@prisma/client");
const Enums = require("../enums");
const prisma = new PrismaClient();
const Moralis = require("moralis").default;
const ethers = require("ethers");
var fs = require('fs');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'bowl-owners.csv',
  header: [
    { id: 'tokenId', title: 'tokenId' },
    { id: 'owner', title: 'owner' },
  ]
});
const timer = ms => new Promise(res => setTimeout(res, ms))

async function main() {

  await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

  let csvData = [];;


  let response;
  let cursor = "";
  let result = [];
  do {
    response = await Moralis.EvmApi.nft.getNFTOwners({
      address: ethers.utils.getAddress("0xe2ddf03ba8cDafd2Bb4884E52f7FB46df4FC7DC1"),
      chain: 1,
      cursor
    })
    let data = response.data;

    console.log(
      `Got page ${data.page} of ${Math.ceil(data.total / data.page_size)}, ${data.total
      } total`
    );

    for (const nft of data.result) {
      result = [...result, nft];
    }
    cursor = data.cursor;

    // let rateLimit = parseInt(headers["x-rate-limit-limit"])
    // let rateLimitUsed = parseInt(headers["x-rate-limit-used"])
    // let requestWeight = parseInt(headers["x-request-weight"])

    // if (rateLimitUsed + requestWeight > rateLimit) {
    //   await timer(1000) // ~ 1 second
    // }
    await timer(1000)

  } while (cursor != null && cursor != "");



  // console.log(result)
  result.forEach(r => {

    let dataToWrite = {}
    dataToWrite.tokenId = r.token_id;
    dataToWrite.owner = r.owner_of;

    csvData.push(dataToWrite)

  })


  csvWriter
    .writeRecords(csvData)
    .then(() => console.log('The CSV file was written successfully'));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
