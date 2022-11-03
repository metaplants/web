import Image from "next/image";
import React from "react";
import { ethers } from "ethers";
import axios from "axios";
import { Button } from "../../components/atoms/button";
import {CONTRACT_ADDRESS, getABI} from "../../utils/utils"

export const Card = ({
  name = "Ryuzetsu NFT #0001",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  owner = "Pawel Czerwinski",
  imageCID = "bafybeia7sjg3qocu4y6mpurn6d63dryssjukttznnc2xbulztrsrxk37fy",
  animationCID = ""
}) => {
  const [abi, setAbi] = React.useState([]);
  // コントラクトを叩いて、imageとanimationのURLを取得する
  const getURLs = async (tokenId) => {
    console.log("get ipfs urls...");
    ethereum = window.ethereum;
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      console.log("nftContract:", nftContract);
      window.contract = nftContract;
      if (nftContract.getRecord === undefined) return;
      const records = await nftContract.getRecord(tokenId);
      const latestRecord = records[0];
      console.log("latestRecord:", latestRecord);

      const imgIPFS = latestRecord[0];
      const animationIPFS = latestRecord[1];
      const imgCID = imgIPFS.slice("ipfs://".length);
      const animationCID = animationIPFS.slice("ipfs://".length);

      // const tx = await nftTx.wait();
      // console.log("minted: ", tx);
      // const event = tx.events[0];
      // const value = event.args[2];
      // const tokenId = value.toNumber();
    } catch (error) {
      console.error("Error minting:", error);
    }
  };

  React.useEffect(() => {
    (async () => {
      const _abi = await getABI();
      setAbi(_abi);
      await getURLs(7);
    })();
  }, []);

  return (
    <div className="flex flex-col p-3 rounded-3xl border-2 pb-3"
    href="/collector/nftDetail">
      <img
        src={
          `https://cloudflare-ipfs.com/ipfs/${imageCID}`
        }
        alt="Ryuzetsu"
        width={320}
        height={399}
        className="rounded-xl"
      />
      <span className="text-2xl font-bold m-2">{name}</span>
      <div className="m-2 break-all max-w-fit">{description}</div>
      <div className="flex flex-row grow-0 my-auto">
        <Image
          src="/sample-profile.png"
          alt="Owner profile"
          width={60}
          height={60}
          className="rounded-full"
        />
        <div className="flex flex-col justify-center">
        <span className="mx-2">Owned by </span>
        <span className="mx-2">{owner}</span>
        </div>
      </div>
    </div>
  );
};

function getAccessToken() {
  // If you're just testing, you can paste in a token
  // and uncomment the following line:
  // return 'paste-your-token-here'

  // In a real app, it's better to read an access token from an
  // environement variable or other configuration that's kept outside of
  // your code base. For this to work, you need to set the
  // WEB3STORAGE_TOKEN environment variable before you run your code.
  //return process.env.WEB3STORAGE_TOKEN
  return process.env.NEXT_PUBLIC_API_KEY;
}

