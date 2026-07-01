/**
 * Bài 5.2 – Gửi Transaction dùng Ethers.js + Hardhat
 *
 * Script này mô phỏng logic của `scripts/test.ts` từ ac-hardhat-template.
 * Trong môi trường Hardhat thực tế, đây sẽ là:
 *
 * import { ethers } from "hardhat";
 * import { Counter } from "../typechain";
 *
 * Vì project hiện tại không có Hardhat, script này minh hoạ cách tương tác
 * với Counter contract bằng ethers.js kết nối đến node local (hardhat node).
 *
 * Nguồn template: https://github.com/appscyclone/ac-hardhat-template
 */

import { ethers } from "ethers";

// ABI của Counter contract (chỉ 2 hàm cần dùng)
const COUNTER_ABI = [
  "function increment() public",
  "function getCount() public view returns (uint256)",
];

/**
 * Địa chỉ contract sau khi deploy lên mạng.
 * Thay bằng địa chỉ thực sau khi chạy: npx hardhat deploy --network sepolia --tags deploy
 */
const COUNTER_ADDRESS = "0x__REPLACE_WITH_DEPLOYED_CONTRACT_ADDRESS__";

async function main() {
  /**
   * Kết nối đến mạng.
   * - Để test local: dùng http://127.0.0.1:8545 (sau khi chạy `npx hardhat node`)
   * - Để test Sepolia:  dùng Alchemy/Infura RPC URL từ biến môi trường
   */
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  // Lấy signer (tài khoản đầu tiên từ hardhat node)
  const [deployer] = await provider.listAccounts();
  const signer = await provider.getSigner(deployer);

  console.log("Tài khoản đang dùng:", await signer.getAddress());

  // Kết nối đến Counter contract đã deploy
  const counter = new ethers.Contract(COUNTER_ADDRESS, COUNTER_ABI, signer);

  // Gọi hàm increment() – gửi một transaction
  console.log("\nGọi hàm increment()...");
  const tx = await counter.increment();
  console.log("Transaction hash:", tx.hash);

  // Chờ transaction được confirm
  await tx.wait();
  console.log("Transaction đã được confirm!");

  // Đọc giá trị count hiện tại (read-only call, không tốn gas)
  const count = await counter.getCount();
  console.log("\nKết quả getCount():", count.toString());
  // Kết quả mong đợi: 1 (nếu gọi increment() một lần)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
