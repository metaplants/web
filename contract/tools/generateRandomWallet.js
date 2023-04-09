require("dotenv").config();
const fs = require("fs");
const Web3 = require("web3");
const endPoint = process.env.STAGING_ALCHEMY_POLYGON_MUMBAI_ENDPOINT;
const web3 = new Web3(endPoint);
const N = 70;
const randomWallets = [];

for (let i = 0; i < N; i++) {
  randomWallets.push(web3.eth.accounts.create().address);
}

fs.writeFile(
  "tools/random_Address.txt",
  randomWallets.join("\n"),
  (err, data) => {
    if (err) console.log(err);
    else console.log("write end");
  }
);
