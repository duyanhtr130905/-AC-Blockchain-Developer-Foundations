import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("=".repeat(50));
  console.log("Bai 2.3 - Welcome Contract");
  console.log("=".repeat(50));
  console.log("Deployer:", deployer.address);

  // ── Deploy ──────────────────────────────────────────
  const Welcome = await ethers.getContractFactory("Welcome");
  const welcome = await Welcome.deploy("Xin chao Blockchain!");
  await welcome.waitForDeployment();
  const addr = await welcome.getAddress();
  console.log("✅ Welcome deployed to:", addr);

  // ── Interact via ethers.js ───────────────────────────
  const greeting = await welcome.getGreeting();
  console.log("\n📖 getGreeting():", greeting);

  const [greet, dep] = await welcome.getGreetingWithDeployer();
  console.log("📖 getGreetingWithDeployer():");
  console.log("   greeting :", greet);
  console.log("   deployer :", dep);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
