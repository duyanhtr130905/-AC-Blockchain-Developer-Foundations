import { expect } from "chai";
import { ethers } from "hardhat";
import { Voting } from "../typechain";

describe("Voting Contract (Bai 4.3)", function () {
  let voting: Voting;
  let owner: any;
  let voter1: any;
  let voter2: any;

  beforeEach(async function () {
    [owner, voter1, voter2] = await ethers.getSigners();
    const VotingFactory = await ethers.getContractFactory("Voting");
    voting = (await VotingFactory.deploy()) as unknown as Voting;
    await voting.waitForDeployment();
  });

  it("Should allow owner to add candidates and generate correct keccak256 IDs", async function () {
    const candidateName = "Alice";
    const expectedId = await voting.getCandidateId(candidateName);

    await expect(voting.connect(owner).addCandidate(candidateName))
      .to.emit(voting, "CandidateAdded")
      .withArgs(expectedId, candidateName);

    expect(await voting.candidateCount()).to.equal(1);

    const [name, voteCount] = await voting.getCandidate(expectedId);
    expect(name).to.equal(candidateName);
    expect(voteCount).to.equal(0);
  });

  it("Should allow voting and increase vote counts", async function () {
    const alice = "Alice";
    const bob = "Bob";
    await voting.connect(owner).addCandidate(alice);
    await voting.connect(owner).addCandidate(bob);

    const aliceId = await voting.getCandidateId(alice);
    const bobId = await voting.getCandidateId(bob);

    // voter1 votes Alice
    await expect(voting.connect(voter1).vote(aliceId))
      .to.emit(voting, "Voted")
      .withArgs(voter1.address, aliceId);

    // voter2 votes Bob
    await voting.connect(voter2).vote(bobId);

    expect(await voting.hasVoted(voter1.address)).to.be.true;
    expect(await voting.hasVoted(voter2.address)).to.be.true;

    const [, aliceVotes] = await voting.getCandidate(aliceId);
    const [, bobVotes] = await voting.getCandidate(bobId);

    expect(aliceVotes).to.equal(1);
    expect(bobVotes).to.equal(1);
  });

  it("Should revert if voting twice", async function () {
    const alice = "Alice";
    await voting.connect(owner).addCandidate(alice);
    const aliceId = await voting.getCandidateId(alice);

    await voting.connect(voter1).vote(aliceId);
    await expect(voting.connect(voter1).vote(aliceId)).to.be.revertedWith("Ban da vote roi!");
  });

  it("Should revert if voting for non-existent candidate", async function () {
    const fakeId = ethers.keccak256(ethers.toUtf8Bytes("Fake"));
    await expect(voting.connect(voter1).vote(fakeId)).to.be.revertedWith("Ung vien khong ton tai!");
  });
});
