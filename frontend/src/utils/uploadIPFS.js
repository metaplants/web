import { Web3Storage } from "web3.storage";
import { WEB3STORAGE_TOKEN } from "@/utils/utils";

export const uploadIPFS = async (file) => {
  const client = new Web3Storage({ token: WEB3STORAGE_TOKEN });
  const rootCid = await client.put([file], {
    name: file.name,
    maxRetries: 3,
  });
  return `${rootCid}/${file.name}`;
};
