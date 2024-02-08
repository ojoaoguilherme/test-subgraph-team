import axiosInstance from "axios";
import { env } from "../../hardhat.config";
console.log("axios config", env);
export const axios = axiosInstance.create({
  baseURL: env.ALCHEMY_AXIOS_URL,
});
