import { useState, useEffect } from "react";
import type { NextPage } from "next";
// 接続中のネットワークを取得するため useNetwork を新たにインポートします。
import {
  ConnectWallet,
  ChainId,
  useNetwork,
  useAddress,
  useContract,
} from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const address = useAddress();
  console.log("👋Wallet Address: ", address);

  const [network, switchNetwork] = useNetwork();

  // editionDrop コントラクトを初期化
  const { contract: editionDrop, error } = useContract(
    "0xc6a29C7F3069e91C5226d8957aD144AAD0979774",
    "edition-drop"
  );

  // ユーザーがメンバーシップ NFT を持っているかどうかを知るためのステートを定義
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  // NFT をミンティングしている間を表すステートを定義
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    // もしウォレットに接続されていなかったら処理をしない
    if (!address) {
      return;
    }
    // ユーザーがメンバーシップ NFT を持っているかどうかを確認する関数を定義
    const checkBalance = async () => {
      try {
        const balance = await editionDrop!.balanceOf(address, 0);
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!");
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.");
        }
      } catch (error) {
        setHasClaimedNFT(false);
        console.error("Failed to get balance", error);
      }
    };
    // 関数を実行
    checkBalance();
  }, [address, editionDrop]);

  const mintNft = async () => {
    try {
      setIsClaiming(true);
      await editionDrop!.claim("0", 1);
      console.log(
        `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop!.getAddress()}/0`
      );
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.error("Failed to mint NFT", error);
    } finally {
      setIsClaiming(false);
    }
  };

  // ウォレットと接続していなかったら接続を促す
  if (!address) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Welcome to Tokyo Sauna Collective !!</h1>
          <div className={styles.connect}>
            <ConnectWallet />
          </div>
        </main>
      </div>
    );
  }
  // テストネットが Goerli ではなかった場合に警告を表示
  else if (address && network && network?.data?.chain?.id !== ChainId.Goerli) {
    console.log("wallet address: ", address);
    console.log("network: ", network?.data?.chain?.id);

    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Goerli に切り替えてください⚠️</h1>
          <p>この dApp は Goerli テストネットのみで動作します。</p>
          <p>ウォレットから接続中のネットワークを切り替えてください。</p>
        </main>
      </div>
    );
  }
  // ウォレットと接続されていたら Mint ボタンを表示
  else {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Mint your free 🍪DAO Membership NFT</h1>
          <button disabled={isClaiming} onClick={mintNft}>
            {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
          </button>
        </main>
      </div>
    );
  }
};

export default Home;
