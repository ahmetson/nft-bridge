//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import { IRouterClient } from "./chainlink/ccip/interfaces/IRouterClient.sol";
import { Client } from "./chainlink/ccip/libraries/Client.sol";
import { CCIPReceiver } from "./chainlink/ccip/applications/CCIPReceiver.sol";
import { WrappedNft } from "./WrappedNft.sol";
import { LinkedNft } from "./LinkedNft.sol";
import { SourceNftLib } from "./SourceNftLib.sol";

// todo keep the selector of this chain

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author Medet Ahmetson
 */
contract Registrar is Ownable, CCIPReceiver {
	address public router;
	uint64 public networkSelector;

  	struct Network {
		address router; 	// Chainlink CCIP router
		address registrar; 	// Registrar on another blockchain
	}

	uint64[] public destNetworkSelectors;

	// selector => Network Param
	mapping(uint64 => Network) public destNetworks;

	uint64 private tempChainId;

	event X_Setup(uint64 selector, address nftAddress, bytes32 messageId);
	event Linked(uint64 sourceSelector, address originalAddr, address nftAddress);

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
	function setRegistrar(uint64 selector, address registrar) external onlyOwner {
		require(destNetworks[selector].router != address(0), "unsupported network");
		// Enable in production
		// require(destNetworks[selector].registrar == address(0), "registrar exists");

		destNetworks[selector].registrar = registrar;
	}

	/**
	 * Creates a new Wrapped NFT
	 * @nftAddr original NFT to wrap
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

		address created = new WrappedNft{salt: generateSalt(address(this), nftAddr)}(wrappedName, wrappedSymbol, nftAddr, router);
		require(wrappedNft == created, "address mismatch");
		require(wrappedNft.code.length > 0, "not created");
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
	function setup(address nftAddr, bytes32 deployTx, uint64[] calldata selectors) external payable {
		require(nftAddr.code.length > 0, "not_deployed");

		bool ownable = getNftAdmin(nftAddr, msg.sender);
		if (!ownable) {
			require(deployTx > 0, "empty txHash");
			require(deployTx == 0, "todo: Fetch from chainlink function the creator");
		}

		string memory wrappedName = string.concat("Bridged", SourceNftLib.originalName(nftAddr));
		string memory wrappedSymbol = string.concat("b", SourceNftLib.originalName(nftAddr));

		address wrappedNft = precomputeWrappedNft(address(this), wrappedName, wrappedSymbol, nftAddr, router);
		require(wrappedNft.code.length == 0, "already set up");

		bytes memory data = abi.encodeWithSignature("xSetup(address,uint64[],string,string)",
			nftAddr, selectors, wrappedName, wrappedSymbol);
		uint256 totalFee = 0;
		uint256[] memory fees = new uint256[](selectors.length);
		Client.EVM2AnyMessage[] memory messages = new Client.EVM2AnyMessage[](selectors.length);

		for (uint256 i = 0; i < selectors.length; i++) {
			messages[i] = Client.EVM2AnyMessage({
				receiver: abi.encode(destNetworks[selectors[i]].registrar),
				data: data,
				tokenAmounts: new Client.EVMTokenAmount[](0),
				extraArgs: "",
				feeToken: address(0)
			});

			fees[i] = IRouterClient(router).getFee(
				selectors[i],
				messages[i]
			);

			// duplicate add more fee
			require(fees[i] > 0, "contract error");
			totalFee += fees[i];
		}
		require(msg.value >= totalFee, "insufficient balance");

		for (uint256 i = 0; i < selectors.length; i++) {
			bytes32 messageId = IRouterClient(router).ccipSend{value: fees[i]}(
				selectors[i],
				messages[i]
			);

			emit X_Setup(selectors[i], nftAddr, messageId);
		}

		new WrappedNft{salt: generateSalt(address(this), nftAddr)}(wrappedName, wrappedSymbol, nftAddr, router);
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
		uint64[] memory selectors,
		string memory name,
		string memory symbol
	) private {
		address deployedAddr;

		// Pre-calculate the nft addresses
		for (uint i = 0; i < selectors.length; i++) {
			// need to use this smart contract's selector
			// need to use this smart contract's selector
			// perhaps use the sender instead the blockchain? no, they could be identical
			if (selectors[i] != networkSelector) {
				continue;
			}

			new LinkedNft{salt: generateSalt(address(this), nftAddr)}(nftAddr, router, name, symbol, selectors);
			break;
		}

		require(deployedAddr != address(0), "no this blockchain");
		emit Linked(tempChainId, nftAddr, deployedAddr);
	}

	// Todo add xSetupAdditional()

	function isValidDestRegistrar(uint64 selector, address registrar) public view returns(bool) {
		return destNetworks[selector].registrar == registrar;
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

	function calculateLinkedAddress(address registrar, address nftAddress) public pure returns(address) {
		bytes32 salt = generateSalt(registrar, nftAddress);

		address predictedAddress = address(uint160(uint(keccak256(abi.encodePacked(
			bytes1(0xff),
			registrar, // address of the smartcontract
			salt,
			keccak256(abi.encodePacked(
				type(LinkedNft).creationCode,
				abi.encode(nftAddress)
			))
		)))));

		return predictedAddress;
	}

}
