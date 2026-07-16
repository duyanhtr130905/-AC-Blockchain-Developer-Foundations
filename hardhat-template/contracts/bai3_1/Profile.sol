// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title Profile - Bài 3.1: Biến state và hàm cơ bản
/// @notice Lưu tên và tuổi người dùng
contract Profile {
    string public name;
    uint public age;

    /// @notice Cập nhật thông tin profile
    function setProfile(string memory _name, uint _age) public {
        require(bytes(_name).length > 0, "Ten khong duoc de trong!");
        require(_age > 0, "Tuoi phai lon hon 0!");
        name = _name;
        age = _age;
    }

    /// @notice Lấy toàn bộ thông tin profile
    function getProfile() public view returns (string memory, uint) {
        return (name, age);
    }
}
