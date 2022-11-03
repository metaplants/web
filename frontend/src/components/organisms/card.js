import Link from "next/link";
import React from "react";
import { ethers } from "ethers";
import {
  Card,
  CardActionArea,
  CardMedia,
  Typography,
  CardContent,
} from "@mui/material";
import { CONTRACT_ADDRESS, getABI } from "../../utils/utils";

export const CardUi = ({
  tokenId = "",
  name = "Ryuzetsu NFT #0001",
  description = "",
  imageCID = "bafybeia7sjg3qocu4y6mpurn6d63dryssjukttznnc2xbulztrsrxk37fy",
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
    <>
      <Link href={`/collector/detail/${tokenId}`}>
        <Card sx={{ maxWidth: 345, borderRadius: 3 }}>
          <CardActionArea>
            <CardMedia
              component="img"
              width="320"
              height="399"
              image={`https://cloudflare-ipfs.com/ipfs/${imageCID}`}
              alt="Ryuzetsu"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Link>
    </>
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
