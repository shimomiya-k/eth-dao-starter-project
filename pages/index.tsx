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

  /// editionDrop コントラクトを初期化
  const { contract } = useContract(
    "0xc6a29C7F3069e91C5226d8957aD144AAD0979774",
    "edition-drop"
  );

  const test = useContract(
    "0xc6a29C7F3069e91C5226d8957aD144AAD0979774",
    "edition-drop"
  );

  console.log(test);

  // ユーザーがメンバーシップ NFT を持っているかどうかを知るためのステートを定義
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  useEffect(() => {
    // もしウォレットに接続されていなかったら処理をしない
    if (!address) {
      return;
    }
    // ユーザーがメンバーシップ NFT を持っているかどうかを確認する関数を定義
    const checkBalance = async () => {
      try {
        console.log("contract obj:");
        console.log(contract);
        const balance = await contract!.balanceOf(address, 0);
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
  }, [address, contract]);

  if (address && network && network?.data?.chain?.id !== ChainId.Goerli) {
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
  } else {
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
};

export default Home;
