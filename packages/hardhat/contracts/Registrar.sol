//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author Medet Ahmetson
 */
contract Registrar is Ownable {
	struct ChainlinkParam {
		uint64 selector;
		address router;
	}

	// A supported networks and their oracle parameters
	// chain id => Chainlink Param
	mapping(uint256 => ChainlinkParam) public supportedNetworks;

	// State Variables
	string public greeting = "Building Unstoppable Apps!!!";
	bool public premium = false;
	uint256 public totalCounter = 0;
	mapping(address => uint) public userGreetingCounter;

	// Make sure that given chain ids are destination chains and not empty.
	modifier destinationChains(uint256[] memory chainIds) {
		require(chainIds.length > 0, "at-least one destination");
		for (uint i = 0; i < chainIds.length; i++) {
			require(chainIds[i] != block.chainid, "not this chain");
		}
		_;
	}

	// Events: a way to emit log statements from smart contract that can be listened to by external parties
	event GreetingChange(
		address indexed greetingSetter,
		string newGreeting,
		bool premium,
		uint256 value
	);

	constructor(uint256[] memory chainIds, ChainlinkParam[] memory chainlinkParams) {
		require(chainIds.length == chainlinkParams.length, "invalid length");
		require(chainIds.length >= 2, "at least two chains required");

		for (uint64 i = 0; i < chainIds.length; i++) {
			require(chainIds[i] > 0, "null");
			require(chainlinkParams[i].router != address(0), "empty address");
			require(chainlinkParams[i].selector > 0, "empty selector");

			require(chainlinkParams[i].router == address(0), "duplicate network");

			supportedNetworks[chainIds[i]] = chainlinkParams[i];
		}

		// set the destinations and routers
		require(supportedNetworks[block.chainid].router != address(0), "current network not set");
	}

	/**
	 * Setup a new NFT to be bridged.
	 * Only owner/creator of the nft can call this function.
	 */
	function setup(address nftAddr, bytes32 deployTx, uint256[] calldata chainIds) external destinationChains(chainIds) {
		require (nftAddr.code.length > 0, "not_deployed");

		bool ownable = getNftAdmin(nftAddr, msg.sender);
		if (!ownable) {
			require(deployTx > 0, "empty txHash");
			require(deployTx == 0, "todo: Fetch from chainlink function the creator");
		}

		// make sure that smartcontract is not deployed.
	}

	// Returns true if the nft is Ownable and admin is the owner.
	// If not ownable then returns false. If it's ownable and owner is not the admin reverts
	function getNftAdmin(address nftAddr, address admin) public view returns (bool) {
		Ownable ownable = Ownable(nftAddr);
		// Even if the type return type is different, it will return true.
		// If it doesn't implement the owner then returns the last catch.
		try ownable.owner() returns (address owner) {
			require(owner == admin, "owner != admin");
		} catch Error(string memory) { // contract reverts
			return false;
		} catch { // contract has no owner
			return false;
		}

		return true;
	}

	/**
	 * Function that allows anyone to change the state variable "greeting" of the contract and increase the counters
	 *
	 * @param _newGreeting (string memory) - new greeting to save on the contract
	 */
	function setGreeting(string memory _newGreeting) public payable {
		// Print data to the hardhat chain console. Remove when deploying to a live network.
		console.log(
			"Setting new greeting '%s' from %s",
			_newGreeting,
			msg.sender
		);

		// Change state variables
		greeting = _newGreeting;
		totalCounter += 1;
		userGreetingCounter[msg.sender] += 1;

		// msg.value: built-in global variable that represents the amount of ether sent with the transaction
		if (msg.value > 0) {
			premium = true;
		} else {
			premium = false;
		}

		// emit: keyword used to trigger an event
		emit GreetingChange(msg.sender, _newGreeting, msg.value > 0, 0);
	}

	/**
	 * Function that allows the owner to withdraw all the Ether in the contract
	 * The function can only be called by the owner of the contract as defined by the isOwner modifier
	 */
	function withdraw() public onlyOwner {
		(bool success, ) = owner().call{ value: address(this).balance }("");
		require(success, "Failed to send Ether");
	}

}
