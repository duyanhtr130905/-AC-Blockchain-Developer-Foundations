import { ethers } from "hardhat";

async function main() {
  const [deployer, student1, student2] = await ethers.getSigners();
  console.log("=".repeat(50));
  console.log("Bai 4.1 - StudentRegistry Contract");
  console.log("=".repeat(50));
  console.log("Deployer:", deployer.address);

  // ── Deploy ──────────────────────────────────────────
  const StudentRegistry = await ethers.getContractFactory("StudentRegistry");
  const registry = await StudentRegistry.deploy();
  await registry.waitForDeployment();
  const addr = await registry.getAddress();
  console.log("✅ StudentRegistry deployed to:", addr);

  // ── Interact via ethers.js ───────────────────────────

  // Sinh viên 1 tự đăng ký
  console.log("\n📝 student1 register('Tran Thi B', 20)...");
  const tx1 = await registry.connect(student1).register("Tran Thi B", 20);
  const receipt1 = await tx1.wait();
  console.log("   Tx hash:", tx1.hash);

  // Đọc event StudentRegistered
  const iface = registry.interface;
  if (receipt1) {
    for (const log of receipt1.logs) {
      try {
        const parsed = iface.parseLog(log);
        if (parsed?.name === "StudentRegistered") {
          console.log(`   Event: StudentRegistered(${parsed.args[0]}, ${parsed.args[1]}, ${parsed.args[2]})`);
        }
      } catch {}
    }
  }

  // Sinh viên 2 tự đăng ký
  console.log("\n📝 student2 register('Le Van C', 22)...");
  await (await registry.connect(student2).register("Le Van C", 22)).wait();

  // Đọc thông tin
  const [name1, age1, reg1] = await registry.getStudent(student1.address);
  console.log("\n📖 getStudent(student1):", name1, age1.toString(), reg1);

  const [name2, age2, reg2] = await registry.getStudent(student2.address);
  console.log("📖 getStudent(student2):", name2, age2.toString(), reg2);

  // Thử đăng ký lần 2 → revert
  console.log("\n🚫 student1 register lại → expect revert...");
  try {
    await registry.connect(student1).register("Tran Thi B", 20);
  } catch (e: any) {
    console.log("   Revert:", e.reason ?? e.message);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
