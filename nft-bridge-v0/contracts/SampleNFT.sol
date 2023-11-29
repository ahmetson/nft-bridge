// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./LinkedNft.sol";
//import "./IFactoryNft";

/**
    An NFT bridge using Chainlink CCIP

    1. Deploy your nft on two blockchains.
    2. Link them together.
    3. The nfts are extending the LinkedNft.
    4. Transfer the nft to 0x<chain_id> and it will appear on another blockchain.
*/



/*
    import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

    contract LetterNft is LinkedNft, AccessControl {
        bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
        uint256 private _nextTokenId;

        constructor()
            LinkedNft("factory", _chain, "factory")
            ERC721("Letter", "LTR") {
        }

        function mintStart(address _to, string memory _uri) external onlyRole(MINTER_ROLE) linkedMint() {
            uint256 tokenId = _nextTokenId++;
            linkedMint(_to, _uri, tokenId);
        }

        function onMintSuccess(address _to, string memory _uri, uint256 tokenId) internal override {
            _mint(_to, tokenId);
            _setTokenURI(tokenId, _uri);
        }
    }
*/


/*
    import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

    // a decentralized ready to use nft bridge
    transfer to a network.
    then it will be locked and minted on another network.

    usage///

    The NFT bridges are kept as smartcontracts for each bridge.
    // Simply transfer your NFT to that bridge, and it will appear on the target.
    To easily remember them they have the names:
    - eth_linked_nft_bridge.eth
    - bnb_linked_nft_bridge.eth

*/


/**
 * @notice LetterNft is a sample NFT for hackathon
 */
contract LetterNft is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Letter", "LETTER") {
    }

}