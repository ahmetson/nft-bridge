// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721URIStorage } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import { CCIPReceiver } from "./chainlink/ccip/applications/CCIPReceiver.sol";
import { IRouterClient } from "./chainlink/ccip/interfaces/IRouterClient.sol";
import { Client } from "./chainlink/ccip/libraries/Client.sol";

/**
 * @notice WrappedNft is an NFT on the Source Blockchain, which locks the original NFT, and disables transferring it.
 * When an NFT is wrapped, the Listening oracles would mint the copy on target Blockchain.
 */
contract LinkedNft is ERC721URIStorage, CCIPReceiver {
    address public originalNft;

    address public factory;
    address public router;
    uint64 private selector;

    // remove the selector from here, and get it from the parent.
    // track routers and selectors.

    uint64[] public nftSupportedChains;
    mapping(uint64 => address) public linkedNfts;

    address internal sender;

    event X_Bridge(uint64 destSelector, uint256 nftId, address owner, bytes32 messageId);

    modifier nftOwner(uint256 nftId) {
        //require(_ownerOf(nftId) == msg.sender, "not owner");
        _;
    }


    modifier onlyFactory() {
        //require(msg.sender == address(factory));
        _;
    }

    modifier onlyFactoryOrSource() {
        /*if (msg.sender != address(factory)) {
            require(sender != address(0), "not from ccip");
            bool found = false;
            for (uint256 i = 0; i < nftSupportedChains.length; i++) {
                if (linkedNfts[nftSupportedChains[i]] == sender) {
                    found = true;
                    break;
                }
            }
            require(found, "not source");
        }*/
        _;
    }

    modifier onlySource() {
        /*bool found = false;
        for (uint256 i = 0; i < nftSupportedChains.length; i++) {
            if (linkedNfts[nftSupportedChains[i]] == sender) {
                found = true;
                break;
            }
        }
        require(found, "not source");*/
        _;
    }

    modifier validDestination(uint64 _selector) {
        /*require(selector != _selector, "to itself");
        bool found = false;
        for (uint256 i = 0; i < nftSupportedChains.length; i++) {
            if (nftSupportedChains[i] == _selector) {
                found = true;
                break;
            }
        }
        require(found, "unsupported network");*/
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        address _source,
        address _router)
        ERC721(_name, _symbol) CCIPReceiver(_router) {
        factory = msg.sender;
        originalNft = _source;
        router = _router;
    }

    function setupOne(uint64 linkedSelector, address linkedNftAddr) public onlyFactoryOrSource {
        if (selector == 0) {
            selector = linkedSelector;
        }
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

    /// @notice Mint a new NFT from the source.
    function bridge(uint256 nftId, address to, string memory uri) public onlySource {
        require(_ownerOf(nftId) == address(0), "already minted");

        _mint(to, nftId);
        _setTokenURI(nftId, uri);
    }

    /// @notice Transfer the nft to another blockchain.
    function bridge(uint256 nftId, uint64 chainSelector) external nftOwner(nftId) validDestination(chainSelector) payable {
        // pre-compute the linked address
        address linkedAddr = linkedNfts[chainSelector];

        bytes memory data;
        if (nftSupportedChains[0] == chainSelector) {
            data = abi.encodeWithSignature("bridge(uint256,address)", nftId, msg.sender);
        } else {
            data = abi.encodeWithSignature("bridge(uint256,address,string)", nftId, msg.sender, tokenURI(nftId));
        }

        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(linkedAddr),
            data: data,
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

        _burn(nftId);

        emit X_Bridge(chainSelector, nftId, msg.sender, messageId);
    }

    // Calculate the required fee
    function calculateBridgeFee(uint256 nftId, uint64 chainSelector) external view returns(uint256) {
        // pre-compute the linked address
        address linkedAddr = linkedNfts[chainSelector];

        bytes memory data;
        if (nftSupportedChains[0] == chainSelector) {
            data = abi.encodeWithSignature("bridge(uint256,address)", nftId, msg.sender);
        } else {
            data = abi.encodeWithSignature("bridge(uint256,address,string)", nftId, msg.sender, tokenURI(nftId));
        }

        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(linkedAddr),
            data: data,
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: "",
            feeToken: address(0)
        });

        uint256 fee = IRouterClient(router).getFee(
            chainSelector,
            message
        );
        return fee;
    }

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        sender = abi.decode(message.sender, (address));
        require(linkedNfts[message.sourceChainSelector] == sender, "not the linked nft");

        (bool success, ) = address(this).call(message.data);
        require(success);
        sender = address(0);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, CCIPReceiver) returns (bool) {
        if (ERC721URIStorage.supportsInterface(interfaceId)) {
            return true;
        }
        return CCIPReceiver.supportsInterface(interfaceId);

    }
}