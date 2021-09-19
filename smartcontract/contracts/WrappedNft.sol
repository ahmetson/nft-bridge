// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract WrappedNft is ERC721URIStorage, IERC721Receiver {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address public source;

    /// @notice The latest Block Number when NFT was minted.
    mapping(uint256 => uint256) public blockNumbers;

    event NftReceived(address operator, address from, uint256 tokenId, bytes data);

    /**
     * @param _source is the original NFT that is wrapped to bridge
     */
    constructor(address _source) ERC721("Wrapped Bridge Scapes", "WSCAPES") {
        require(_source != address(0), "ZERO_ADDRESS");
        source = _source;
    }

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
    // DISALLOWED NFTs, to prevent to use in Marketplace's
    //
    ////////////////////////////////////////////////////////////////////////////

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory _data
    ) public virtual override {
        revert();
    }

    /**
     * @dev See {IERC721-transferFrom}.
     */
    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public virtual override {
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