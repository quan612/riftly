const CryptoJS = require("crypto-js");

const generateCode = () => {
  const newCode = CryptoJS.lib.WordArray.random(24).toString();
  console.log(newCode);
};

generateCode();
