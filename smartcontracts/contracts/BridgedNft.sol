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

    // TODO: make it as non-nft contract that could call mint function of nft factory.
    // TODO: test the `params` mapping
    bytes32 public jobId =  "e7df1bdab0b448d2afcdceb15b890345";
    address public oracle =  0x9C18b429c89395Ff036b84bbD95a2D7dE171d3D2;
    uint256 public fee;

    struct Nft {
        uint256 id;
        address minter;
    }

    /// In Bytes format. Need to deduct it.
    mapping(uint256 => bytes32) public params;

    mapping(bytes32 => Nft) public confirms;

    address public oracleManager;

    /**
     * @param _wrapped is the original NFT that is wrapped to bridge
     */
    constructor(address _wrapped) ERC721("Scape NFT", "SCAPES") {
       	setPublicChainlinkToken();

        require(_wrapped != address(0), "ZERO_ADDRESS");
        wrapped = _wrapped;
        oracleManager = msg.sender;
        fee = 1 ether;
    }

    function setOracleManager(address newManager) external {
        require(oracleManager == msg.sender, "FORBIDDEN");
        require(newManager != address(0), "ZERO_ADDRESS");

        oracleManager = newManager;
    }

    function setOracle(address newOracle) external {
        require(oracleManager == msg.sender, "FORBIDDEN");
        require(newOracle != address(0), "ZERO_ADDRESS");

        // setChainlinkOracle(newOracle);
        oracle = newOracle;
    }

    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly { // solhint-disable-line no-inline-assembly
            result := mload(add(source, 32))
        }
    }

    function setJobId(string memory newId) external {
        require(oracleManager == msg.sender, "FORBIDDEN");

        jobId = stringToBytes32(newId);
    }

    function setFee(uint256 newFee) external {
        require(oracleManager == msg.sender, "FORBIDDEN");
        
        fee = newFee;
    }

    /**
     * todo Probably need to pass the NFT parameters to test too. So that Oracle would verify ID for another parameters.
     */
    function mint(uint256 id)
        public
    {
        require(id > 0, "INVALID_TOKEN_ID");
        require(params[id] == 0, "ALREADY_MINTED");
        require(!_exists(id), "ALREADY_MINTED");

        verify(msg.sender, id);
    }

    function verify(address minter, uint256 tokenID) internal {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        
        // Set the URL to perform the GET request on
        string memory url = "http://145.14.157.48:8080?minter="; 
        string memory queryPath = append(url, toStr(minter), "&wrapped=", toStr(wrapped), "&tokenID=", toStr(tokenID));
        request.add("get", queryPath);
        
        // Set the path to find the desired data in the API response, where the response format is:
        // {"tokenID": 1 }
        request.add("path", "tokenID");
        
        // Sends the request
        bytes32 requestID = sendChainlinkRequestTo(oracle, request, fee);
        confirms[requestID] = Nft(tokenID, minter);
    }

    function append(string memory a, string memory b, string memory c, string memory d, string memory e, string memory f) internal pure returns (string memory) {
        return string(abi.encodePacked(a, b, c, d, e, f));
    }
    
    //callback function
    // function fulfill(bytes32 _requestId, bytes32 _result) public recordChainlinkFulfillment(_requestId) {
    function fulfill(bytes32 _requestId, uint256 _result) public recordChainlinkFulfillment(_requestId) {
    	Nft storage nft = confirms[_requestId];
        require(nft.id > 0, "ALREADY_MINTED");
        require(!_exists(nft.id), "ALREADY_EXISTS");

        // need to decode bytes32 to nft parameters using abi.decodePacked
        // params[nft.id] = _result;
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

    function toStr(address account) public pure returns(string memory) {
        return toStr(abi.encodePacked(account));
    }

    function toStr(uint256 value) public pure returns(string memory) {
        return toStr(abi.encodePacked(value));
    }

    function toStr(bytes32 value) public pure returns(string memory) {
        return toStr(abi.encodePacked(value));
    }

    function toStr(bytes memory data) public pure returns(string memory) {
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