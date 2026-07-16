// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title Voting - Bài 4.3: keccak256 candidateId
/// @notice Hệ thống bầu cử: admin tạo ứng viên, user vote 1 lần
contract Voting {
    address public owner;

    struct Candidate {
        string name;
        uint voteCount;
    }

    uint public candidateCount;

    /// @dev Key = keccak256(abi.encodePacked(name))
    mapping(bytes32 => Candidate) public candidates;
    mapping(address => bool) public hasVoted;

    event CandidateAdded(bytes32 indexed candidateId, string name);
    event Voted(address indexed voter, bytes32 indexed candidateId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Chi admin moi co quyen thuc hien!");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Thêm ứng viên mới, ID được tạo bằng keccak256 của tên
    function addCandidate(string memory name) public onlyOwner {
        require(bytes(name).length > 0, "Ten ung vien khong duoc de trong!");
        bytes32 candidateId = keccak256(abi.encodePacked(name));
        require(bytes(candidates[candidateId].name).length == 0, "Ung vien da ton tai!");

        candidateCount++;
        candidates[candidateId] = Candidate({ name: name, voteCount: 0 });

        emit CandidateAdded(candidateId, name);
    }

    /// @notice Vote cho ứng viên bằng candidateId (bytes32)
    function vote(bytes32 candidateId) public {
        require(!hasVoted[msg.sender], "Ban da vote roi!");
        require(bytes(candidates[candidateId].name).length > 0, "Ung vien khong ton tai!");

        hasVoted[msg.sender] = true;
        candidates[candidateId].voteCount++;

        emit Voted(msg.sender, candidateId);
    }

    /// @notice Lấy thông tin ứng viên theo candidateId
    function getCandidate(bytes32 candidateId)
        public
        view
        returns (string memory name, uint voteCount)
    {
        require(bytes(candidates[candidateId].name).length > 0, "Ung vien khong ton tai!");
        Candidate memory c = candidates[candidateId];
        return (c.name, c.voteCount);
    }

    /// @notice Helper: tính keccak256 ID từ tên ứng viên
    function getCandidateId(string memory name) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(name));
    }
}
