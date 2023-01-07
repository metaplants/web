const main = async () => {
  const signers = await hre.ethers.getSigners();
  const sender = signers[0];
  const senderAddress = sender.address;
  const receivers = signers.slice(1, 5);
  const receiverAddresses = receivers.map((r) => r.address);
  console.log(senderAddress, receiverAddresses);
  const nftContractFactory = await hre.ethers.getContractFactory(
    "MetaplantsFree"
  );
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);
  let txn;
  txn = await nftContract.mint(
    "https://abcdefg",
    "https://hijkelmn",
    "free agave",
    "free agave giveaway",
    1000
  );
  await txn.wait();
  txn = await nftContract.uri(0);
  txn = await nftContract.safeBatchDistributeFrom(
    senderAddress,
    receiverAddresses,
    [0],
    [1],
    0
  );
  await txn.wait();
  console.log(await nftContract.uri(0));
  // txn = await nftContract.updateTokenURI(0, "hoge", "fuga");
  // await txn.wait();
  // txn = await nftContract.tokenURI(0);
  // console.log(txn);
  // txn = await nftContract.getRecord(0);
  // console.log(txn);
  // txn = await nftContract.connect(addr1).switchTokenURI(0, 1);
  // txn = await nftContract.tokenURI(0);
  // console.log(txn);
  // txn = await nftContract
  //   .connect(addr1)
  //   .transferFrom(addr1.address, addr2.address, 0);
  // txn = await nftContract.connect(addr2).redeem(0);
  // txn = await nftContract
  //   .connect(addr2)
  //   .transferFrom(addr2.address, addr1.address, 0);
  // await txn.wait();
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
