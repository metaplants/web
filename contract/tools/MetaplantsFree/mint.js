require("dotenv").config();
const Web3 = require("web3");
const { abi } = require("./MetaplantsFree.json");
const endPoint = process.env.STAGING_ALCHEMY_POLYGON_MUMBAI_ENDPOINT;
const contractAddress = process.env.CONTRACT_ADDRESS_METAPLANTS_FREE;
const privateKey = process.env.PRIVATE_KEY;

const web3 = new Web3(endPoint);
const contract = new web3.eth.Contract(abi, contractAddress);

const INPUTS = {
  imageURI: "ipfs://QmecMajSJbrDm1U7ks9CTgDDSWm25Jr2mRzrDtDP5hWHdV",
  animationURI: "ipfs://QmWAarJhYsWeYCtJhQnETXQ69zyhfGLAFwpqTEq5Bd7Pdd",
  backgroundColor: "000000",
  name: "metaplants pacypo NFT",
  description: "pass for metaplants genesis sale",
  amount: 10000,
};

const main = async () => {
  const transaction = contract.methods.mint(
    INPUTS.imageURI,
    INPUTS.animationURI,
    INPUTS.backgroundColor,
    INPUTS.name,
    INPUTS.description,
    INPUTS.amount
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
