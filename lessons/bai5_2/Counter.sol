// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title Counter
 * @dev Contract đơn giản để đếm, dùng làm ví dụ trong bài 5.2
 *      Nguồn: https://github.com/appscyclone/ac-hardhat-template
 */
contract Counter {
    uint public count;

    /// @notice Tăng biến đếm lên 1
    function increment() public {
        count += 1;
    }

    /// @notice Trả về giá trị đếm hiện tại
    function getCount() public view returns (uint) {
        return count;
    }
}
