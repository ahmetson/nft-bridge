// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721URIStorage } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import { IRouterClient } from "./chainlink/ccip/interfaces/IRouterClient.sol";
import { Client } from "./chainlink/ccip/libraries/Client.sol";
import { CCIPReceiver } from "./chainlink/ccip/applications/CCIPReceiver.sol";
import "./RegistrarInterface.sol";

/**
 * @notice WrappedNft is an NFT on the Source Blockchain, which locks the original NFT, and disables transferring it.
 * When an NFT is wrapped, the Listening oracles would mint the copy on target Blockchain.
 *
 * todo Unwrapping Wrapped NFTs is not possible in this version.
 */
contract WrappedNft is ERC721URIStorage, IERC721Receiver, CCIPReceiver {
    ERC721 public source;

    RegistrarInterface public registrar;
    address public router;
    uint64 public selector;

    // The linked nft addresses across blockchains.
    // For this blockchain it creates a wrapped NFT.
    //
    // chain id => linked nft|wrapped nft.
    uint64[] public nftSupportedChains;

    event NftReceived(address operator, address from, uint256 tokenId, bytes data);
    event X_Bridge(uint64 destSelector, uint256 nftId, address owner, bytes32 messageId);

    modifier nftOwner(uint256 nftId) {
        require(source.ownerOf(nftId) == msg.sender, "not owner");
        require(source.isApprovedForAll(msg.sender, address(this)), "wrapping has no permission");
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

    /**
     * @param _source is the original NFT that is wrapped to bridge
     */
    constructor(
        string memory _name,
        string memory _symbol,
        address _source,
        address _router,
        uint64[] memory _destSelectors) ERC721(_name, _symbol) CCIPReceiver(_router) {
        require(_source != address(0), "ZERO_ADDRESS");

        source = ERC721(_source);

        nftSupportedChains = _destSelectors;

        registrar = RegistrarInterface(msg.sender);
    }


    ////////////////////////////////////////////////////////////////////////////
    //
    // Bridging process
    //
    ////////////////////////////////////////////////////////////////////////////

    function bridge(uint256 nftId, uint64 chainSelector) external nftOwner(nftId) validDestination(chainSelector) payable {
        require(ownerOf(nftId) == address(0), "wrapped nft exists");
        source.safeTransferFrom(msg.sender, address(this), nftId);

        string memory uri = source.tokenURI(nftId);

        // pre-compute the linked address
        address linkedAddr = registrar.linkedNfts(chainSelector, address(source));

        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(linkedAddr),
            data: abi.encodeWithSignature("xBridge(uint256,address,string memory)", nftId, msg.sender, uri),
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: "",
            feeToken: address(0)
        });

        uint256 fee = IRouterClient(router).getFee(
            chainSelector,
            message
        );
        require(msg.value >= fee, "insufficient gas");

        bytes32 messageId = IRouterClient(router).ccipSend{value: fee}(
            chainSelector,
            message
        );

        _mint(msg.sender, nftId);
        _setTokenURI(nftId, uri);

        emit X_Bridge(chainSelector, nftId, msg.sender, messageId);
    }

    // Only a router can call it.
    function unBridge(uint256 nftId, address to) internal {
        _burn(nftId);
        source.safeTransferFrom(address(this), to, nftId);
    }

    // Call it if it's the owner, and it will withdraw from other blockchain.
    // Make it external so that it's not called by the oracles.
    //    function unBridge(uint256 nftId, uint256 chainId) external {

    //}

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        address sourceRegistrar = abi.decode(message.sender, (address));
        require(registrar.isValidDestRegistrar(message.sourceChainSelector, sourceRegistrar), "not registrar");

        (bool success, ) = address(this).call(message.data);
        require(success);
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

    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, CCIPReceiver) returns (bool) {
        if (ERC721URIStorage.supportsInterface(interfaceId)) {
            return true;
        }
        return CCIPReceiver.supportsInterface(interfaceId);
    }
}