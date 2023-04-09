const CONTRACT_NAME = "metaplants NFT Pass";
const CONTRACT_SYMBOL = "MPT";
const contractAddress = process.env.CONTRACT_ADDRESS_METAPLANTS_PASS;

const main = async () => {
  await hre.run("verify:verify", {
    address: contractAddress,
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
