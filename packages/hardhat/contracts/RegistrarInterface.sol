//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author Medet Ahmetson
 */
interface RegistrarInterface {
	function linkedNfts(uint256, address) external view returns (address);
	function chainIdToSelector(uint256) external view returns(uint64);
	function selectorToChainId(uint64) external view returns(uint256);
	function isValidRegistrar(uint256, address) external view returns(bool);
}
