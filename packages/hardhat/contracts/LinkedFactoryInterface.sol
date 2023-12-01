//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import { IRouterClient } from "./chainlink/ccip/interfaces/IRouterClient.sol";
import { Client } from "./chainlink/ccip/libraries/Client.sol";
import { CCIPReceiver } from "./chainlink/ccip/applications/CCIPReceiver.sol";
import { LinkedNft } from "./LinkedNft.sol";

// todo keep the selector of this chain

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author Medet Ahmetson
 */
interface LinkedFactoryInterface {
	function precomputeLinkedNft(address registrar, string memory _name,
		string memory _symbol,
		address nftAddress,
		address _router) external pure returns(address);
}
