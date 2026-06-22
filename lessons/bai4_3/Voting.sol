// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public owner;

    struct Candidate {
        string name;
        uint voteCount;
    }

    uint public candidateCount;

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public hasVoted;

    event Voted(address indexed voter, uint indexed candidateId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Chi admin moi co quyen thuc hien!");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addCandidate(string memory name) public onlyOwner {
        require(bytes(name).length > 0, "Ten ung vien khong duoc de trong!");
        candidateCount++;
        candidates[candidateCount] = Candidate({
            name: name,
            voteCount: 0
        });
    }

    function vote(uint candidateId) public {
        require(!hasVoted[msg.sender], "Ban da vote roi!");
        require(candidateId > 0 && candidateId <= candidateCount, "Ung vien khong ton tai!");

        hasVoted[msg.sender] = true;
        candidates[candidateId].voteCount++;

        emit Voted(msg.sender, candidateId);
    }

    function getCandidate(uint candidateId)
        public
        view
        returns (string memory name, uint voteCount)
    {
        require(candidateId > 0 && candidateId <= candidateCount, "Ung vien khong ton tai!");
        Candidate memory c = candidates[candidateId];
        return (c.name, c.voteCount);
    }
}
