import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

// 先ほどメモして残していた editionDrop のコントラクトアドレスをこちらに記載してください
const editionDropPromise = sdk.getContract(
  "0xc6a29C7F3069e91C5226d8957aD144AAD0979774",
  "edition-drop"
);

(async () => {
  try {
    const editionDrop = await editionDropPromise;
    const metadata = {
      name: "Member's Limited Film",
      description:
        "Vintage Camera Collective にアクセスすることができる限定アイテムです",
      image: readFileSync("src/scripts/assets/NFT.jpg"),
    };
    await editionDrop.createBatch([metadata]);

    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})();
