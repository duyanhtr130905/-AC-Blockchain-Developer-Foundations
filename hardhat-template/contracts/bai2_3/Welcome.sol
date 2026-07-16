// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title Welcome - Bài 2.3: Hàm Solidity đơn giản
/// @notice Lưu lời chào và địa chỉ người deploy
contract Welcome {
    string public greeting;
    address public immutable deployer;

    constructor(string memory initialGreeting) {
        greeting = initialGreeting;
        deployer = msg.sender;
    }

    /// @notice Trả về lời chào hiện tại
    function getGreeting() public view returns (string memory) {
        return greeting;
    }

    /// @notice Trả về lời chào kèm địa chỉ người deploy
    function getGreetingWithDeployer() public view returns (string memory, address) {
        return (greeting, deployer);
    }
}
