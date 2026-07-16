import { expect } from "chai";
import { ethers } from "hardhat";
import { StudentRegistryV2 } from "../typechain";

describe("StudentRegistryV2 Contract (Bai 4.2)", function () {
  let registry: StudentRegistryV2;
  let owner: any;
  let student1: any;
  let nonOwner: any;

  beforeEach(async function () {
    [owner, student1, nonOwner] = await ethers.getSigners();
    const StudentRegistryV2Factory = await ethers.getContractFactory("StudentRegistryV2");
    registry = (await StudentRegistryV2Factory.deploy()) as unknown as StudentRegistryV2;
    await registry.waitForDeployment();
  });

  it("Should allow owner to register a student", async function () {
    await expect(registry.connect(owner).registerStudent(student1.address, "Alice", 20))
      .to.emit(registry, "StudentAdded")
      .withArgs(student1.address, "Alice", 20);

    const [name, age, isReg] = await registry.getStudent(student1.address);
    expect(name).to.equal("Alice");
    expect(age).to.equal(20);
    expect(isReg).to.be.true;
  });

  it("Should revert if non-owner tries to register a student", async function () {
    await expect(
      registry.connect(nonOwner).registerStudent(student1.address, "Alice", 20)
    ).to.be.revertedWith("Chi owner moi co quyen thuc hien!");
  });

  it("Should revert if student is already registered", async function () {
    await registry.connect(owner).registerStudent(student1.address, "Alice", 20);
    await expect(
      registry.connect(owner).registerStudent(student1.address, "Bob", 22)
    ).to.be.revertedWith("Sinh vien da duoc dang ky!");
  });
});
