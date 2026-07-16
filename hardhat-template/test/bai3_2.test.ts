import { expect } from "chai";
import { ethers } from "hardhat";
import { VotingEligibility } from "../typechain";

describe("VotingEligibility Contract (Bai 3.2)", function () {
  let votingEligibility: VotingEligibility;
  let owner: any;
  let nonOwner: any;

  beforeEach(async function () {
    [owner, nonOwner] = await ethers.getSigners();
    const VotingEligibilityFactory = await ethers.getContractFactory("VotingEligibility");
    votingEligibility = (await VotingEligibilityFactory.deploy()) as unknown as VotingEligibility;
    await votingEligibility.waitForDeployment();
  });

  it("Should default minAge to 18", async function () {
    expect(await votingEligibility.minAge()).to.equal(18);
  });

  it("Should check eligibility correctly", async function () {
    expect(await votingEligibility.checkEligibility(17)).to.be.false;
    expect(await votingEligibility.checkEligibility(18)).to.be.true;
    expect(await votingEligibility.checkEligibility(20)).to.be.true;
  });

  it("Should allow owner to update minAge", async function () {
    await expect(votingEligibility.connect(owner).updateMinAge(21))
      .to.emit(votingEligibility, "MinAgeUpdated")
      .withArgs(18, 21);
    expect(await votingEligibility.minAge()).to.equal(21);
  });

  it("Should revert if non-owner tries to update minAge", async function () {
    await expect(votingEligibility.connect(nonOwner).updateMinAge(21)).to.be.revertedWith(
      "Chi owner moi duoc cap nhat!"
    );
  });
});
