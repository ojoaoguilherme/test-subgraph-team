import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import axios from "axios";
import { expect } from "chai";
import { viem } from "hardhat";
import getMarketplaceNFTs from "./helpers/getMarketplaceNFTs";
import getMarketplaceNFTsByFeatures from "./helpers/getMarketplaceNFTsByFeatures";

type AttributesType = {
  trait_type: string;
  value: string | number;
};
type Nft = {
  id: string;
  tokenURI: string;
};
const nft: Nft = { id: "", tokenURI: "" };
const attributes: AttributesType[] = [];

const ExampleApiResponse = {
  id: "189",
  itemId: "189",
  tokenId: "176",
  amount: "1",
  price: "25000000000000000000",
  owner: "0xb34fd399fdba7d4d83c0d5b67cc6d9826db7167e",
  nftContract: "0xf547b42b06a8db7c5001c61ac1c8a0ea2231f85b",
  createdAt: 1703525295000,
  updatedAt: 1703525295000,
  isSellable: true,
  description:
    "Merry Christmas everyone🎄❄️\n" +
    "I wish you a great year❤️\n" +
    "Here is my LovelySweater designed by IMGNAI✅\n" +
    "Thanks voting for me🤩✌🏻",
  tokenUri: null,
  nft,
  image: "https://ipfs.io/ipfs/QmceYMKS3Zi2Nq3h7QG7G3oSvJdmzAWeoycQDLy8C2sw8d",
  name: "LovelySweater-2",
  attributes,
};

type NftTypeResponse = typeof ExampleApiResponse;
type SubgraphApiResponse = { data: NftTypeResponse[] };

describe("Marketplace Subgraph Test", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function getMarketplace() {
    const marketplace = await viem.getContractAt(
      "NeokiMarketplace",
      "0x4377a42992f26f0e5eED5583F86d809355e1315c"
    );
    return {
      marketplace,
    };
  }

  async function getSubgraph() {
    const subgraph = axios.create({
      baseURL: "https://neoai-backend.cyclic.app/api/",
    });
    return {
      subgraph,
    };
  }

  describe("Query", function () {
    it("Marketplace should be fetching from the right contract", async function () {
      const { marketplace } = await loadFixture(getMarketplace);
      expect(marketplace.address).to.equal(
        "0x4377a42992f26f0e5eED5583F86d809355e1315c"
      );
    });

    it("Subgraph endpoint should be fetching from the right place", async function () {
      const { subgraph } = await loadFixture(getSubgraph);
      expect(subgraph.getUri()).to.equal(
        "https://neoai-backend.cyclic.app/api/"
      );
    });

    /**
     * @BUG marketplace endpoint does not fetch the total amount of listed NFTs
     * Needs to either have pagination or return the full amount
     */
    it("Marketplace and Subgraph should have the same listed amount output", async function () {
      const { subgraph } = await loadFixture(getSubgraph);
      const listedNfts = await getMarketplaceNFTs();
      console.log("custom call finished");
      const {
        data: { data },
      } = await subgraph.get<SubgraphApiResponse>("marketplace?features=2d");
      // TODO implement pagination
      expect(listedNfts.length).equal(
        data.length,
        "Subgraph return does not match marketplace listed amount"
      );
    });

    it("Subgraph should return the correct amount of filtered NFTs per feature", async function () {
      const { subgraph } = await loadFixture(getSubgraph);
      const nfts = await getMarketplaceNFTsByFeatures("features", "2d");
      console.log("custom call finished");
      const {
        data: { data },
      } = await subgraph.get<SubgraphApiResponse>("marketplace?features=2d");
      // TODO implement pagination
      expect(nfts.length).to.equal(data.length);
    });
  });
});
