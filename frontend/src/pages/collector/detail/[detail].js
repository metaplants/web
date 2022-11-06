import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material/";
import { CONTRACT_ADDRESS, ABI } from "@/utils/utils";
import { ethers } from "ethers";

const Detail = () => {
  const router = useRouter();
  const [detail, setDetail] = useState(0);
  const [meta, setMeta] = useState({
    name: "",
    tokenId: "",
    description: "",
    image: "",
    animation_url: "",
  });

  /**
   * 指定したtokenIdのメタデータを取得
   * @param {string} tokenId
   * @return {string} name
   * @return {string} description
   * @return {string} image
   * @return {string} animation_url
   */
  const getTokenURI = async (tokenId) => {
    const ethereum = window.ethereum;
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      if (nftContract.tokenURI === undefined) {
        throw "contract.tokenURI is undefined";
      }
      const encodedTokenURI = await nftContract.tokenURI(tokenId);
      //const tokenURI = JSON.parse(atob(encodedTokenURI.slice('data:application/json;base64,'.length)))
      const tokenURI = JSON.parse(
        Buffer.from(
          encodedTokenURI.slice("data:application/json;base64,".length),
          "base64"
        )
      );
      const tokenURIwithId = { ...tokenURI, tokenId };
      console.log("tokenURIwith:", tokenURIwithId);
      return tokenURIwithId;
    } catch (error) {
      console.error("Error minting:", error);
    }
  };

  // この部分を追加
  useEffect(() => {
    // idがqueryで利用可能になったら処理される
    if (router.asPath !== router.route) {
      setDetail(Number(router.query.detail));
    }
  }, [router]);

  useEffect(() => {
    if (detail) {
      console.log("#contract address:", CONTRACT_ADDRESS);
      const ethereum = window.ethereum;
      (async () => {
        const acts = await ethereum.request({ method: "eth_accounts" });
        const metadata = await getTokenURI(detail);
        console.dir(metadata);
        setMeta(metadata);
      })();
    }
  }, [detail]);

  return (
    <>
      <Container fixed>
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <Card sx={{ borderRadius: 5 }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  image={`https://cloudflare-ipfs.com/ipfs/${meta.image.slice(
                    "ipfs://".length
                  )}`}
                  alt="Ryuzetsu"
                />
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={5}>
            <Stack spacing={2}>
              <Box>
                <Typography fontSize={30}>{meta.name}</Typography>
              </Box>
              <Box>
                <Typography fontSize={20}>Age : 2 years 10 days </Typography>
              </Box>
              <Box height={100}>
                <Typography fontSize={15}>{meta.description}</Typography>
              </Box>
              <Box>
                <Typography fontSize={20}>Capture History</Typography>
                <FormControl fullWidth>
                  <Select variant="outlined">
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Detail;
