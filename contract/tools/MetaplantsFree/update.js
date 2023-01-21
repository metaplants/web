require("dotenv").config();
const Web3 = require("web3");
const { abi } = require("./MetaplantsFree.json");
const endPoint = process.env.STAGING_ALCHEMY_POLYGON_MUMBAI_ENDPOINT;
const contractAddress = process.env.CONTRACT_ADDRESS_METAPLANTS_FREE;
const privateKey = process.env.PRIVATE_KEY;

const web3 = new Web3(endPoint);
const contract = new web3.eth.Contract(abi, contractAddress);

const main = async () => {
  const transaction = contract.methods.updateTokenURI(
    0,
    "ipfs://QmZ5iw9GvTw2Ann8Tu9veuKvzWqV213io5uci6HpwJDRys",
    "ipfs://QmXETDmShYW1f1r3oEtsw5LEeQ7QZdwox4dhDQWHLc6UQq",
  );
  const options = {
    to: transaction._parent._address,
    data: transaction.encodeABI(),
    gas: "10000000",
  };
  const signed = await web3.eth.accounts.signTransaction(options, privateKey);
  const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
  console.log(receipt);
};

main();
