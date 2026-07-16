import { expect } from "chai";
import { ethers } from "hardhat";
import { StudentRegistry } from "../typechain";

describe("StudentRegistry Contract (Bai 4.1)", function () {
  let registry: StudentRegistry;
  let student1: any;

  beforeEach(async function () {
    [, student1] = await ethers.getSigners();
    const StudentRegistryFactory = await ethers.getContractFactory("StudentRegistry");
    registry = (await StudentRegistryFactory.deploy()) as unknown as StudentRegistry;
    await registry.waitForDeployment();
  });

  it("Should register a student successfully", async function () {
    await expect(registry.connect(student1).register("Alice", 20))
      .to.emit(registry, "StudentRegistered")
      .withArgs(student1.address, "Alice", 20);

    const [name, age, isReg] = await registry.getStudent(student1.address);
    expect(name).to.equal("Alice");
    expect(age).to.equal(20);
    expect(isReg).to.be.true;

    expect(await registry.isStudentRegistered(student1.address)).to.be.true;
  });

  it("Should revert if registering again", async function () {
    await registry.connect(student1).register("Alice", 20);
    await expect(registry.connect(student1).register("Alice", 20)).to.be.revertedWith(
      "Da dang ky roi!"
    );
  });

  it("Should revert if name is empty", async function () {
    await expect(registry.connect(student1).register("", 20)).to.be.revertedWith(
      "Ten khong duoc de trong!"
    );
  });
});
