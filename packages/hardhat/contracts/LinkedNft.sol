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
    address public registrar;
    address public source;

    uint64[] public nftSupportedChains;

    constructor(
        address _source,
        address _router,
        string memory _name,
        string memory _symbol,
        uint64[] memory _destSelectors)
        ERC721(string.concat("Linked ", _name), string.concat("l", _symbol)) {
        registrar = msg.sender;
        source = _source;

        nftSupportedChains = _destSelectors;
    }

    // mint and burn are done by the registrar
}