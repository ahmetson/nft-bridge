// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721URIStorage } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

/**
 * @notice WrappedNft is an NFT on the Source Blockchain, which locks the original NFT, and disables transferring it.
 * When an NFT is wrapped, the Listening oracles would mint the copy on target Blockchain.
 *
 * todo Unwrapping Wrapped NFTs is not possible in this version.
 */
contract WrappedNft is ERC721URIStorage, IERC721Receiver {
    address public source;

    /// @notice The latest Block Number when NFT was minted.
    mapping(uint256 => uint256) public blockNumbers;

    event NftReceived(address operator, address from, uint256 tokenId, bytes data);

    /**
     * @param _source is the original NFT that is wrapped to bridge
     */
    constructor(address _source) ERC721("Wrapped Bridge Scapes", "WSCAPES") {
        require(_source != address(0), "ZERO_ADDRESS");

        // Todo get the String
        // Todo get the Symbol

        source = _source;
    }

    // Todo get the URL
    // Todo send to the contract.
    function mint(uint256 id)
        public
        returns (uint256)
    {
        require(id > 0, "INVALID_TOKEN_ID");
        require(blockNumbers[id] == 0, "ALREADY_MINTED");

        IERC721Metadata nft = IERC721Metadata(source);
        require(nft.ownerOf(id) == msg.sender, "NOT_OWNER");

        string memory tokenURI = nft.tokenURI(id);
        nft.safeTransferFrom(msg.sender, address(this), id, "");

        _mint(msg.sender, id);
        _setTokenURI(id, tokenURI);
        blockNumbers[id] = block.number;

        return id;
    }

    /// @dev For development only.
    function withdraw(uint256 id) 
        public
        returns (uint256)
    {
        require(id > 0, "INVALID_TOKEN_ID");
        require(blockNumbers[id] > 0, "NOT_MINTED");
        require(ownerOf(id) == msg.sender, "NOT_OWNER");

        IERC721Metadata nft = IERC721Metadata(source);
        require(nft.ownerOf(id) == address(this), "NOT_WRAPPED");

        nft.safeTransferFrom(address(this), msg.sender, id, "");

        _burn(id);

        delete blockNumbers[id];

        return id;
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    // It's a locked nft.
    //
    ////////////////////////////////////////////////////////////////////////////

    function _safeTransfer(address, address, uint256, bytes memory) internal pure override {
        revert();
    }
    function transferFrom(address, address, uint256) public pure override(ERC721, IERC721) {
        revert();
    }
    function approve(address, uint256) public pure override(ERC721, IERC721) {
        revert();
    }
    function setApprovalForAll(address, bool) public pure override(ERC721, IERC721) {
        revert();
    }

    /// @dev encrypt token data
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes memory data
    )
        public
        override
        returns (bytes4)
    {
        //only receive the _nft staff
        if (address(this) != operator) {
            //invalid from nft
            return 0;
        }

        //success
        emit NftReceived(operator, from, tokenId, data);
        return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    }
}