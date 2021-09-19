/**
 * This is the primary script containing the configuration
 * 
 * Depends on:
 * 
 * - web3
 * - evmChains
 */
 
let FIXED_DIGITS = 6;

// As for now we test the game on 
let polkaConfig = {
    "4": {
        "polka": {
            "address": "0x08F825A45F512a44D413e77e3AC776eBc4F326A6",
            "abi": "polkaAbi"
        },
        "PrivateSale": {
            "address": "0xDac609A1975489a0fc7feeC172cf480b8a3A6c2D",
            "abi": "vestingAbi"
        },
        "ChainGuardian": {
            "address": "0x6B7B746AB4DE072Fb916A5BD2a5f35400002E25b",
            "abi": "vestingAbi"
        },
        "TrustPad": {
            "address": "0x70c80041BE60189D50273aDa10966bBCb1b7b3a8",
            "abi": "vestingAbi"
        }
    }
};

/**
 * Returns a contract instance to use. If the configuration doesn't support the connected wallet, then throws an error.
 * @param {string} name of contract to load from polkaConfig.
 * @throws Exception in case of unconnected wallet, invalid network, damage of configuration
 */
let getContract = async function(name) {
    if (!web3) {
        throw "Failed to load Web3 library. Please check your internet connection!";
    }
    if (web3.eth === undefined) {
        throw "Provider not instantiniated. Please connect the wallet";
    }

    let chainId = await web3.eth.getChainId();
    if (undefined === polkaConfig[chainId]) {
        // Load chain information over an HTTP API
        const chainData = window.evmChains.getChain(chainId);

        throw `${chainData.name} not supported. Please switch your blockchain network!`;
    }

    if (polkaConfig[chainId][name] === undefined) {
        throw `Invalid contract name ${name} in Polka config!`;
    }

    let address = polkaConfig[chainId][name].address;
    let abiName = polkaConfig[chainId][name].abi;
    let abi = window[abiName];

    if (abi == undefined) {
        throw "Failed to load Abi. Please Check your internet connection!";
    }
    return new web3.eth.Contract(abi, address);
}

