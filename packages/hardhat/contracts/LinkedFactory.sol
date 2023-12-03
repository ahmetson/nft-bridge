//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import { IRouterClient } from "./chainlink/ccip/interfaces/IRouterClient.sol";
import { Client } from "./chainlink/ccip/libraries/Client.sol";
import { CCIPReceiver } from "./chainlink/ccip/applications/CCIPReceiver.sol";
import { LinkedNft } from "./LinkedNft.sol";

// todo keep the selector of this chain

/**
 * A smartcontract that creates new NFTs.
 * @author Medet Ahmetson
 */
contract LinkedFactory is Ownable, CCIPReceiver {
	address public router;
	uint64 public networkSelector;
	address public registrar;

  	struct Network {
		address router; 	// Chainlink CCIP router
		address registrar; 	// Registrar on another blockchain
	}

	// selector => Network Param
	mapping(uint64 => Network) public destNetworks;

	uint64 private tempChainId;

	event X_Setup(uint64 selector, address nftAddress, bytes32 messageId);
	event X_SetupOne(uint64 selector, address nftAddress, bytes32 messageId);
	event Linked(address originalAddr, address nftAddress);
	event Received(bytes sourceRouter, bytes32 messageId, uint64 sourceChainSelector);
	event LinkNftCreated(bytes32 salt, string name, string symbol, address nftAddr, address router);
	event LintedNfts(uint64[] selectors, address[] linkedNftAddrs);

	event LinkError(string reason);
	event UnknownError(string reason);

	// Todo get chainlink receiver and pass networkParams.router
	constructor (
		uint64 _networkSelector,
		address _router,
		uint64[] memory destSelectors,
		address[] memory destRouters
	) Ownable(msg.sender) CCIPReceiver(_router) {

		require(destSelectors.length == destRouters.length, "mismatch length");

		router = _router;
		networkSelector = _networkSelector;

		for (uint64 i = 0; i < destSelectors.length; i++) {
			destNetworks[destSelectors[i]].router = destRouters[i];
		}
	}

	/**
	 * Set's the registrar on other blockchain.
	 */
	function setRegistrar(uint64 _selector, address _registrar) external onlyOwner {
		if (_selector == networkSelector) {
			registrar = _registrar;
		}

		require(destNetworks[_selector].router != address(0), "unsupported network");
		// Enable in production
		// require(destNetworks[_selector].registrar == address(0), "registrar exists");

		destNetworks[_selector].registrar = _registrar;
	}

	function _ccipReceive(
		Client.Any2EVMMessage memory message
	) internal override {
		address sourceRegistrar = abi.decode(message.sender, (address));
		require(destNetworks[message.sourceChainSelector].registrar == sourceRegistrar, "not the registrar");

		(bool success, ) = address(this).call(message.data);
		require(success);
	}

	function xSetup(
		address nftAddr,
		string memory name,
		string memory symbol,
		uint64[] memory selectors,
		address[] memory linkedNftAddrs
	) public {
		bytes32 salt = generateSalt(address(this), nftAddr);
		emit LinkNftCreated(salt, name, symbol, nftAddr, router);
		emit LintedNfts(selectors, linkedNftAddrs);

		try new LinkedNft{salt: salt}(name, symbol, nftAddr, router) returns (LinkedNft linkedNft) {
			// first network selector is the original chain. it must be same everywhere.
			// so let's keep the order in all blockchains.
			linkedNft.setup(selectors, linkedNftAddrs);
			linkedNft.setupOne(networkSelector, address(linkedNft));

			emit Linked(nftAddr, address(linkedNft));
		} catch Error(string memory reason) {
			// catch failing revert() and require()
			emit LinkError(string(reason));
		} catch (bytes memory reason) {
			// catch failing assert()
			emit UnknownError(string(reason));
		}
	}

	function generateSalt(address _registrar, address _nftAddr) public pure returns(bytes32) {
		return keccak256(abi.encodePacked(_registrar, _nftAddr));
	}

	function precomputeLinkedNft(address _registrar, string memory _name,
		string memory _symbol,
		address nftAddress,
		address _router) public pure returns(address) {
		bytes32 salt = generateSalt(_registrar, nftAddress);

		address predictedAddress = address(uint160(uint(keccak256(abi.encodePacked(
			bytes1(0xff),
			_registrar, // address of the smartcontract
			salt,
			keccak256(abi.encodePacked(
				type(LinkedNft).creationCode,
				abi.encode(_name, _symbol, nftAddress, _router)
			))
		)))));

		return predictedAddress;
	}
}
