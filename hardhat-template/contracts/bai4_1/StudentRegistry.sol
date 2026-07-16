// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title StudentRegistry - Bài 4.1: Struct và Mapping
/// @notice Sinh viên tự đăng ký thông tin của mình
contract StudentRegistry {
    struct Student {
        string name;
        uint age;
        bool isRegistered;
    }

    mapping(address => Student) private students;

    event StudentRegistered(address indexed student, string name, uint age);

    /// @notice Sinh viên tự đăng ký (chỉ đăng ký được 1 lần)
    function register(string memory name, uint age) public {
        require(!students[msg.sender].isRegistered, "Da dang ky roi!");
        require(bytes(name).length > 0, "Ten khong duoc de trong!");
        require(age > 0, "Tuoi phai lon hon 0!");

        students[msg.sender] = Student({
            name: name,
            age: age,
            isRegistered: true
        });

        emit StudentRegistered(msg.sender, name, age);
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

    /// @notice Kiểm tra sinh viên đã đăng ký chưa
    function isStudentRegistered(address user) public view returns (bool) {
        return students[user].isRegistered;
    }
}
