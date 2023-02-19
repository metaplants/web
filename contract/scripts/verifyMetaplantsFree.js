const CONTRACT_NAME = "Metaplants Pass";
const CONTRACT_SYMBOL = "MPLANTSPASS";
const ADDRESS = process.env.CONTRACT_ADDRESS_METAPLANTS_FREE;

const main = async () => {
  await hre.run("verify:verify", {
    address: ADDRESS,
    constructorArguments: [CONTRACT_NAME, CONTRACT_SYMBOL],
  });
};
main();
