import { ethers } from "hardhat";

async function main() {
  const [admin, voter1, voter2, voter3] = await ethers.getSigners();
  console.log("=".repeat(50));
  console.log("Bai 4.3 - Voting Contract (keccak256 candidateId)");
  console.log("=".repeat(50));
  console.log("Admin:", admin.address);

  // ── Deploy ──────────────────────────────────────────
  const Voting = await ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();
  await voting.waitForDeployment();
  const addr = await voting.getAddress();
  console.log("✅ Voting deployed to:", addr);

  // ── Thêm ứng viên bằng admin ─────────────────────────
  const candidateNames = ["Alice", "Bob", "Charlie"];
  console.log("\n📝 Admin thêm ứng viên...");
  for (const name of candidateNames) {
    const tx = await voting.connect(admin).addCandidate(name);
    const receipt = await tx.wait();
    const iface = voting.interface;
    if (receipt) {
      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed?.name === "CandidateAdded") {
            console.log(`   ✅ CandidateAdded: "${parsed.args[1]}" → ID: ${parsed.args[0]}`);
          }
        } catch {}
      }
    }
  }
  console.log("📖 candidateCount:", (await voting.candidateCount()).toString());

  // ── Lấy candidateId bằng helper ─────────────────────
  const aliceId = await voting.getCandidateId("Alice");
  const bobId = await voting.getCandidateId("Bob");
  const charlieId = await voting.getCandidateId("Charlie");
  console.log("\n🔑 getCandidateId:");
  console.log("   Alice   :", aliceId);
  console.log("   Bob     :", bobId);
  console.log("   Charlie :", charlieId);

  // ── Vote ─────────────────────────────────────────────
  console.log("\n🗳️  Vote:");
  const votes = [
    { voter: voter1, id: aliceId, label: "voter1 → Alice" },
    { voter: voter2, id: aliceId, label: "voter2 → Alice" },
    { voter: voter3, id: bobId, label: "voter3 → Bob" },
  ];
  for (const { voter, id, label } of votes) {
    const tx = await voting.connect(voter).vote(id);
    await tx.wait();
    console.log(`   ✅ ${label}`);
  }

  // ── Kết quả ──────────────────────────────────────────
  console.log("\n📊 Kết quả bầu cử:");
  for (const name of candidateNames) {
    const id = await voting.getCandidateId(name);
    const [cName, voteCount] = await voting.getCandidate(id);
    console.log(`   ${cName.padEnd(10)}: ${voteCount.toString()} phiếu`);
  }

  // ── Vote lần 2 → revert ──────────────────────────────
  console.log("\n🚫 voter1 vote lần 2 → expect revert...");
  try {
    await voting.connect(voter1).vote(bobId);
  } catch (e: any) {
    console.log("   Revert:", e.reason ?? e.message);
  }

  // ── Non-admin thêm ứng viên → revert ─────────────────
  console.log("\n🚫 voter1 thêm ứng viên → expect revert...");
  try {
    await voting.connect(voter1).addCandidate("Hacker");
  } catch (e: any) {
    console.log("   Revert:", e.reason ?? e.message);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
