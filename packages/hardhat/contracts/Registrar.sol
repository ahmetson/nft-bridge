//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import { IRouterClient } from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import { Client } from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import { CCIPReceiver } from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import { WrappedNft } from "./WrappedNft.sol";
import { LinkedNft } from "./LinkedNft.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author Medet Ahmetson
 */
contract Registrar is Ownable, CCIPReceiver {
  	struct Network {
		uint64 selector; 	// Chainlink CCIP chain selector
		address router; 	// Chainlink CCIP router
	}

	Network public network;

	uint256[] public supportedChainIds;

	// A supported networks and their oracle parameters
	// chain id => Network Param
	mapping(uint256 => Network) public supportedNetworks;
	// Registrar in other blockchains
	mapping(uint64 => address) public destRegistrars;
	mapping(uint64 => uint256) public selectorToChainId;
	// The linked nft addresses across blockchains.
	// For this blockchain it creates a wrapped NFT.
	//
	// chain id => nft address => linked nft|wrapped nft.
	mapping(uint256 => mapping(address => address)) public linkedNfts;
	// nft address => chain id[]
	mapping(address => uint256[]) public nftSupportedChains;

	uint256 private tempChainId;

	event X_Setup(uint256 chainId, address nftAddress, bytes32 messageId);
	event Linked(uint256 sourceChainId, address originalAddr, address nftAddress);

	// Make sure that given chain ids are destination chains and not empty.
	modifier destinationChains(uint256[] memory chainIds) {
		require(chainIds.length > 0, "at-least one destination");
		for (uint i = 0; i < chainIds.length; i++) {
			require(chainIds[i] != block.chainid, "not this chain");
		}
		_;
	}

	// Todo get chainlink receiver and pass networkParams.router
	constructor(
		Network memory _network,
		uint256[] memory chainIds,
		Network[] memory destNetworkParams)
		Ownable(msg.sender) CCIPReceiver(_network.router) {
		require(chainIds.length == destNetworkParams.length, "invalid length");
		require(chainIds.length >= 1, "at least one chains required");

		require(_network.router != address(0), "empty address");
		require(_network.selector > 0, "empty selector");

		network = _network;

		for (uint64 i = 0; i < chainIds.length; i++) {
			require(chainIds[i] > 0, "null");
			require(destNetworkParams[i].router != address(0), "empty address");
			require(destNetworkParams[i].selector > 0, "empty selector");

			require(supportedNetworks[chainIds[i]].router == address(0), "duplicate network");

			supportedNetworks[chainIds[i]] = destNetworkParams[i];
			supportedChainIds.push(chainIds[i]);
			selectorToChainId[destNetworkParams[i].selector] = chainIds[i];
		}
	}

	/**
	 * Set's the registrar on other blockchain.
	 */
	function setRegistrar(uint256 chainId, address registrar) external onlyOwner {
		require(chainId != block.chainid, "not to it's own");
		require(supportedNetworks[chainId].router != address(0), "unsupported network");
		// Enable in production
		// require(destRegistrars[supportedNetworks[chainId].selector] == address(0), "registrar exists");

		destRegistrars[supportedNetworks[chainId].selector] = registrar;
	}

	/**
	 * Setup a new NFT to be bridged.
	 * Only owner/creator of the nft can call this function.
	 *
	 * Setup of additional chains moved to it's own function
	 */
	function setup(address nftAddr, bytes32 deployTx, uint256[] calldata chainIds) external payable destinationChains(chainIds) {
		require(nftAddr.code.length > 0, "not_deployed");
		require(nftSupportedChains[nftAddr].length == 0, "call additional setup");

		bool ownable = getNftAdmin(nftAddr, msg.sender);
		if (!ownable) {
			require(deployTx > 0, "empty txHash");
			require(deployTx == 0, "todo: Fetch from chainlink function the creator");
		}

		address wrappedNft = address(new WrappedNft{salt: generateSalt(address(this), nftAddr)}(nftAddr, network.router));

		// First let's deploy the wrappedNft
		// Deploy the wrapped nft.
		linkedNfts[block.chainid][nftAddr] = wrappedNft;
		nftSupportedChains[nftAddr].push(block.chainid);

		// Pre-calculate the nft addresses
		for (uint i = 0; i < chainIds.length; i++) {
			require(linkedNfts[chainIds[i]][nftAddr] == address(0), "already linked");
			linkedNfts[chainIds[i]][nftAddr] = calculateLinkedAddress(chainIds[i], nftAddr);
			nftSupportedChains[nftAddr].push(chainIds[i]);
		}

		// args = block.chainid, nftAddr, wrappedNft, nftSupportedChains
		// todo make sure to re-calculate the wrapped nft in the destination.
		bytes memory data = abi.encodeWithSignature("xSetup(address,address,uint256[],string memory,string memory)",
			nftAddr, wrappedNft, nftSupportedChains[nftAddr], WrappedNft(wrappedNft).originalName(), WrappedNft(wrappedNft).originalSymbol());
		uint256 totalFee = 0;
		uint256[] memory fees = new uint256[](chainIds.length);
		Client.EVM2AnyMessage[] memory messages = new Client.EVM2AnyMessage[](chainIds.length);

		for (uint256 i = 0; i < chainIds.length; i++) {
			messages[i] = Client.EVM2AnyMessage({
				receiver: abi.encode(destRegistrars[supportedNetworks[chainIds[i]].selector]),
				data: data,
				tokenAmounts: new Client.EVMTokenAmount[](0),
				extraArgs: "",
				feeToken: address(0)
			});

			fees[i] = IRouterClient(network.router).getFee(
				supportedNetworks[chainIds[i]].selector,
				messages[i]
			);

			// duplicate add more fee
			require(fees[i] > 0, "contract error");
			totalFee += fees[i];
		}
		require(msg.value >= totalFee, "insufficient balance");

		for (uint256 i = 0; i < chainIds.length; i++) {
			bytes32 messageId = IRouterClient(network.router).ccipSend{value: fees[i]}(
				supportedNetworks[chainIds[i]].selector,
				messages[i]
			);

			emit X_Setup(chainIds[i], nftAddr, messageId);
		}
	}

	function _ccipReceive(
		Client.Any2EVMMessage memory message
	) internal override {
		uint sourceChainId = selectorToChainId[message.sourceChainSelector];
		require(sourceChainId > 0 && sourceChainId != block.chainid, "unsupported source");
		address sourceRegistrar = abi.decode(message.sender, (address));
		require(destRegistrars[message.sourceChainSelector] == sourceRegistrar, "not registrar");

		tempChainId = sourceChainId;
		(bool success, ) = address(this).call(message.data);
		tempChainId = 0;
		require(success);
	}

	function xSetup(
		address nftAddr,
		address wrappedNft, uint256[] calldata chainIds,
		string memory name,
		string memory symbol
	) private {
		wrappedNft = calculateAddress(tempChainId, nftAddr);

		// First let's deploy the wrappedNft
		// Deploy the wrapped nft.
		linkedNfts[tempChainId][nftAddr] = wrappedNft;
		nftSupportedChains[nftAddr].push(tempChainId);

		address deployedAddr;

		// Pre-calculate the nft addresses
		for (uint i = 0; i < chainIds.length; i++) {
			require(linkedNfts[chainIds[i]][nftAddr] == address(0), "already linked");
			linkedNfts[chainIds[i]][nftAddr] = calculateLinkedAddress(chainIds[i], nftAddr);
			nftSupportedChains[nftAddr].push(chainIds[i]);

			if (chainIds[i] == block.chainid) {
				deployedAddr = address(new LinkedNft{salt: generateSalt(address(this), nftAddr)}(nftAddr, name, symbol));
				require(deployedAddr == linkedNfts[chainIds[i]][nftAddr], "mismatch");
			}
		}

		require(deployedAddr != address(0), "no this blockchain");
		emit Linked(tempChainId, nftAddr, deployedAddr);
	}

	// Todo add xSetupAdditional()

	// Returns parameters needed to execute a cross-chain transfer
	// @chainId the target chain id
	// @returns destination selector
	function chainIdToSelector(uint256 chainId) public view returns(uint64) {
		return supportedNetworks[chainId].selector;
	}

	function isValidRegistrar(uint256 chainId, address registrar) public view returns(bool) {
		return destRegistrars[supportedNetworks[chainId].selector] == registrar;
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


	function calculateAddress(address nftAddress) external view returns(address) {
		bytes32 salt = generateSalt(address(this), nftAddress);

		address predictedAddress = address(uint160(uint(keccak256(abi.encodePacked(
			bytes1(0xff),
			address(this), // address of the smartcontract
			salt,
			keccak256(abi.encodePacked(
				type(WrappedNft).creationCode,
				abi.encode(nftAddress)
			))
		)))));

		return predictedAddress;
	}

	// Testing
	function calculateAddress(uint chainId, address nftAddress) public view returns(address) {
		require(destRegistrars[supportedNetworks[chainId].selector] != address(0), "no registrar");
		address registrar = destRegistrars[supportedNetworks[chainId].selector];
		bytes32 salt = generateSalt(registrar, nftAddress);

		address predictedAddress = address(uint160(uint(keccak256(abi.encodePacked(
			bytes1(0xff),
			registrar, // address of the smartcontract
			salt,
			keccak256(abi.encodePacked(
				type(WrappedNft).creationCode,
				abi.encode(nftAddress)
			))
		)))));

		return predictedAddress;
	}

	function calculateLinkedAddress(uint chainId, address nftAddress) public view returns(address) {
		require(destRegistrars[supportedNetworks[chainId].selector] != address(0), "no registrar");
		address registrar = destRegistrars[supportedNetworks[chainId].selector];
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
