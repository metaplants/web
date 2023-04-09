require("dotenv").config();
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

const INPUTS = {
  imageURI: "ipfs://Qma5MVQTv7WkXfWZeK52Nw8Aev4ia3eUR5grZgpz9AwVnA",
  animationURI: "ipfs://QmRxJmzroKeqntLrEyARmBjW3AfH6yaDtgMp6RfUUh4GBm",
  backgroundColor: "1D1E20",
  name: "metaplants NFT Pass #1",
  description:
    "パキポディウム・グラキリス。人気の塊根植物の一つ。砂漠などの厳しい環境で生き残るために、茎や根を膨らませて水分を蓄えます。お腹のムチムチ感がたまらない。グラキリスなどが特に人気があります。 (Date: 2023-04-08)",
  amount: 310,
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
