import { defineConfig } from "@dethcrypto/eth-sdk";

export default defineConfig({
  contracts: {
    polygon: {
      NeokiMarketplace: "0x4377a42992f26f0e5eED5583F86d809355e1315c",
    },
  },
  rpc: {
    polygon:
      "https://polygon-mainnet.g.alchemy.com/v2/a3jXuouvJtMzPzTfYnjQcaZOHJzE-A_x",
  },
});
