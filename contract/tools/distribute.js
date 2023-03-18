require("dotenv").config();
const Web3 = require("web3");
const {
  abi,
} = require("../artifacts/contracts/MetaplantsPass.sol/MetaplantsPass.json");

const endPoint = process.env.STAGING_ALCHEMY_POLYGON_MUMBAI_ENDPOINT;
const contractAddress = process.env.CONTRACT_ADDRESS_METAPLANTS_PASS;
const privateKey = process.env.PRIVATE_KEY;

const web3 = new Web3(endPoint);
const contract = new web3.eth.Contract(abi, contractAddress);

const senderAddress = web3.eth.accounts.privateKeyToAccount(privateKey).address;
const receiverAddresses = [];
for (let i = 0; i < 500; i++) {
  receiverAddresses.push(web3.eth.accounts.create().address);
}

const main = async () => {
  const transaction = contract.methods.safeBatchDistributeFrom(
    senderAddress,
    receiverAddresses,
    [0],
    [1],
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
