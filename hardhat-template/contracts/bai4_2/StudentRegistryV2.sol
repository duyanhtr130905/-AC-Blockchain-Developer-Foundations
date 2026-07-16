// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title StudentRegistryV2 - Bài 4.2: Modifier và Event
/// @notice Chỉ owner mới được đăng ký sinh viên, log event mỗi lần thêm
contract StudentRegistryV2 {
    address public owner;

    struct Student {
        string name;
        uint age;
        bool isRegistered;
    }

    mapping(address => Student) private students;

    event StudentAdded(address indexed studentAddress, string name, uint age);

    modifier onlyOwner() {
        require(msg.sender == owner, "Chi owner moi co quyen thuc hien!");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Chỉ owner mới được đăng ký sinh viên mới
    function registerStudent(
        address studentAddress,
        string memory name,
        uint age
    ) public onlyOwner {
        require(!students[studentAddress].isRegistered, "Sinh vien da duoc dang ky!");
        require(bytes(name).length > 0, "Ten khong duoc de trong!");
        require(age > 0, "Tuoi phai lon hon 0!");

        students[studentAddress] = Student({
            name: name,
            age: age,
            isRegistered: true
        });

        emit StudentAdded(studentAddress, name, age);
    }

    /// @notice Lấy thông tin sinh viên theo địa chỉ
    function getStudent(address user)
        public
        view
        returns (string memory name, uint age, bool isRegistered)
    {
        Student memory s = students[user];
        return (s.name, s.age, s.isRegistered);
    }

    /// @notice Kiểm tra sinh viên đã được đăng ký chưa
    function isStudentRegistered(address user) public view returns (bool) {
        return students[user].isRegistered;
    }
}
