/**
 * This is the primary script containing the configuration
 * 
 * Depends on:
 * 
 * - web3
 * - evmChains
 */
 
let FIXED_DIGITS = 6;

let CONFIRMATION = 2;
let SOURCE_NETWORK_ID = 42;
let TARGET_NETWORK_ID = 4;

let blockchainConfig = {
    "42": {
        "source": {
            "address": "0x536602da5f4Bee6f359947c2AF22673A5EbC181F",
            "abi": "scapeAbi"
        },
        "wrapped": {
            "address": "0x186E521514542af46F404Ec356d556B26229dFb6",
            "abi": "wrappedAbi"
        }
    },
    "4": {
        "bridged": {
            "address": "0x22a272A851b81D4B0c404Cd31D49d64166546ab8",
            "abi": "bridgedAbi"
        }
    }
};

/**
 * Returns a contract instance to use. If the configuration doesn't support the connected wallet, then throws an error.
 * @param {string} name of contract to load from blockchainConfig.
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
    if (undefined === blockchainConfig[chainId]) {
        // Load chain information over an HTTP API
        const chainData = window.evmChains.getChain(chainId);

        throw `${chainData.name} not supported. Please switch your blockchain network!`;
    }

    if (blockchainConfig[chainId][name] === undefined) {
        throw `Invalid contract name ${name} in Blockchain config!`;
    }

    let address = blockchainConfig[chainId][name].address;
    let abiName = blockchainConfig[chainId][name].abi;
    let abi = window[abiName];

    if (abi == undefined) {
        throw "Failed to load Abi. Please Check your internet connection!";
    }
    return new web3.eth.Contract(abi, address);
}

