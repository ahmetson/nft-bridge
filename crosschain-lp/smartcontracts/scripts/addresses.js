const addresses = {
    4:                  // rinkeby network
    {
        offset: 0,
        contracts: 
        {
            erc20: "0x513F7cbC3fFD22b60883208aC37A02ab69B64f87",    // test erc20 to work with
            verifier: "0x219B6b1c4e64af46876E896E75e69892Af9a9999"
        }
    },
    42:                 // kovan network
    {
        offset: 300,
        contracts: 
        {
            erc20: "0xa7a98F2BCa3dFe72010841cE6B12Ce4810D0f8F4",
            verifier: "0x55Ff2B725e7353a0C6F9D1Ba69bc9354C19eb9bf"
        }
    }
}

const opposite = {
    4: 42,
    42: 4
}

let alias = {
    TEST_TOKEN: "erc20",
    VERIFIER: "verifier"
}

let addressOf = function(chainID, name) {
    if (addresses[chainID] === undefined) {
        throw `Unsupported chain id ${chainID}`;
    }

    if (!addresses[chainID].contracts[name]) {
        throw `Address not set or alias name ${name} is invalid`;
    }

    return addresses[chainID][name];
}

let oppositeOf = function(chainID) {
    if (!opposite[chainID]) {
        throw `No supported chain id ${chainID}`;
    }

    return opposite[chainID];
}

let offsetOf = function(chainID) {
    if (!addresses[chainID]) {
        throw `No supported chain id ${chainID}`;
    }

    if (addresses[chainID].offset !== 0 && !addresses[chainID].offset) {
        throw `Invalid offset for chain id ${chainID}`;
    }

    return addresses[chainID].offset;
}

module.exports = {
    alias: alias,
    addressOf: addressOf,
    oppositeOf: oppositeOf,
    offsetOf: offsetOf
}