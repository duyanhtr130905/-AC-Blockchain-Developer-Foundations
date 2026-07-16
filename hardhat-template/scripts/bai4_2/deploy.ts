import { ethers } from "hardhat";

async function main() {
  const [owner, student1, stranger] = await ethers.getSigners();
  console.log("=".repeat(50));
  console.log("Bai 4.2 - StudentRegistryV2 Contract");
  console.log("=".repeat(50));
  console.log("Owner:", owner.address);

  // ── Deploy ──────────────────────────────────────────
  const StudentRegistryV2 = await ethers.getContractFactory("StudentRegistryV2");
  const registry = await StudentRegistryV2.deploy();
  await registry.waitForDeployment();
  const addr = await registry.getAddress();
  console.log("✅ StudentRegistryV2 deployed to:", addr);
  console.log("📖 owner():", await registry.owner());

  // ── Owner đăng ký sinh viên ──────────────────────────
  console.log("\n📝 Owner registerStudent(student1, 'Pham Thi D', 19)...");
  const tx = await registry.connect(owner).registerStudent(student1.address, "Pham Thi D", 19);
  const receipt = await tx.wait();

  // Đọc event StudentAdded
  const iface = registry.interface;
  if (receipt) {
    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog(log);
        if (parsed?.name === "StudentAdded") {
          console.log(`   Event: StudentAdded(${parsed.args[0]}, ${parsed.args[1]}, ${parsed.args[2]})`);
        }
      } catch {}
    }
  }

  // Đọc thông tin
  const [name, age, isReg] = await registry.getStudent(student1.address);
  console.log("\n📖 getStudent(student1):", name, age.toString(), "tuoi, isRegistered:", isReg);

  const registered = await registry.isStudentRegistered(student1.address);
  console.log("📖 isStudentRegistered(student1):", registered);

  // Stranger thử đăng ký → revert
  console.log("\n🚫 stranger thử registerStudent → expect revert...");
  try {
    await registry.connect(stranger).registerStudent(stranger.address, "Hacker", 25);
  } catch (e: any) {
    console.log("   Revert:", e.reason ?? e.message);
  }

  // Đăng ký trùng → revert
  console.log("\n🚫 Owner đăng ký student1 lần 2 → expect revert...");
  try {
    await registry.connect(owner).registerStudent(student1.address, "Pham Thi D", 19);
  } catch (e: any) {
    console.log("   Revert:", e.reason ?? e.message);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
