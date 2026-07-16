// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title VotingEligibility - Bài 3.2: Điều kiện và require
/// @notice Kiểm tra đủ tuổi bầu cử, chỉ owner mới đổi được tuổi tối thiểu
contract VotingEligibility {
    uint public minAge = 18;
    address public immutable owner;

    event MinAgeUpdated(uint oldAge, uint newAge);

    constructor() {
        owner = msg.sender;
    }

    /// @notice Kiểm tra xem tuổi có đủ điều kiện bầu cử không
    function checkEligibility(uint age) public view returns (bool) {
        return age >= minAge;
    }

    /// @notice Chỉ owner mới được thay đổi tuổi tối thiểu
    function updateMinAge(uint newMinAge) public {
        require(msg.sender == owner, "Chi owner moi duoc cap nhat!");
        require(newMinAge > 0, "Tuoi toi thieu phai lon hon 0!");
        emit MinAgeUpdated(minAge, newMinAge);
        minAge = newMinAge;
    }
}
