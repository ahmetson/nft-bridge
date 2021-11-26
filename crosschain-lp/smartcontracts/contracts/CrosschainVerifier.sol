pragma solidity =0.5.16;

import './interfaces/ICrosschainFactory.sol';
import './interfaces/IERC20.sol';
import './CrosschainHalfPair.sol';

/**
 *  todo add verifier managers
 */
contract CrosschainVerifier {
    uint256 verifiersAmount;

    uint256 addedVerifiers;
    mapping(address => bool) public verifiers;

    constructor(uint256 _verifiersAmount) public {
        require(_verifiersAmount > 0, "0");
        verifiersAmount = _verifiersAmount;
        addedVerifiers++;
    }

    function addVerifier(address _verifier) external {
        require(addedVerifiers + 1 < verifiersAmount, "EXCEED");
        verifiers[_verifier] = true;
        addedVerifiers++;
    }

    function removeVerifier(address _verifier) external {
        delete verifiers[_verifier];
        addedVerifiers--;
    }

    function isVerifier(address _verifier) external returns(bool) {
        return verifiers[_verifier];
    }
}
