//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import { IRouterClient } from "./chainlink/ccip/interfaces/IRouterClient.sol";
import { Client } from "./chainlink/ccip/libraries/Client.sol";
import { WrappedNft } from "./WrappedNft.sol";
import { SourceNftLib } from "./SourceNftLib.sol";
import { LinkedFactoryInterface } from "./LinkedFactoryInterface.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author Medet Ahmetson
 */
contract Registrar is Ownable {
	address public router;
	uint64 public networkSelector;
	address public factory;

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
		address[] memory destRouters) Ownable(msg.sender) {

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
		require(destNetworks[_selector].router != address(0), "unsupported network");
		// Enable in production
		// require(destNetworks[_selector].registrar == address(0), "registrar exists");

		destNetworks[_selector].registrar = _registrar;
	}

	function setFactory(uint64 _selector, address _factory) external onlyOwner {
		if (_selector == networkSelector) {
			factory = _factory;
		}
		require(destNetworks[_selector].router != address(0), "unsupported network");
		// Enable in production
		// require(destNetworks[_selector].factory == address(0), "registrar exists");

		destNetworks[_selector].factory = _factory;
	}

	/**
	 * Creates a new Wrapped NFT
	 * @param nftAddr original NFT to wrap
	 */
	function register(address nftAddr, bytes32 deployTx) external payable {
		require(nftAddr.code.length > 0, "not_deployed");

		bool ownable = getNftAdmin(nftAddr, msg.sender);
		if (!ownable) {
			require(deployTx > 0, "empty txHash");
			require(false, "todo: Fetch from chainlink function the creator");
		}

		string memory wrappedName = string.concat("Bridged", SourceNftLib.originalName(nftAddr));
		string memory wrappedSymbol = string.concat("b", SourceNftLib.originalName(nftAddr));

		address wrappedNft = precomputeWrappedNft(address(this), wrappedName, wrappedSymbol, nftAddr, router);
		require(wrappedNft.code.length == 0, "already set up");

		WrappedNft created = new WrappedNft{salt: generateSalt(address(this), nftAddr)}(wrappedName, wrappedSymbol, nftAddr, router);
		require(wrappedNft == address(created), "address mismatch");
		require(wrappedNft.code.length > 0, "not created");

		// call it from the WrappedNft
		created.setSelector(networkSelector);
		created.setupOne(networkSelector, wrappedNft);

		nftAdmin[nftAddr] = msg.sender;
		wrappers[nftAddr] = wrappedNft;
	}

	/**
	 * Register the NFT to be bridged across the networks.
	 * This smartcontract creates the Wrapped NFT.
	 * Then invokes the message to the factories in other chains.
	 *
	 * The factory upon receiving the message creates the Linked NFT and lints it to other NFTs.
	 *
	 * Only owner/creator of the nft can call this function.
	 *
	 * Setup of additional chains moved to it's own function
	 */
	function setup(address nftAddr, uint64 destSelector) external onlyNftAdmin(nftAddr) payable {
		require(nftAddr.code.length > 0, "not_deployed");
		require(destNetworks[destSelector].router != address(0), "unsupported");

		// add to the wrappedNft the selectors.
		WrappedNft wrappedNft = WrappedNft(wrappers[nftAddr]);
		require(wrappedNft.linkedNfts(destSelector) == address(0), "already linked");

		(uint64[] memory selectors, address[] memory linkedNftAddrs) = wrappedNft.allNfts();

		Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
				receiver: abi.encode(destNetworks[destSelector].factory),
				data: abi.encodeWithSignature("xSetup(address,string,string,uint64[],address[])",
						nftAddr, wrappedNft.name(), wrappedNft.symbol(), selectors, linkedNftAddrs),
				tokenAmounts: new Client.EVMTokenAmount[](0),
				extraArgs: "",
				feeToken: address(0)
		});

		uint256 fee = IRouterClient(router).getFee(
				destSelector,
				message
		);

		// duplicate add more fee
		require(msg.value >= fee, "insufficient balance");

		bytes32 messageId = IRouterClient(router).ccipSend{value: fee}(
			destSelector,
			message
		);

		emit X_Setup(destSelector, nftAddr, messageId);
		address linkedNftAddr;

		{
		LinkedFactoryInterface f = LinkedFactoryInterface(factory);
		linkedNftAddr = f.precomputeLinkedNft(destNetworks[destSelector].registrar, wrappedNft.name(), wrappedNft.symbol(), nftAddr, router);
		wrappedNft.setupOne(destSelector, linkedNftAddr);
		}

		uint256 remaining = wrappedNft.lintLast(msg.value - fee);
		// fund back additional money
		if (remaining > 0) {
			(bool success, ) = msg.sender.call{ value: remaining }("");
			require(success, "Failed to send Ether back");
		}
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
	 * Function that allows the owner to withdraw all the Ether in the contract
	 * The function can only be called by the owner of the contract as defined by the isOwner modifier
	 */
	function withdraw() public onlyOwner {
		(bool success, ) = owner().call{ value: address(this).balance }("");
		require(success, "Failed to send Ether");
	}

	function generateSalt(address registrar, address nftAddr) public pure returns(bytes32) {
		return keccak256(abi.encodePacked(registrar, nftAddr));
	}


	// Todo move it to the library
	// Let it calculate the user parameters
	// Testing
	function precomputeWrappedNft(address registrar, string memory _name,
		string memory _symbol,
		address nftAddress,
		address _router) public pure returns(address) {
		bytes32 salt = generateSalt(registrar, nftAddress);

		address predictedAddress = address(uint160(uint(keccak256(abi.encodePacked(
			bytes1(0xff),
			registrar, // address of the smartcontract
			salt,
			keccak256(abi.encodePacked(
				type(WrappedNft).creationCode,
				abi.encode(_name, _symbol, nftAddress, _router)
			))
		)))));

		return predictedAddress;
	}
}
