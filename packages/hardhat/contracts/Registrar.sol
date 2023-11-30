//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import { WrappedNft } from "./WrappedNft.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author Medet Ahmetson
 */
contract Registrar is Ownable {
	IRouterClient private router;

	struct NetworkParams {
		uint64 selector; 	// Chainlink CCIP chain selector
		address router; 	// Chainlink CCIP router
		address registrar; 	// NFT Bridge registrar
	}

	uint256[] public chainIds;

	// A supported networks and their oracle parameters
	// chain id => Network Param
	mapping(uint256 => NetworkParams) public supportedNetworks;
	// The linked nft addresses across blockchains.
	// For this blockchain it creates a wrapped NFT.
	//
	// chain id => nft address => linked nft|wrapped nft.
	mapping(uint256 => mapping(address => address)) public linkedNfts;

	// Make sure that given chain ids are destination chains and not empty.
	modifier destinationChains(uint256[] memory chainIds) {
		require(chainIds.length > 0, "at-least one destination");
		for (uint i = 0; i < chainIds.length; i++) {
			require(chainIds[i] != block.chainid, "not this chain");
		}
		_;
	}

	// Todo get chainlink receiver and pass networkParams.router
	constructor(NetworkParams memory networkParams, uint256[] memory chainIds, NetworkParams[] memory destNetworkParams) Ownable(msg.sender) {
		require(chainIds.length == destNetworkParams.length, "invalid length");
		require(chainIds.length >= 1, "at least one chains required");

		require(networkParams.router != address(0), "empty address");
		require(networkParams.selector > 0, "empty selector");

		supportedNetworks[block.chainid] = networkParams;
		chainIds.push(block.chainid);

		for (uint64 i = 0; i < chainIds.length; i++) {
			require(chainIds[i] > 0, "null");
			require(destNetworkParams[i].router != address(0), "empty address");
			require(destNetworkParams[i].selector > 0, "empty selector");

			require(supportedNetworks[chainIds[i]].router == address(0), "duplicate network");

			supportedNetworks[chainIds[i]] = destNetworkParams[i];
			chainIds.push(block.chainid);
		}

		router = IRouterClient(networkParams.router);
	}

	/**
	 * Set's the registrar on other blockchain.
	 */
	function setRegistrar(uint256 chainId, address registrar) external onlyOwner {
		require(chainId != block.chainid, "not to it's own");
		require(supportedNetworks[chainId].router != address(0), "unsupported network");
		// Enable in production
		// require(supportedNetworks[chainId].registrar == address(0), "registrar exists");

		supportedNetworks[chainId].registrar = registrar;
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

		bytes32 salt = generateSalt(address(this), nftAddr);

		// make sure that smartcontract is not deployed.
		// let's create for a wrapped nft
		if (linkedNfts[block.chainid][nftAddr] == address(0)) {
			// Deploy the wrapped nft.
			address wrappedNft = address(new WrappedNft{salt: salt}(nftAddr));
			linkedNfts[block.chainid][nftAddr] = wrappedNft;
		}

		for (uint i = 0; i < chainIds.length; i++) {
			if (linkedNfts[chainIds[i]][nftAddr] != address(0)) {
				continue;
			}

			// Deploy linked nft.
			linkedNfts[chainIds[i]][nftAddr] = msg.sender;
		}
	}

	// Todo add setupLinked to be called by the oracle.

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
	function calculateAddress(uint chainId, address nftAddress) external view returns(address) {
		require(supportedNetworks[chainId].registrar != address(0), "no registrar");
		address registrar = supportedNetworks[chainId].registrar;
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
}
