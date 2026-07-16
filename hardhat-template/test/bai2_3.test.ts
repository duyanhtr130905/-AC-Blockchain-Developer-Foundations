import { expect } from "chai";
import { ethers } from "hardhat";
import { Welcome } from "../typechain";

describe("Welcome Contract (Bai 2.3)", function () {
  let welcome: Welcome;
  let deployer: any;

  beforeEach(async function () {
    [deployer] = await ethers.getSigners();
    const WelcomeFactory = await ethers.getContractFactory("Welcome");
    welcome = (await WelcomeFactory.deploy("Hello World!")) as unknown as Welcome;
    await welcome.waitForDeployment();
  });

  it("Should set the initial greeting", async function () {
    expect(await welcome.getGreeting()).to.equal("Hello World!");
  });

  it("Should set the correct deployer", async function () {
    const [greeting, dep] = await welcome.getGreetingWithDeployer();
    expect(greeting).to.equal("Hello World!");
    expect(dep).to.equal(deployer.address);
  });
});
