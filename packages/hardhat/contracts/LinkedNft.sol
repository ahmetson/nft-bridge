// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721URIStorage } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @notice WrappedNft is an NFT on the Source Blockchain, which locks the original NFT, and disables transferring it.
 * When an NFT is wrapped, the Listening oracles would mint the copy on target Blockchain.
 */
contract LinkedNft is ERC721URIStorage {
    address public source;

    address public registrar;
    address public router;
    uint64 public selector;

    uint64[] public nftSupportedChains;
    mapping(uint64 => address) public linkedNfts;

    modifier onlyFactory() {
        require(msg.sender == address(registrar));
        _;
    }

    modifier validDestination(uint64 _selector) {
        require(_selector != selector, "to itself");
        bool found = false;
        for (uint256 i = 0; i < nftSupportedChains.length; i++) {
            if (nftSupportedChains[i] == _selector) {
                found = true;
                break;
            }
        }
        require(found, "unsupported network");
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        address _source,
        address _router)
        ERC721(string.concat("Linked ", _name), string.concat("l", _symbol)) {
        registrar = msg.sender;
        source = _source;
    }

    function setSelector(uint64 _selector) external onlyFactory {
        selector = _selector;
    }

    function setupOne(uint64 linkedSelector, address linkedNftAddr) external onlyFactory {
        nftSupportedChains.push(linkedSelector);
        linkedNfts[linkedSelector] = linkedNftAddr;
    }

    function setup(uint64[] calldata linkedSelectors, address[] calldata linkedNftAddrs) external onlyFactory {
        // Pre-calculate the nft addresses
        for (uint i = 0; i < linkedSelectors.length; i++) {
            nftSupportedChains.push(linkedSelectors[i]);
            linkedNfts[linkedSelectors[i]] = linkedNftAddrs[i];
        }
    }

    // mint and burn are done by the registrar

    // linkNfts is called by factory or by the original selector
}