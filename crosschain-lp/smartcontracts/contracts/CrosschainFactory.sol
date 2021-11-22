pragma solidity =0.5.16;

import './interfaces/ICrosschainFactory.sol';
import './interfaces/IERC20.sol';
import './CrosschainHalfPair.sol';

contract CrosschainFactory is ICrosschainFactory {
    address public feeTo;
    address public feeToSetter;

    // first chain id => last chain id => token 0 => token 1 => pair
    mapping(uint256 => mapping(uint256 => mapping(address = mapping(address => address)))) public getPair;
    address[] public allPairs;

    // The pair of the Blockchains.
    // The first blockchain is the blockchain is the blockchain
    // where the event has to be initiated.
    mapping(uint256 => uint256) public firstToLastCrosses;

    event ChanPairCreated(uint256 _firstChainID, uint256 _lastChainID, uint256 _lastOffset);
    event PairCreated(address indexed token0, address indexed token1, address pair, uint pairNumber, uint chain0, uint chain1);

    // Round offset of this blockchain.
    // another blockchain's id => offset of this blockchain against another.
    mapping(uint256 => uint256) public offsets;

    /**
     *  @notice Deploy this Factory on one of the blockchains.
     *  When deploying, define the blockchain pairs.
     *  
     *  @param _firstChainID    -   first part of a blockchain pair.
     *                              user interacts with crosschain liquidity
     *                              in this blockchain first.
     *
     *  @param _lastChainID   -     the last part of a blockchain pair.
     *  @param _lastOffset    -     if the blockchain where this contract
     *                              is deployed, then set the offset.
     */
    constructor(address _feeToSetter, uint256 _firstChainID, uint256 _lastChainID, uint256 _lastOffset) public {
        require(addBlockchainPair(_firstChainID, _lastChainID, _lastOffset), "CHAIN_PAIR_FAILED");
        feeToSetter = _feeToSetter;
    }

    /// @todo make blockchain pair addition in pending state, 
    /// add verifier that another blockchain also created a pair.
    function addBlockchainPair(uint256 _firstChainID, uint256 _lastChainID, uint256 _lastOffset) public returns (bool) {
        require(feeToSetter == address(0) || feeToSetter == msg.sender, "FORBIDDEN");

        uint256 _chainID = getChainID();
        require(_chainID == _firstChainID || _chainID == _lastChainID, 
        "XDEX: INVALID_CHAIN_ID");
        
        if (_firstChainID == _chainID) {
            firstToLastCrosses[_firstChainID]   = _lastChainID;
            offsets[_firstChainID]              = 0;
        } else {
            firstToLastCrosses[_lastChainID]    = _firstChainID;
            offsets[_lastChainID]               = _lastOffset;
        }

        emit ChanPairCreated(_firstChainID, _lastChainID, _lastOffset);
    }

    function allPairsLength() external view returns (uint) {
        return allPairs.length;
    }

    /** @notice Create a Token Pair, where one of the token is
     *  on this Blockchain. While another token is on another Blockchain.
     * 
     *  @param tokenA - is the token on this blockchain.
     *  @param targetChainID - is the blockchain where second token at.
     *  @param tokenB - is the token on another blockchain.
     *  
     *  @dev User submits the token on the first blockchain.
     *  then on the target blockchain. 
     *  The created HalfPair token will be in the pending mode. 
     *  Eventually turned into active by the Verifiers.
     *  
     *  The token salt is generated as:
     *  firstChain, targetChain, thisToken, targetToken
     */
    function createPair(address token0, uint256 targetChainID, address token1, 
    uint256 amount0, uint256 amount1) external returns (address pair) {
        uint256 thisChainID = getChainID();
        require(targetChainID != thisChainID && targetChainID != 0,
        "INVALID_CHAIN_ID");
        require (amount0 > 0 && amount1 > 0, "ZERO_AMOUNT");
        
        require(token0 != address(0) && token1 != address(0), 'UniswapV2: ZERO_ADDRESS');
        require(validBlockchainPair(thisChaiID, targetBlockchainID),
        "INVALID_BLOCKCHAIN_PAIR");

        (uint256 chain0, uint256 chain1) = chainPairOrder(thisChainID, targetChainID);
        
        require(getPair[chain0][chain1][token0][token1] == address(0),
        'PAIR_EXISTS');

        bytes memory bytecode = type(CrosschainHalfPair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(chain0, chain1, token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }

        bool firstChain = firstChain(thisChainID);

        uint balance;
        if (firstChain) {
            require(IERC20(token0).transferFrom(msg.sender, pair, amount0), "FAILED_TO_TRANSFER_TOKEN");
        } else {
            require(IERC20(token0).transferFrom(msg.sender, pair, amount1), "FAILED_TO_TRANSFER_TOKEN");
        }

        CrosschainHalfPair(pair).initialize(firstChain, chain0, token0, chain1, token1, [amount0, amount1], offsets[thisChaiID]);
        // populate mapping in the reverse direction
        getPair[chain0][chain1][token0][token1] = pair;
        getPair[chain0][chain1][token1][token0] = pair;
        getPair[chain1][chain0][token0][token1] = pair;
        getPair[chain1][chain0][token1][token0] = pair;

        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, allPairs.length, chain0, chain1);
    }

    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, 'UniswapV2: FORBIDDEN');
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, 'UniswapV2: FORBIDDEN');
        feeToSetter = _feeToSetter;
    }

    function getChainID() external view returns (uint256) {
        uint256 id;
        assembly {
            id := chainid()
        }
        return id;
    }

    function validBlockchainPair(uint256 thisChainID, uint256 targetChainID) public view returns (bool) {
        return firstToLastCrosses[thisChainID] == targetChainID
        || firstToLastCrosses[targetChainID] == thisChainID;
    }

    function chainPairOrder(uint256 thisChainID, uint256 targetChainID) public view returns (uint256, uint256) {
        if (firstToLastCrosses[thisChainID] == targetChainID) {
            return (thisChainID, targetChainID)
        } else if (firstToLastCrosses[targetChainID] == thisChainID) {
            return (targetChainID, thisChainID);
        } else {
            return (0, 0);
        }
    }

    function firstChain(uint256 thisChainID) public view returns (bool) {
        return firstToLastCrosses[thisChainID] > 0;
    }
}
