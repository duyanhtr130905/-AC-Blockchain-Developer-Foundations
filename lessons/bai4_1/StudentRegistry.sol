// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StudentRegistry {
    struct Student {
        string name;
        uint age;
        bool isRegistered;
    }

    mapping(address => Student) private students;

    function register(string memory name, uint age) public {
        require(!students[msg.sender].isRegistered, "Da dang ky roi!");
        require(bytes(name).length > 0, "Ten khong duoc de trong!");
        require(age > 0, "Tuoi phai lon hon 0!");

        students[msg.sender] = Student({
            name: name,
            age: age,
            isRegistered: true
        });
    }

    function getStudent(address user)
        public
        view
        returns (string memory name, uint age, bool isRegistered)
    {
        Student memory s = students[user];
        return (s.name, s.age, s.isRegistered);
    }

    function isStudentRegistered(address user) public view returns (bool) {
        return students[user].isRegistered;
    }
}
