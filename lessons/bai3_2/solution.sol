// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VotingEligibility {
    uint public minAge = 18;
    address public immutable owner;

    constructor() {
        owner = msg.sender;
    }

    function checkEligibility(uint age) public view returns (bool) {
        if (age >= minAge) {
            return true;
        }

        return false;
    }

    function updateMinAge(uint newMinAge) public {
        require(msg.sender == owner, "Only deployer can update min age");
        minAge = newMinAge;
    }
}
