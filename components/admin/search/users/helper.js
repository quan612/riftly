import XLSX from "xlsx";
import axios from "axios";


export const downloadCsv = (jsonData) => {

  jsonData = jsonData.map((r) => {
    r.follower = r.whiteListUserData?.followers;
    r.balance = r.whiteListUserData?.eth;

    delete r.whiteListUserData;
    delete r.userId;
    return r;
  });
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(jsonData);
  XLSX.utils.book_append_sheet(wb, ws, "test");
  XLSX.writeFile(wb, "Riftly_User_Search.csv");
};


export const getNftOwners = async (contract, chainId) => {
  let cursor = "";
  let nftOwners = [];
  do {
    let contractQuery = await axios
      .get(`/api/admin/user-stats/contract/${contract.trim()}/${chainId}/${cursor}`)
      .then((r) => r.data);

    for (const nft of contractQuery.result) {
      nftOwners = [...nftOwners, nft];
    }

    cursor = contractQuery?.cursor;

    sleep();
    break;
  } while (cursor != null && cursor != "");

  return nftOwners.map((r) => r.owner_of);
};