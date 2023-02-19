const CONTRACT_NAME = "Metaplants Pass";
const CONTRACT_SYMBOL = "MPLANTSPASS";

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
