// SPDX-License-Identifier: MIT
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract WrappedNft is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address public source;

    /**
     * @param _source is the original NFT that is wrapped to bridge
     */
    constructor(address _source) ERC721("Wrapped Bridge Scapes", "WSCAPES") {
        require(_source != address(0), "ZERO_ADDRESS");
        source = _source;
    }

    function mint(uint256 id, address player, string memory tokenURI)
        public
        returns (uint256)
    {
        require(id > 0, "INVALID_TOKEN_ID");

        IERC721 nft = IERC721(source);
        require(nft.ownerOf(id) == player, "NOT_OWNER");
        require(ownerOf(id) == address(0), "MINTED");

        _mint(player, id);
        _setTokenURI(id, tokenURI);

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
}