/**
 * This is the primary script containing the configuration
 * 
 * Depends on:
 * 
 * - web3
 * - evmChains
 */
 
let FIXED_DIGITS = 6;

let CONFIRMATION = 12;
let SOURCE_NETWORK_ID = 4;
let TARGET_NETWORK_ID = 97;

let blockchainConfig = {
    "4": {
        "source": {
            "address": "0x7115ABcCa5f0702E177f172C1c14b3F686d6A63a",
            "abi": "scapeAbi"
        },
        "wrapped": {
            "address": "0x48fAD8615804e09fB8054F649A99E37867461e85",
            "abi": "wrappedAbi"
        }
    },
    "97": {
        "bridged": {
            "address": "0x8af08773023Cf9D82A769676e234Dc45D2F8Fd52",
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

