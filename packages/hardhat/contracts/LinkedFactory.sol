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
contract LinkedFactory is Ownable, CCIPReceiver {
	address public router;
	uint64 public networkSelector;
	address public registrar;

  	struct Network {
		address router; 	// Chainlink CCIP router
		address registrar; 	// Registrar on another blockchain
		address factory;
	}

	uint64[] public destNetworkSelectors;

	// selector => Network Param
	mapping(uint64 => Network) public destNetworks;
	// original nft => owner|creator
	mapping(address => address) public nftAdmin;
	mapping(address => address) public wrappers; // no need to pre-compute everytime

	uint64 private tempChainId;

	event X_Setup(uint64 selector, address nftAddress, bytes32 messageId);
	event X_SetupOne(uint64 selector, address nftAddress, bytes32 messageId);
	event Linked(address originalAddr, address nftAddress);

	modifier onlyNftAdmin(address nftAddr) {
		require(msg.sender == nftAdmin[nftAddr], "not admin");
		_;
	}

	// Todo get chainlink receiver and pass networkParams.router
	constructor (
		uint64 _networkSelector,
		address _router,
		uint64[] memory destSelectors,
		address[] memory destRouters) Ownable(msg.sender) CCIPReceiver(_router) {

		require(destSelectors.length == destRouters.length, "mismatch length");

		router = _router;
		networkSelector = _networkSelector;
		destNetworkSelectors = destSelectors;

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

	function setFactory(uint64 _selector, address _factory) external onlyOwner {
		require(destNetworks[_selector].router != address(0), "unsupported network");
		// Enable in production
		// require(destNetworks[_selector].factory == address(0), "registrar exists");

		destNetworks[_selector].factory = _factory;
	}

	function _ccipReceive(
		Client.Any2EVMMessage memory message
	) internal override {
		require(message.sourceChainSelector != networkSelector, "called from same network");
		address sourceRegistrar = abi.decode(message.sender, (address));
		require(destNetworks[message.sourceChainSelector].registrar == sourceRegistrar, "not registrar");

		tempChainId = message.sourceChainSelector;
		(bool success, ) = address(this).call(message.data);
		tempChainId = 0;
		require(success);
	}

	function xSetup(
		address nftAddr,
		string memory name,
		string memory symbol,
		uint64[] memory selectors,
		address[] memory linkedNftAddrs
	) private {
		LinkedNft linkedNft = new LinkedNft{salt: generateSalt(address(this), nftAddr)}(name, symbol, nftAddr, router);
		linkedNft.setSelector(networkSelector);
		// first network selector is the original chain. it must be same everywhere.
		// so let's keep the order in all blockchains.
		linkedNft.setup(selectors, linkedNftAddrs);
		linkedNft.setupOne(networkSelector, address(linkedNft));

		emit Linked(nftAddr, address(linkedNft));
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
