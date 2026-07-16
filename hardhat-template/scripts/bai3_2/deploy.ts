import { ethers } from "hardhat";

async function main() {
  const [deployer, user1] = await ethers.getSigners();
  console.log("=".repeat(50));
  console.log("Bai 3.2 - VotingEligibility Contract");
  console.log("=".repeat(50));
  console.log("Deployer:", deployer.address);

  // ── Deploy ──────────────────────────────────────────
  const VotingEligibility = await ethers.getContractFactory("VotingEligibility");
  const contract = await VotingEligibility.deploy();
  await contract.waitForDeployment();
  const addr = await contract.getAddress();
  console.log("✅ VotingEligibility deployed to:", addr);

  // ── Interact via ethers.js ───────────────────────────
  const minAge = await contract.minAge();
  console.log("\n📖 minAge() ban đầu:", minAge.toString());

  // Kiểm tra eligibility
  const cases = [15, 18, 21, 17];
  console.log("\n🔍 Kiểm tra checkEligibility:");
  for (const age of cases) {
    const eligible = await contract.checkEligibility(age);
    console.log(`   tuoi ${age}: ${eligible ? "✅ Du dieu kien" : "❌ Chua du tuoi"}`);
  }

  // Owner cập nhật tuổi tối thiểu
  console.log("\n📝 Owner updateMinAge(21)...");
  const tx = await contract.connect(deployer).updateMinAge(21);
  const receipt = await tx.wait();
  // Lấy event MinAgeUpdated
  const iface = contract.interface;
  if (receipt) {
    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog(log);
        if (parsed?.name === "MinAgeUpdated") {
          console.log(`   Event: MinAgeUpdated(${parsed.args[0]} → ${parsed.args[1]})`);
        }
      } catch {}
    }
  }

  const newMin = await contract.minAge();
  console.log("📖 minAge() sau update:", newMin.toString());

  // Non-owner thử cập nhật → revert
  console.log("\n🚫 user1 thử updateMinAge(16) → expect revert...");
  try {
    await contract.connect(user1).updateMinAge(16);
  } catch (e: any) {
    console.log("   Revert message:", e.reason ?? e.message);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
