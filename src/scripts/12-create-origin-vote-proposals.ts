import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

// 投票コントラクトのアドレスを設定します
const vote = sdk.getContract(
  "0xd00634aA70e9b09Ef7D1a5Dd3ff3f027fBf57974",
  "vote"
);

// ERC-20 コントラクトのアドレスを設定します。
const token = sdk.getContract(
  "0x04280d1D7Bb34AB7afC830E5ecABc063f26cB621",
  "token"
);

(async () => {
  try {
    // トレジャリーに 10,000 のトークンを新しく鋳造する提案を作成します
    const amount = 10_000;
    const description = `トレジャリーに${amount}分のトークンを新しくミントしたいです。`;
    const executions = [
      {
        // mint を実行するトークンのコントラクトアドレスを設定します
        toAddress: (await token).getAddress(),
        // DAO のネイティブトークンが ETH であるため、プロポーザル作成時に送信したい ETH の量を設定します（今回はトークンを新しく発行するため 0 を設定します）
        nativeTokenValue: 0,
        // ガバナンスコントラクトのアドレスに mint するために、金額を正しい形式（wei）に変換します
        transactionData: (await token).encoder.encode("mintTo", [
          (await vote).getAddress(),
          ethers.utils.parseUnits(amount.toString(), 18),
        ]),
      },
    ];

    await (await vote).propose(description, executions);

    console.log("✅ Successfully created proposal to mint tokens");
  } catch (error) {
    console.error("failed to create first proposal", error);
    process.exit(1);
  }

  try {
    // 1,000 のトークンを自分たちに譲渡するための提案を作成します
    const amount = 1_000;
    const description = `${process.env.WALLET_ADDRESS}のアドレス宛に${amount}トークンを付与しませんか？`;
    const executions = [
      {
        nativeTokenValue: 0,
        transactionData: (await token).encoder.encode(
          // トレジャリーからウォレットへの送金を行います。
          "transfer",
          [
            process.env.WALLET_ADDRESS!,
            ethers.utils.parseUnits(amount.toString(), 18),
          ]
        ),
        toAddress: (await token).getAddress(),
      },
    ];

    await (await vote).propose(description, executions);

    console.log(
      "✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
    );
  } catch (error) {
    console.error("failed to create second proposal", error);
  }
})();
