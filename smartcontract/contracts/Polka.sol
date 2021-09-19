// contracts/Polka.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Polka is ERC20 {
    constructor() ERC20("XP", "XP") {
        _mint(msg.sender, 40000000 * 1 ether);
    }
}