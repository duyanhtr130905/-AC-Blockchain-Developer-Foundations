// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Welcome {
    string public greeting;
    address public immutable deployer;

    constructor(string memory initialGreeting) {
        greeting = initialGreeting;
        deployer = msg.sender;
    }

    function getGreeting() public view returns (string memory) {
        return greeting;
    }

    function getGreetingWithDeployer() public view returns (string memory, address) {
        return (greeting, deployer);
    }
}
