import { OwnedNft } from "alchemy-sdk";
import { axios } from "./axiosConfig";
type Attribute = {
  value: string;
  trait_type: string;
};
type Metadata = {
  name: string;
  description: string;
  attributes: Attribute[];
};
type Batch = {
  tokenId: string;
  contractAddress: string;
}[];

export default async function getMarketplaceNFTsByFeatures(
  feature: string,
  type: string
) {
  const totalNfts: OwnedNft[] = [];
  var pageKey = "";
  do {
    const { data } = await axios.get<{
      ownedNfts: OwnedNft[];
      pageKey: string;
    }>("getNFTsForOwner", {
      params: {
        owner: "0x4377a42992f26f0e5eED5583F86d809355e1315c",
        pageKey: pageKey,
      },
    });
    if (data.pageKey) {
      pageKey = data.pageKey;
    } else {
      pageKey = "";
    }
    totalNfts.push(...data.ownedNfts);
  } while (pageKey !== "");

  const featureNfts: OwnedNft[] = [];
  for (let index = 0; index < totalNfts.length; index++) {
    const nft = totalNfts[index];
    const metadata: Metadata = nft.raw.metadata as unknown as Metadata;
    if (metadata && metadata.attributes) {
      const foundFeature = metadata.attributes.find(
        (value) => value["trait_type"].toUpperCase() === feature.toUpperCase()
      );
      if (foundFeature) {
        if (foundFeature["value"].toUpperCase() == type.toUpperCase())
          featureNfts.push(nft);
      }
    }
  }
  return featureNfts;
}
