require("dotenv").config();
const fs = require("fs");

// const ADDRESS_LIST_PATH = "tools/random_Address.txt";
const ADDRESS_LIST_PATH = "tools/metaplants_giveaway.txt";
const IDS = [0];
const AMOUNTS = [1];

const receiverAddresses = fs
  .readFileSync(ADDRESS_LIST_PATH, "utf-8")
  .split("\n");

const Web3 = require("web3");
const {
  abi,
} = require("../artifacts/contracts/MetaplantsPass.sol/MetaplantsPass.json");

// const endPoint = process.env.STAGING_ALCHEMY_POLYGON_MUMBAI_ENDPOINT;
const endPoint = process.env.STAGING_ALCHEMY_POLYGON_MAINNET_ENDPOINT;
const contractAddress = process.env.CONTRACT_ADDRESS_METAPLANTS_PASS;
const privateKey = process.env.PRIVATE_KEY;

const web3 = new Web3(endPoint);
const contract = new web3.eth.Contract(abi, contractAddress);

const senderAddress = web3.eth.accounts.privateKeyToAccount(privateKey).address;

const main = async () => {
  const transaction = contract.methods.safeBatchDistributeFrom(
    senderAddress,
    receiverAddresses,
    IDS,
    AMOUNTS,
    0
  );
  const options = {
    to: transaction._parent._address,
    data: transaction.encodeABI(),
    gas: "20000000",
  };
  const signed = await web3.eth.accounts.signTransaction(options, privateKey);
  const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
  console.log(receipt);
};

main();
