import { Web3Storage } from "web3.storage";
import { ethers } from "ethers";
import axios from "axios";
import React from "react";
import { Button } from "../../components/atoms/button";
import { WEB3STORAGE_TOKEN, getABI, CONTRACT_ADDRESS } from "../../utils/utils";

import { FileDrag } from "../../components/organisms/fileDrag";
import { InputFile } from "../../components/atoms/inputFile";
import Loading from "../../components/atoms/loading";

const Redeem = () => {
  const [abi, setAbi] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const [tokenId, setTokenId] = React.useState();
  const [imageFile, setImageFile] = React.useState();
  const [animationFile, setAnimationFile] = React.useState();
  const [nftName, setNftName] = React.useState();
  const [description, setDescription] = React.useState();

  React.useEffect(() => {
    //if (!isDetectedWallet()) return
    ethereum = window.ethereum;
    (async () => {
      // リロード時にアカウント取得（接続済のみ）
      const acts = await ethereum.request({ method: "eth_accounts" });
      const _abi = await getABI();
      setAbi(_abi);
      //console.log("set abi:", _abi);
    })();

    // イベント定義
    ethereum.on("accountsChanged", (_accounts) => {
      //setAccount(_accounts)
    });
  }, []);

  const redeem = async () => {
    console.log("preparing redeem...");
    ethereum = window.ethereum;
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      console.log("abi:", abi);
      const nftContract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
      const nftTx = await nftContract.redeem(tokenId);

      const tx = await nftTx.wait();
      console.log("redeemed: ", tx);
      const event = tx.events[0];
      const value = event.args[2];
      //const tokenId = value.toNumber();
    } catch (error) {
      console.error("Error minting:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col p-2">
        <h2 className="text-2xl font-semibold m-2">Redeem Plant</h2>
        <labe className="mx-2 mt-2">Token ID</labe>
        <input
          type="text"
          name="tokenId"
          className="border-2 rounded-lg p-2"
          onChange={(e) => {
            setTokenId(e.target.value);
          }}
        />
        <div className="my-2 flex flex-col">
          <Button onClick={async () => await redeem()}>Redeem</Button>
        </div>
      </div>
      <Loading isLoading={isLoading} />
    </>
  );
};
export default Redeem;
