import React, { useState, useEffect } from "react";
import { Suspense } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Card,
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
import { staticPath } from "@/utils/pathpida/$path";
import { Canvas, useLoader } from "@react-three/fiber";
import { Environment, OrbitControls, TransformControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

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

  const Model = () => {
    // location of the 3D model
    const gltf = useLoader(
      GLTFLoader,
      staticPath.agave_titanota_large_resized_glb
    );
    return (
      <>
        {/* Use scale to control the size of the 3D model */}
        <primitive object={gltf.scene} scale={0.7} />
      </>
    );
  };

  return (
    <>
      <Container fixed>
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <Card sx={{ borderRadius: 5, height: 500, m:3}}>
              <Canvas
                camera={{
                  fov: 45,
                  near: 0.5,
                  far: 1000,
                  position: [0, 3, 5]
                }}
              >
                <ambientLight intensity={0.7} />
                <spotLight
                  intensity={0.5}
                  angle={0.1}
                  penumbra={1}
                  position={[40, 15, 10]}
                  castShadow
                />
                <TransformControls mode="translate" setTranslationSnap={100}>
                  <Suspense fallback={null}>
                    <Model />
                    <Environment preset="city" />
                  </Suspense>
                </TransformControls>
                <OrbitControls makeDefault />
              </Canvas>
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
