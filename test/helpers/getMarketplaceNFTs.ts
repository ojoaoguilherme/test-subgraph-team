import * as ethers from "ethers";
import { getPolygonSdk } from "@dethcrypto/eth-sdk-client";
import { env } from "../../hardhat.config";

console.log("marketplace nfts", env);
export default async function getMarketplaceNFTs() {
  const provider = new ethers.JsonRpcProvider(env.ALCHEMY_API_URL);
  const sdk = getPolygonSdk(provider);
  return await sdk.NeokiMarketplace.getAllItems();
}
