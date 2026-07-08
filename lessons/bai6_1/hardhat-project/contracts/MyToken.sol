// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MTK") {
        // Mint 1,000,000 tokens to deployer
        // ERC20 uses 18 decimals by default, so we multiply by 10^18
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }
}
