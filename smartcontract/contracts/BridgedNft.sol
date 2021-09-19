// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * todo Oracle should return nft specific data as series of bytes.
 * For SCAPES its quality, generation. So bridged NFT should have the decoder.
 */
contract BridgedNft is ERC721URIStorage {
    address public wrapped;

    /**
     * @param _wrapped is the original NFT that is wrapped to bridge
     */
    constructor(address _wrapped) ERC721("Scape NFT", "SCAPES") {
        require(_wrapped != address(0), "ZERO_ADDRESS");
        wrapped = _wrapped;
    }

    function mint(uint256 id)
        public
    {
        require(id > 0, "INVALID_TOKEN_ID");

        // todo here it should connect to chainlink oracles to verify wrapped nft.
        // and chainlink oracle calls _mint() function.
        // todo oracle response also sets token URI
        // and todo nft specific data.
        _mint(msg.sender, id);
    }

    /// @dev For development only.
    function withdraw(uint256 id) 
        public
        returns (uint256)
    {
        require(id > 0, "INVALID_TOKEN_ID");
        require(ownerOf(id) == msg.sender, "NOT_OWNER");

        _burn(id);

        return id;
    }

}