import "@nomicfoundation/hardhat-toolbox-viem";
import dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import { z } from "zod";
dotenv.config();

const envConfigSchema = z.object({
  ALCHEMY_API_URL: z.string(),
  ALCHEMY_AXIOS_URL: z.string(),
});

const _env = envConfigSchema.safeParse(process.env);

if (_env.success === false) {
  throw "Invalid ENV Credentials";
}
export const env = _env.data;

const config: HardhatUserConfig = {
  solidity: "0.8.19",

  networks: {
    hardhat: {
      forking: {
        url: env.ALCHEMY_API_URL,
        blockNumber: 43604636,
      },
    },
  },
};

export default config;
