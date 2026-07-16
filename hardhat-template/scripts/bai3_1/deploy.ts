import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("=".repeat(50));
  console.log("Bai 3.1 - Profile Contract");
  console.log("=".repeat(50));
  console.log("Deployer:", deployer.address);

  // ── Deploy ──────────────────────────────────────────
  const Profile = await ethers.getContractFactory("Profile");
  const profile = await Profile.deploy();
  await profile.waitForDeployment();
  const addr = await profile.getAddress();
  console.log("✅ Profile deployed to:", addr);

  // ── Interact via ethers.js ───────────────────────────
  console.log("\n📝 Gọi setProfile('Nguyen Van A', 21)...");
  const tx = await profile.setProfile("Nguyen Van A", 21);
  await tx.wait();
  console.log("   Tx hash:", tx.hash);

  const name = await profile.name();
  const age = await profile.age();
  console.log("\n📖 name():", name);
  console.log("📖 age() :", age.toString());

  const [pName, pAge] = await profile.getProfile();
  console.log("\n📖 getProfile():", pName, "-", pAge.toString(), "tuoi");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
