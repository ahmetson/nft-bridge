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
            "address": "0x2372112ABA8173CE9491eAb2b2a786Ced8F79EdB",
            "abi": "scapeAbi"
        },
        "wrapped": {
            "address": "0xb223728292f818447C6b7e0CcB266dc51F9c1fE7",
            "abi": "wrappedAbi"
        }
    },
    "4": {
        "bridged": {
            "address": "0x39eEbE5b30170506e131430Ed4627DCCe6e7e77F",
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

