// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./chainlink/v0.8/Chainlink.sol";
import "./chainlink/v0.8/ChainlinkClient.sol";

/**
 * todo Oracle should return nft specific data as series of bytes.
 * For SCAPES its quality, generation. So bridged NFT should have the decoder.
 */
contract BridgedNft is ERC721URIStorage, ChainlinkClient {
    using Chainlink for Chainlink.Request;
    address public wrapped;

    // TODO: add updater of job and oracle and fee
    // TODO: deploy node with external adapter
    // TODO: make BridgedNft as ownable
    // TODO: make it as non-nft contract that could call mint function of nft factory.
    // TODO: test the `params` mapping
    bytes32 jobId =  "4c24865c4192437c81adf203062c7075";
    address oracle =  0x474260ab28874FAA67c8d1197AF91959556d7AC0;
    uint256 private fee;

    struct Nft {
        uint256 id;
        address minter;
    }

    /// In Bytes format. Need to deduct it.
    mapping(uint256 => bytes32) public params;

    mapping(bytes32 => Nft) public confirms;

    /**
     * @param _wrapped is the original NFT that is wrapped to bridge
     */
    constructor(address _wrapped) ERC721("Scape NFT", "SCAPES") {
       	setPublicChainlinkToken();

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
        verify(msg.sender, id);
    }

    function verify(address minter, uint256 tokenID) internal {
    	Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
    	req.add("tokenID", uint2str(tokenID));
    	req.add("minter", toString(abi.encodePacked(minter)));
    	req.add("wrapped", toString(abi.encodePacked(wrapped)));
    	bytes32 requestID = sendChainlinkRequestTo(oracle, req, fee);
        confirms[requestID] = Nft(tokenID, minter);
    }
    
    //callback function
    function fulfill(bytes32 _requestId, bytes32 _result) public recordChainlinkFulfillment(_requestId) {
    	Nft storage nft = confirms[_requestId];

        params[nft.id] = _result;
        _mint(nft.minter, nft.id);

        delete confirms[_requestId];
    }

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    function toString(address account) public pure returns(string memory) {
        return toString(abi.encodePacked(account));
    }

    function toString(uint256 value) public pure returns(string memory) {
        return toString(abi.encodePacked(value));
    }

    function toString(bytes32 value) public pure returns(string memory) {
        return toString(abi.encodePacked(value));
    }

    function toString(bytes memory data) public pure returns(string memory) {
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(2 + data.length * 2);
        str[0] = "0";
        str[1] = "x";
        for (uint i = 0; i < data.length; i++) {
            str[2+i*2] = alphabet[uint(uint8(data[i] >> 4))];
            str[3+i*2] = alphabet[uint(uint8(data[i] & 0x0f))];
        }
        return string(str);
    }
}