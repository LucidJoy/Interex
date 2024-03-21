// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Interex20 is ERC20, ERC20Burnable, Ownable {
    address public prevOwner;

    event Minted(address receiver, uint256 amount);

    constructor() ERC20("Interex20", "INTX") {}

    function mint(address _receiver, uint256 _amount) public payable {
        _mint(_receiver, _amount * 10 ** decimals());
        emit Minted(_receiver, _amount);
    }

    function changeOwner(address _addr) public onlyOwner {
        prevOwner = owner();
        transferOwnership(_addr);
        emit OwnershipTransferred(prevOwner, owner());
    }
}
