// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721URIStorage } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import { IRouterClient } from "./chainlink/ccip/interfaces/IRouterClient.sol";
import { Client } from "./chainlink/ccip/libraries/Client.sol";
import { CCIPReceiver } from "./chainlink/ccip/applications/CCIPReceiver.sol";

/**
 * @notice WrappedNft is an NFT on the Source Blockchain, which locks the original NFT, and disables transferring it.
 * When an NFT is wrapped, the Listening oracles would mint the copy on target Blockchain.
 *
 * todo Unwrapping Wrapped NFTs is not possible in this version.
 */
contract WrappedNft is ERC721URIStorage, IERC721Receiver, CCIPReceiver {
    ERC721 public originalNft;

    address public registrar;
    address public router;

    // track routers and selectors of dest blockchains.

    // The linked nft addresses across blockchains.
    // For this blockchain it creates a wrapped NFT.
    //
    // chain id => linked nft|wrapped nft.
    uint64[] public nftSupportedChains;
    mapping(uint64 => address) public linkedNfts;

    event NftReceived(address operator, address from, uint256 tokenId, bytes data);
    event X_Bridge(uint64 destSelector, uint256 nftId, address owner, bytes32 messageId);
    event X_SetupOne(uint64 selector, address nftAddress, bytes32 messageId);

    modifier nftOwner(uint256 nftId) {
        require(originalNft.ownerOf(nftId) == msg.sender, "not owner");
        require(originalNft.isApprovedForAll(msg.sender, address(this)), "wrapping has no permission");
        _;
    }

    modifier onlyFactory() {
        require(msg.sender == registrar);
        _;
    }

    modifier validDestination(uint64 _selector) {
        require(linkedNfts[_selector] != address(0), "not linked");
        _;
    }

    /**
     * @param _source is the original NFT that is wrapped to bridge
     */
    constructor(
        string memory _name,
        string memory _symbol,
        address _source,
        address _router) ERC721(_name, _symbol) CCIPReceiver(_router) {
        require(_source != address(0), "ZERO_ADDRESS");

        originalNft = ERC721(_source);

        registrar = msg.sender;
    }
    /// @notice registers itself as the first element of NFTs supported chains.
    /// @dev this method must be called first.
    function setupOne(uint64 linkedSelector) external onlyFactory {
        require(nftSupportedChains.length == 0, "call it only once");
        nftSupportedChains.push(linkedSelector);
        linkedNfts[linkedSelector] = address(this);
    }

    /// @notice registers a linked nft.
    /// @dev This method must be called after calling setting up wrapped nft as the first supported nft.
    /// @param linkedSelector the destination blockchain.
    /// @param linkedNftAddr the linked nft address at the destination.
    function setupOne(uint64 linkedSelector, address linkedNftAddr) external onlyFactory {
        require(nftSupportedChains.length > 0, "set wrapped nft itself first");
        nftSupportedChains.push(linkedSelector);
        linkedNfts[linkedSelector] = linkedNftAddr;
    }

    /// @notice Lint the last added nft across all blockchains.
    /// It works if there are at least three supported nfts.
    function lintLast(uint256 budget) external onlyFactory returns(uint256) {
        if (nftSupportedChains.length <= 2) {
            return budget;
        }
        // the first selector is this contract.
        // the last one added and linted automatically to previous ones.
        uint64 lastSelector = nftSupportedChains[nftSupportedChains.length - 1];
        address lastNftAddr = linkedNfts[lastSelector];

        for (uint256 i = 1; i < nftSupportedChains.length - 1; i++) {
            uint64 destSelector = nftSupportedChains[i];

            // Linked NFT will accept this method to add nft on a new blockchain.
            bytes memory data = abi.encodeWithSignature("setupOne(uint64,address)", lastSelector, lastNftAddr);

            Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
                receiver: abi.encode(linkedNfts[destSelector]),
                data: data,
                tokenAmounts: new Client.EVMTokenAmount[](0),
                extraArgs: "",
                feeToken: address(0)
            });

            uint256 fee = IRouterClient(router).getFee(
                destSelector,
                message
            );
            require(budget >= fee, "insufficient linting balance");
            budget -= fee;

            bytes32 messageId = IRouterClient(router).ccipSend{value: fee}(
                destSelector,
                message
            );

            emit X_SetupOne(destSelector, lastNftAddr, messageId);
        }

        return budget;
    }

    function allNfts() external view returns(uint64[] memory, address[] memory) {
        address[] memory linkedNftAddrs = new address[](nftSupportedChains.length + 1);
        for (uint256 i = 0; i < nftSupportedChains.length; i++) {
            linkedNftAddrs[i] = linkedNfts[nftSupportedChains[i]];
        }

        return (nftSupportedChains, linkedNftAddrs);
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    // Bridging process
    //
    ////////////////////////////////////////////////////////////////////////////

    function bridge(uint256 nftId, uint64 chainSelector) external nftOwner(nftId) validDestination(chainSelector) payable {
        require(ownerOf(nftId) == address(0), "wrapped nft exists");
        originalNft.safeTransferFrom(msg.sender, address(this), nftId);

        string memory uri = originalNft.tokenURI(nftId);

        // pre-compute the linked address
        address linkedAddr = linkedNfts[chainSelector];

        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(linkedAddr),
            data: abi.encodeWithSignature("bridge(uint256,address,string)", nftId, msg.sender, uri),
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
        originalNft.safeTransferFrom(address(this), to, nftId);
    }

    // Call it if it's the owner, and it will withdraw from other blockchain.
    // Make it external so that it's not called by the oracles.
    //    function unBridge(uint256 nftId, uint256 chainId) external {

    //}

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        address sourceLinkedNft = abi.decode(message.sender, (address));
        require(linkedNfts[message.sourceChainSelector] == sourceLinkedNft, "not valid source");

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