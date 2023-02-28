const CONTRACT_NAME = "Metaplants";
const CONTRACT_SYMBOL = "MPT";

const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory(
    "MetaplantsFree"
  );
  const nftContract = await nftContractFactory.deploy(
    CONTRACT_NAME,
    CONTRACT_SYMBOL
  );
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);
  await new Promise((resolve) => setTimeout(resolve, 15 * 1000)); // wait 15 seconds until contract is verifiable on Explorer
  await hre.run("verify:verify", {
    address: nftContract.address,
    constructorArguments: [CONTRACT_NAME, CONTRACT_SYMBOL],
  });
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
runMain();
