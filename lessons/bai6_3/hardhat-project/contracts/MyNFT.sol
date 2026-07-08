// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, Ownable {
    uint256 public nextTokenId;

    constructor() ERC721("MyNFT", "MNFT") Ownable(msg.sender) {
        nextTokenId = 0;
    }

    /// @notice Mint một NFT cho địa chỉ `to`. Chỉ owner gọi được.
    /// @param to Địa chỉ nhận NFT
    function mint(address to) public onlyOwner {
        _safeMint(to, nextTokenId);
        nextTokenId++;
    }
}
