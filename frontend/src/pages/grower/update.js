import { uploadIPFS } from "@/utils/uploadIPFS";
import { ethers } from "ethers";
import axios from "axios";
import React from "react";
import { Button } from "../../components/atoms/button";
import { WEB3STORAGE_TOKEN, getABI, CONTRACT_ADDRESS} from "../../utils/utils"

import { FileDrag } from "../../components/organisms/fileDrag";
import { InputFile } from "../../components/atoms/inputFile";
import Loading from "../../components/atoms/loading"

const UploadNFT = () => {

  const [abi, setAbi] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false)

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

  const mint = async () => {
    setIsLoading(true)
    console.log("imageFile:", imageFile);
    console.log("animationFile:", animationFile);

    // IPFSにアップロード

    const imageFilePath = await uploadIPFS(imageFile);
    const animationFilePath = await uploadIPFS(animationFile);

    console.log("imageFilePath:", imageFilePath);
    console.log("animationFilePath:", animationFilePath);
    console.log("nftName:", nftName);
    console.log("description:", description);

    await updateNFT(imageFilePath, animationFilePath, nftName, description);
    setIsLoading(false)
  };

  const updateNFT = async (_imagePath, _animationPath, _name, _description) => {
    console.log("preparing mint...");
    ethereum = window.ethereum;
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      console.log("abi:",abi)
      const nftContract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      window.contract = nftContract;
      const nftTx = await nftContract.updateTokenURI(
        tokenId,
        `ipfs://${_imagePath}`,
        `ipfs://${_animationPath}`,
      );

      const tx = await nftTx.wait();
      console.log("minted: ", tx);
      const event = tx.events[0];
      const value = event.args[2];
      //const tokenId = value.toNumber();
    } catch (error) {
      console.error("Error minting:", error);
      setIsLoading(false)
    }
  };

  return (
    <>
      <div className="flex flex-col p-2">
        <h2 className="text-2xl font-semibold m-2">Update NFT</h2>
        <labe className="mx-2 mt-2">Token ID</labe>
        <input
          type="text"
          name="tokenId"
          className="border-2 rounded-lg p-2"
          onChange={(e)=>{setTokenId(e.target.value)}}
        />
        <label className="mt-2 mx-2">Thumbnail picture</label>
        <InputFile
          name="image"
          accept=".jpg , .jpeg , .png"
          onChange={(e) => {
            const file = e.target.files[0];
            setImageFile(file);
          }}
        />
        <label className="mt-2 mx-2">3D data</label>
        <InputFile
          name="animation"
          accept=".glb"
          onChange={(e) => {
            const file = e.target.files[0];
            setAnimationFile(file);
          }}
        />
        <div className="my-2 flex flex-col">
          <Button onClick={async () => await mint()}>Upload</Button>
        </div>
      </div>
      <Loading isLoading={isLoading} />
    </>
  );
};
export default UploadNFT;