import { expect } from "chai";
import { ethers } from "hardhat";
import { Profile } from "../typechain";

describe("Profile Contract (Bai 3.1)", function () {
  let profile: Profile;

  beforeEach(async function () {
    const ProfileFactory = await ethers.getContractFactory("Profile");
    profile = (await ProfileFactory.deploy()) as unknown as Profile;
    await profile.waitForDeployment();
  });

  it("Should set and get profile correct name and age", async function () {
    await profile.setProfile("Bob", 25);
    const [name, age] = await profile.getProfile();
    expect(name).to.equal("Bob");
    expect(age).to.equal(25);
  });

  it("Should revert if name is empty", async function () {
    await expect(profile.setProfile("", 25)).to.be.revertedWith("Ten khong duoc de trong!");
  });

  it("Should revert if age is 0", async function () {
    await expect(profile.setProfile("Bob", 0)).to.be.revertedWith("Tuoi phai lon hon 0!");
  });
});
