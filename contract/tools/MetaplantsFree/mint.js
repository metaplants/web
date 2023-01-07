require("dotenv").config();
const Web3 = require("web3");
const { abi } = require("./MetaplantsFree.json");
const endPoint = process.env.STAGING_ALCHEMY_POLYGON_MUMBAI_ENDPOINT;
const contractAddress = process.env.CONTRACT_ADDRESS_METAPLANTS_FREE;
const privateKey = process.env.PRIVATE_KEY;

const web3 = new Web3(endPoint);
const contract = new web3.eth.Contract(abi, contractAddress);

const main = async () => {
  const transaction = contract.methods.mint(
    "ipfs://QmU91PFnENF1hn4nWWG1kB94K6PZ7VHmZdMbMU3ofTN7EQ",
    "ipfs://QmXETDmShYW1f1r3oEtsw5LEeQ7QZdwox4dhDQWHLc6UQq",
    "metaplants NFT",
    "metaplants NFT giveaway",
    10000
  );
  const options = {
    to: transaction._parent._address,
    data: transaction.encodeABI(),
    gas: "100000000",
  };
  const signed = await web3.eth.accounts.signTransaction(options, privateKey);
  const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
  console.log(receipt);
};

main();
