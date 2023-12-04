export default {
  "97": [
    {
      name: "bscTestnet",
      chainId: "97",
      contracts: {
        Registrar: {
          address: "0x0564C3e8Fe23c5A6220A300c303f41e43D9be9e2",
          abi: [
            {
              inputs: [
                {
                  internalType: "uint64",
                  name: "_networkSelector",
                  type: "uint64",
                },
                {
                  internalType: "address",
                  name: "_router",
                  type: "address",
                },
                {
                  internalType: "uint64[]",
                  name: "destSelectors",
                  type: "uint64[]",
                },
                {
                  internalType: "address[]",
                  name: "destRouters",
                  type: "address[]",
                },
              ],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
              ],
              name: "OwnableInvalidOwner",
              type: "error",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
              ],
              name: "OwnableUnauthorizedAccount",
              type: "error",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "address",
                  name: "originalAddr",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
              ],
              name: "Linked",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "previousOwner",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "OwnershipTransferred",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint64",
                  name: "selector",
                  type: "uint64",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "messageId",
                  type: "bytes32",
                },
                {
                  indexed: false,
                  internalType: "bytes",
                  name: "data",
                  type: "bytes",
                },
              ],
              name: "X_Setup",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint64",
                  name: "selector",
                  type: "uint64",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "messageId",
                  type: "bytes32",
                },
              ],
              name: "X_SetupOne",
              type: "event",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
                {
                  internalType: "uint64",
                  name: "destSelector",
                  type: "uint64",
                },
              ],
              name: "calculateCreateLinkedNftFee",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
              ],
              name: "calculateLinting",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint64",
                  name: "",
                  type: "uint64",
                },
              ],
              name: "destNetworks",
              outputs: [
                {
                  internalType: "address",
                  name: "router",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "factory",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "factory",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "registrar",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
              ],
              name: "generateSalt",
              outputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
              stateMutability: "pure",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "admin",
                  type: "address",
                },
              ],
              name: "getNftAdmin",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              name: "linkedAddrs",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "networkSelector",
              outputs: [
                {
                  internalType: "uint64",
                  name: "",
                  type: "uint64",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              name: "nftAdmin",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "owner",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "registrar",
                  type: "address",
                },
                {
                  internalType: "string",
                  name: "_name",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "_symbol",
                  type: "string",
                },
                {
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "_router",
                  type: "address",
                },
              ],
              name: "precomputeWrappedNft",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "pure",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
                {
                  internalType: "bytes32",
                  name: "deployTx",
                  type: "bytes32",
                },
              ],
              name: "register",
              outputs: [],
              stateMutability: "payable",
              type: "function",
            },
            {
              inputs: [],
              name: "renounceOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "router",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint64",
                  name: "_selector",
                  type: "uint64",
                },
                {
                  internalType: "address",
                  name: "_factory",
                  type: "address",
                },
              ],
              name: "setFactory",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_factory",
                  type: "address",
                },
              ],
              name: "setFactory",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
                {
                  internalType: "uint64",
                  name: "destSelector",
                  type: "uint64",
                },
              ],
              name: "setup",
              outputs: [],
              stateMutability: "payable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "transferOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "withdraw",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
        },
        SourceNftLib: {
          address: "0xe40c7856B6D0e1B01dECBF9976BB706B9Cd1229f",
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "source",
                  type: "address",
                },
              ],
              name: "originalName",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "source",
                  type: "address",
                },
              ],
              name: "originalSymbol",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
          ],
        },
        LinkedFactory: {
          address: "0x98FF82ECe33E8Bcca588572faA4D69E0706673a9",
          abi: [
            {
              inputs: [
                {
                  internalType: "uint64",
                  name: "_networkSelector",
                  type: "uint64",
                },
                {
                  internalType: "address",
                  name: "_router",
                  type: "address",
                },
                {
                  internalType: "uint64[]",
                  name: "destSelectors",
                  type: "uint64[]",
                },
                {
                  internalType: "address[]",
                  name: "destRouters",
                  type: "address[]",
                },
              ],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "router",
                  type: "address",
                },
              ],
              name: "InvalidRouter",
              type: "error",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
              ],
              name: "OwnableInvalidOwner",
              type: "error",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
              ],
              name: "OwnableUnauthorizedAccount",
              type: "error",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "string",
                  name: "reason",
                  type: "string",
                },
              ],
              name: "LinkError",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "salt",
                  type: "bytes32",
                },
                {
                  indexed: false,
                  internalType: "string",
                  name: "name",
                  type: "string",
                },
                {
                  indexed: false,
                  internalType: "string",
                  name: "symbol",
                  type: "string",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "router",
                  type: "address",
                },
              ],
              name: "LinkNftCreated",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "address",
                  name: "originalAddr",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
              ],
              name: "Linked",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint64[]",
                  name: "selectors",
                  type: "uint64[]",
                },
                {
                  indexed: false,
                  internalType: "address[]",
                  name: "linkedNftAddrs",
                  type: "address[]",
                },
              ],
              name: "LintedNfts",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "previousOwner",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "OwnershipTransferred",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "bytes",
                  name: "sourceRouter",
                  type: "bytes",
                },
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "messageId",
                  type: "bytes32",
                },
                {
                  indexed: false,
                  internalType: "uint64",
                  name: "sourceChainSelector",
                  type: "uint64",
                },
              ],
              name: "Received",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "string",
                  name: "reason",
                  type: "string",
                },
              ],
              name: "UnknownError",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint64",
                  name: "selector",
                  type: "uint64",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "messageId",
                  type: "bytes32",
                },
              ],
              name: "X_Setup",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint64",
                  name: "selector",
                  type: "uint64",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "messageId",
                  type: "bytes32",
                },
              ],
              name: "X_SetupOne",
              type: "event",
            },
            {
              inputs: [
                {
                  components: [
                    {
                      internalType: "bytes32",
                      name: "messageId",
                      type: "bytes32",
                    },
                    {
                      internalType: "uint64",
                      name: "sourceChainSelector",
                      type: "uint64",
                    },
                    {
                      internalType: "bytes",
                      name: "sender",
                      type: "bytes",
                    },
                    {
                      internalType: "bytes",
                      name: "data",
                      type: "bytes",
                    },
                    {
                      components: [
                        {
                          internalType: "address",
                          name: "token",
                          type: "address",
                        },
                        {
                          internalType: "uint256",
                          name: "amount",
                          type: "uint256",
                        },
                      ],
                      internalType: "struct Client.EVMTokenAmount[]",
                      name: "destTokenAmounts",
                      type: "tuple[]",
                    },
                  ],
                  internalType: "struct Client.Any2EVMMessage",
                  name: "message",
                  type: "tuple",
                },
              ],
              name: "ccipReceive",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  components: [
                    {
                      internalType: "bytes32",
                      name: "messageId",
                      type: "bytes32",
                    },
                    {
                      internalType: "uint64",
                      name: "sourceChainSelector",
                      type: "uint64",
                    },
                    {
                      internalType: "bytes",
                      name: "sender",
                      type: "bytes",
                    },
                    {
                      internalType: "bytes",
                      name: "data",
                      type: "bytes",
                    },
                    {
                      components: [
                        {
                          internalType: "address",
                          name: "token",
                          type: "address",
                        },
                        {
                          internalType: "uint256",
                          name: "amount",
                          type: "uint256",
                        },
                      ],
                      internalType: "struct Client.EVMTokenAmount[]",
                      name: "destTokenAmounts",
                      type: "tuple[]",
                    },
                  ],
                  internalType: "struct Client.Any2EVMMessage",
                  name: "message",
                  type: "tuple",
                },
              ],
              name: "ccipReceive2",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint64",
                  name: "",
                  type: "uint64",
                },
              ],
              name: "destNetworks",
              outputs: [
                {
                  internalType: "address",
                  name: "router",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "registrar",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_registrar",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "_nftAddr",
                  type: "address",
                },
              ],
              name: "generateSalt",
              outputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
              stateMutability: "pure",
              type: "function",
            },
            {
              inputs: [],
              name: "getRouter",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              name: "linkedAddrs",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "networkSelector",
              outputs: [
                {
                  internalType: "uint64",
                  name: "",
                  type: "uint64",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "owner",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_registrar",
                  type: "address",
                },
                {
                  internalType: "string",
                  name: "_name",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "_symbol",
                  type: "string",
                },
                {
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "_router",
                  type: "address",
                },
              ],
              name: "precomputeLinkedNft",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "pure",
              type: "function",
            },
            {
              inputs: [],
              name: "registrar",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "renounceOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "router",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint64",
                  name: "_selector",
                  type: "uint64",
                },
                {
                  internalType: "address",
                  name: "_registrar",
                  type: "address",
                },
              ],
              name: "setRegistrar",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes4",
                  name: "interfaceId",
                  type: "bytes4",
                },
              ],
              name: "supportsInterface",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "transferOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
                {
                  internalType: "string",
                  name: "name",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "symbol",
                  type: "string",
                },
                {
                  internalType: "uint64[]",
                  name: "selectors",
                  type: "uint64[]",
                },
                {
                  internalType: "address[]",
                  name: "linkedNftAddrs",
                  type: "address[]",
                },
              ],
              name: "xSetup",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
        },
      },
    },
  ],
  "43113": [
    {
      name: "fuji",
      chainId: "43113",
      contracts: {
        SourceNftLib: {
          address: "0xe40c7856B6D0e1B01dECBF9976BB706B9Cd1229f",
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "source",
                  type: "address",
                },
              ],
              name: "originalName",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "source",
                  type: "address",
                },
              ],
              name: "originalSymbol",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
          ],
        },
      },
    },
  ],
  "80001": [
    {
      name: "polygonMumbai",
      chainId: "80001",
      contracts: {
        LinkedFactory: {
          address: "0xC68FbEeCa7BF6bc6259C6FB84A8347aBD0DfA3Df",
          abi: [
            {
              inputs: [
                {
                  internalType: "uint64",
                  name: "_networkSelector",
                  type: "uint64",
                },
                {
                  internalType: "address",
                  name: "_router",
                  type: "address",
                },
                {
                  internalType: "uint64[]",
                  name: "destSelectors",
                  type: "uint64[]",
                },
                {
                  internalType: "address[]",
                  name: "destRouters",
                  type: "address[]",
                },
              ],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "router",
                  type: "address",
                },
              ],
              name: "InvalidRouter",
              type: "error",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
              ],
              name: "OwnableInvalidOwner",
              type: "error",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
              ],
              name: "OwnableUnauthorizedAccount",
              type: "error",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "string",
                  name: "reason",
                  type: "string",
                },
              ],
              name: "LinkError",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "salt",
                  type: "bytes32",
                },
                {
                  indexed: false,
                  internalType: "string",
                  name: "name",
                  type: "string",
                },
                {
                  indexed: false,
                  internalType: "string",
                  name: "symbol",
                  type: "string",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "router",
                  type: "address",
                },
              ],
              name: "LinkNftCreated",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "address",
                  name: "originalAddr",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
              ],
              name: "Linked",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint64[]",
                  name: "selectors",
                  type: "uint64[]",
                },
                {
                  indexed: false,
                  internalType: "address[]",
                  name: "linkedNftAddrs",
                  type: "address[]",
                },
              ],
              name: "LintedNfts",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "previousOwner",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "OwnershipTransferred",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "bytes",
                  name: "sourceRouter",
                  type: "bytes",
                },
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "messageId",
                  type: "bytes32",
                },
                {
                  indexed: false,
                  internalType: "uint64",
                  name: "sourceChainSelector",
                  type: "uint64",
                },
              ],
              name: "Received",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "string",
                  name: "reason",
                  type: "string",
                },
              ],
              name: "UnknownError",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint64",
                  name: "selector",
                  type: "uint64",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "messageId",
                  type: "bytes32",
                },
              ],
              name: "X_Setup",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint64",
                  name: "selector",
                  type: "uint64",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "messageId",
                  type: "bytes32",
                },
              ],
              name: "X_SetupOne",
              type: "event",
            },
            {
              inputs: [
                {
                  components: [
                    {
                      internalType: "bytes32",
                      name: "messageId",
                      type: "bytes32",
                    },
                    {
                      internalType: "uint64",
                      name: "sourceChainSelector",
                      type: "uint64",
                    },
                    {
                      internalType: "bytes",
                      name: "sender",
                      type: "bytes",
                    },
                    {
                      internalType: "bytes",
                      name: "data",
                      type: "bytes",
                    },
                    {
                      components: [
                        {
                          internalType: "address",
                          name: "token",
                          type: "address",
                        },
                        {
                          internalType: "uint256",
                          name: "amount",
                          type: "uint256",
                        },
                      ],
                      internalType: "struct Client.EVMTokenAmount[]",
                      name: "destTokenAmounts",
                      type: "tuple[]",
                    },
                  ],
                  internalType: "struct Client.Any2EVMMessage",
                  name: "message",
                  type: "tuple",
                },
              ],
              name: "ccipReceive",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  components: [
                    {
                      internalType: "bytes32",
                      name: "messageId",
                      type: "bytes32",
                    },
                    {
                      internalType: "uint64",
                      name: "sourceChainSelector",
                      type: "uint64",
                    },
                    {
                      internalType: "bytes",
                      name: "sender",
                      type: "bytes",
                    },
                    {
                      internalType: "bytes",
                      name: "data",
                      type: "bytes",
                    },
                    {
                      components: [
                        {
                          internalType: "address",
                          name: "token",
                          type: "address",
                        },
                        {
                          internalType: "uint256",
                          name: "amount",
                          type: "uint256",
                        },
                      ],
                      internalType: "struct Client.EVMTokenAmount[]",
                      name: "destTokenAmounts",
                      type: "tuple[]",
                    },
                  ],
                  internalType: "struct Client.Any2EVMMessage",
                  name: "message",
                  type: "tuple",
                },
              ],
              name: "ccipReceive2",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint64",
                  name: "",
                  type: "uint64",
                },
              ],
              name: "destNetworks",
              outputs: [
                {
                  internalType: "address",
                  name: "router",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "registrar",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_registrar",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "_nftAddr",
                  type: "address",
                },
              ],
              name: "generateSalt",
              outputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
              stateMutability: "pure",
              type: "function",
            },
            {
              inputs: [],
              name: "getRouter",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              name: "linkedAddrs",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "networkSelector",
              outputs: [
                {
                  internalType: "uint64",
                  name: "",
                  type: "uint64",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "owner",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_registrar",
                  type: "address",
                },
                {
                  internalType: "string",
                  name: "_name",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "_symbol",
                  type: "string",
                },
                {
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "_router",
                  type: "address",
                },
              ],
              name: "precomputeLinkedNft",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "pure",
              type: "function",
            },
            {
              inputs: [],
              name: "registrar",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "renounceOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "router",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint64",
                  name: "_selector",
                  type: "uint64",
                },
                {
                  internalType: "address",
                  name: "_registrar",
                  type: "address",
                },
              ],
              name: "setRegistrar",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes4",
                  name: "interfaceId",
                  type: "bytes4",
                },
              ],
              name: "supportsInterface",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "transferOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
                {
                  internalType: "string",
                  name: "name",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "symbol",
                  type: "string",
                },
                {
                  internalType: "uint64[]",
                  name: "selectors",
                  type: "uint64[]",
                },
                {
                  internalType: "address[]",
                  name: "linkedNftAddrs",
                  type: "address[]",
                },
              ],
              name: "xSetup",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
        },
        Registrar: {
          address: "0x959f18544660b8D144D82028faF04d0AD95E9a85",
          abi: [
            {
              inputs: [
                {
                  internalType: "uint64",
                  name: "_networkSelector",
                  type: "uint64",
                },
                {
                  internalType: "address",
                  name: "_router",
                  type: "address",
                },
                {
                  internalType: "uint64[]",
                  name: "destSelectors",
                  type: "uint64[]",
                },
                {
                  internalType: "address[]",
                  name: "destRouters",
                  type: "address[]",
                },
              ],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
              ],
              name: "OwnableInvalidOwner",
              type: "error",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
              ],
              name: "OwnableUnauthorizedAccount",
              type: "error",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "address",
                  name: "originalAddr",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
              ],
              name: "Linked",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "previousOwner",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "OwnershipTransferred",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint64",
                  name: "selector",
                  type: "uint64",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "messageId",
                  type: "bytes32",
                },
                {
                  indexed: false,
                  internalType: "bytes",
                  name: "data",
                  type: "bytes",
                },
              ],
              name: "X_Setup",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint64",
                  name: "selector",
                  type: "uint64",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "messageId",
                  type: "bytes32",
                },
              ],
              name: "X_SetupOne",
              type: "event",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
                {
                  internalType: "uint64",
                  name: "destSelector",
                  type: "uint64",
                },
              ],
              name: "calculateCreateLinkedNftFee",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
              ],
              name: "calculateLinting",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint64",
                  name: "",
                  type: "uint64",
                },
              ],
              name: "destNetworks",
              outputs: [
                {
                  internalType: "address",
                  name: "router",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "factory",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "factory",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "registrar",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
              ],
              name: "generateSalt",
              outputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
              stateMutability: "pure",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "admin",
                  type: "address",
                },
              ],
              name: "getNftAdmin",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              name: "linkedAddrs",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "networkSelector",
              outputs: [
                {
                  internalType: "uint64",
                  name: "",
                  type: "uint64",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              name: "nftAdmin",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "owner",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "registrar",
                  type: "address",
                },
                {
                  internalType: "string",
                  name: "_name",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "_symbol",
                  type: "string",
                },
                {
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "_router",
                  type: "address",
                },
              ],
              name: "precomputeWrappedNft",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "pure",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
                {
                  internalType: "bytes32",
                  name: "deployTx",
                  type: "bytes32",
                },
              ],
              name: "register",
              outputs: [],
              stateMutability: "payable",
              type: "function",
            },
            {
              inputs: [],
              name: "renounceOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "router",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint64",
                  name: "_selector",
                  type: "uint64",
                },
                {
                  internalType: "address",
                  name: "_factory",
                  type: "address",
                },
              ],
              name: "setFactory",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_factory",
                  type: "address",
                },
              ],
              name: "setFactory",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
                {
                  internalType: "uint64",
                  name: "destSelector",
                  type: "uint64",
                },
              ],
              name: "setup",
              outputs: [],
              stateMutability: "payable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "transferOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "withdraw",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
        },
        SourceNftLib: {
          address: "0x0B8F331A21B7A8E304016A58E37eF92516dd90E1",
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "source",
                  type: "address",
                },
              ],
              name: "originalName",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "source",
                  type: "address",
                },
              ],
              name: "originalSymbol",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
          ],
        },
      },
    },
  ],
  "11155111": [
    {
      name: "sepolia",
      chainId: "11155111",
      contracts: {
        LinkedFactory: {
          address: "0x35788BB345Ba394F4f561eaf4Aae28497a6010ad",
          abi: [
            {
              inputs: [
                {
                  internalType: "uint64",
                  name: "_networkSelector",
                  type: "uint64",
                },
                {
                  internalType: "address",
                  name: "_router",
                  type: "address",
                },
                {
                  internalType: "uint64[]",
                  name: "destSelectors",
                  type: "uint64[]",
                },
                {
                  internalType: "address[]",
                  name: "destRouters",
                  type: "address[]",
                },
              ],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "router",
                  type: "address",
                },
              ],
              name: "InvalidRouter",
              type: "error",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
              ],
              name: "OwnableInvalidOwner",
              type: "error",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
              ],
              name: "OwnableUnauthorizedAccount",
              type: "error",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "string",
                  name: "reason",
                  type: "string",
                },
              ],
              name: "LinkError",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "salt",
                  type: "bytes32",
                },
                {
                  indexed: false,
                  internalType: "string",
                  name: "name",
                  type: "string",
                },
                {
                  indexed: false,
                  internalType: "string",
                  name: "symbol",
                  type: "string",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "router",
                  type: "address",
                },
              ],
              name: "LinkNftCreated",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "address",
                  name: "originalAddr",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
              ],
              name: "Linked",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint64[]",
                  name: "selectors",
                  type: "uint64[]",
                },
                {
                  indexed: false,
                  internalType: "address[]",
                  name: "linkedNftAddrs",
                  type: "address[]",
                },
              ],
              name: "LintedNfts",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "previousOwner",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "OwnershipTransferred",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "bytes",
                  name: "sourceRouter",
                  type: "bytes",
                },
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "messageId",
                  type: "bytes32",
                },
                {
                  indexed: false,
                  internalType: "uint64",
                  name: "sourceChainSelector",
                  type: "uint64",
                },
              ],
              name: "Received",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "string",
                  name: "reason",
                  type: "string",
                },
              ],
              name: "UnknownError",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint64",
                  name: "selector",
                  type: "uint64",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "messageId",
                  type: "bytes32",
                },
              ],
              name: "X_Setup",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint64",
                  name: "selector",
                  type: "uint64",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "messageId",
                  type: "bytes32",
                },
              ],
              name: "X_SetupOne",
              type: "event",
            },
            {
              inputs: [
                {
                  components: [
                    {
                      internalType: "bytes32",
                      name: "messageId",
                      type: "bytes32",
                    },
                    {
                      internalType: "uint64",
                      name: "sourceChainSelector",
                      type: "uint64",
                    },
                    {
                      internalType: "bytes",
                      name: "sender",
                      type: "bytes",
                    },
                    {
                      internalType: "bytes",
                      name: "data",
                      type: "bytes",
                    },
                    {
                      components: [
                        {
                          internalType: "address",
                          name: "token",
                          type: "address",
                        },
                        {
                          internalType: "uint256",
                          name: "amount",
                          type: "uint256",
                        },
                      ],
                      internalType: "struct Client.EVMTokenAmount[]",
                      name: "destTokenAmounts",
                      type: "tuple[]",
                    },
                  ],
                  internalType: "struct Client.Any2EVMMessage",
                  name: "message",
                  type: "tuple",
                },
              ],
              name: "ccipReceive",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  components: [
                    {
                      internalType: "bytes32",
                      name: "messageId",
                      type: "bytes32",
                    },
                    {
                      internalType: "uint64",
                      name: "sourceChainSelector",
                      type: "uint64",
                    },
                    {
                      internalType: "bytes",
                      name: "sender",
                      type: "bytes",
                    },
                    {
                      internalType: "bytes",
                      name: "data",
                      type: "bytes",
                    },
                    {
                      components: [
                        {
                          internalType: "address",
                          name: "token",
                          type: "address",
                        },
                        {
                          internalType: "uint256",
                          name: "amount",
                          type: "uint256",
                        },
                      ],
                      internalType: "struct Client.EVMTokenAmount[]",
                      name: "destTokenAmounts",
                      type: "tuple[]",
                    },
                  ],
                  internalType: "struct Client.Any2EVMMessage",
                  name: "message",
                  type: "tuple",
                },
              ],
              name: "ccipReceive2",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint64",
                  name: "",
                  type: "uint64",
                },
              ],
              name: "destNetworks",
              outputs: [
                {
                  internalType: "address",
                  name: "router",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "registrar",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_registrar",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "_nftAddr",
                  type: "address",
                },
              ],
              name: "generateSalt",
              outputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
              stateMutability: "pure",
              type: "function",
            },
            {
              inputs: [],
              name: "getRouter",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              name: "linkedAddrs",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "networkSelector",
              outputs: [
                {
                  internalType: "uint64",
                  name: "",
                  type: "uint64",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "owner",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_registrar",
                  type: "address",
                },
                {
                  internalType: "string",
                  name: "_name",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "_symbol",
                  type: "string",
                },
                {
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "_router",
                  type: "address",
                },
              ],
              name: "precomputeLinkedNft",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "pure",
              type: "function",
            },
            {
              inputs: [],
              name: "registrar",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "renounceOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "router",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint64",
                  name: "_selector",
                  type: "uint64",
                },
                {
                  internalType: "address",
                  name: "_registrar",
                  type: "address",
                },
              ],
              name: "setRegistrar",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes4",
                  name: "interfaceId",
                  type: "bytes4",
                },
              ],
              name: "supportsInterface",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "transferOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
                {
                  internalType: "string",
                  name: "name",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "symbol",
                  type: "string",
                },
                {
                  internalType: "uint64[]",
                  name: "selectors",
                  type: "uint64[]",
                },
                {
                  internalType: "address[]",
                  name: "linkedNftAddrs",
                  type: "address[]",
                },
              ],
              name: "xSetup",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
        },
        Registrar: {
          address: "0x50998c26360A5c675bf68956267947D37Cb2F6A8",
          abi: [
            {
              inputs: [
                {
                  internalType: "uint64",
                  name: "_networkSelector",
                  type: "uint64",
                },
                {
                  internalType: "address",
                  name: "_router",
                  type: "address",
                },
                {
                  internalType: "uint64[]",
                  name: "destSelectors",
                  type: "uint64[]",
                },
                {
                  internalType: "address[]",
                  name: "destRouters",
                  type: "address[]",
                },
              ],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
              ],
              name: "OwnableInvalidOwner",
              type: "error",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "account",
                  type: "address",
                },
              ],
              name: "OwnableUnauthorizedAccount",
              type: "error",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "address",
                  name: "originalAddr",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
              ],
              name: "Linked",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "previousOwner",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "OwnershipTransferred",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint64",
                  name: "selector",
                  type: "uint64",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "messageId",
                  type: "bytes32",
                },
                {
                  indexed: false,
                  internalType: "bytes",
                  name: "data",
                  type: "bytes",
                },
              ],
              name: "X_Setup",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint64",
                  name: "selector",
                  type: "uint64",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "messageId",
                  type: "bytes32",
                },
              ],
              name: "X_SetupOne",
              type: "event",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
                {
                  internalType: "uint64",
                  name: "destSelector",
                  type: "uint64",
                },
              ],
              name: "calculateCreateLinkedNftFee",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
              ],
              name: "calculateLinting",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint64",
                  name: "",
                  type: "uint64",
                },
              ],
              name: "destNetworks",
              outputs: [
                {
                  internalType: "address",
                  name: "router",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "factory",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "factory",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "registrar",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
              ],
              name: "generateSalt",
              outputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
              stateMutability: "pure",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "admin",
                  type: "address",
                },
              ],
              name: "getNftAdmin",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              name: "linkedAddrs",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "networkSelector",
              outputs: [
                {
                  internalType: "uint64",
                  name: "",
                  type: "uint64",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              name: "nftAdmin",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "owner",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "registrar",
                  type: "address",
                },
                {
                  internalType: "string",
                  name: "_name",
                  type: "string",
                },
                {
                  internalType: "string",
                  name: "_symbol",
                  type: "string",
                },
                {
                  internalType: "address",
                  name: "nftAddress",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "_router",
                  type: "address",
                },
              ],
              name: "precomputeWrappedNft",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "pure",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
                {
                  internalType: "bytes32",
                  name: "deployTx",
                  type: "bytes32",
                },
              ],
              name: "register",
              outputs: [],
              stateMutability: "payable",
              type: "function",
            },
            {
              inputs: [],
              name: "renounceOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "router",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint64",
                  name: "_selector",
                  type: "uint64",
                },
                {
                  internalType: "address",
                  name: "_factory",
                  type: "address",
                },
              ],
              name: "setFactory",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_factory",
                  type: "address",
                },
              ],
              name: "setFactory",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "nftAddr",
                  type: "address",
                },
                {
                  internalType: "uint64",
                  name: "destSelector",
                  type: "uint64",
                },
              ],
              name: "setup",
              outputs: [],
              stateMutability: "payable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "transferOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "withdraw",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
        },
        SourceNftLib: {
          address: "0xF32B172072E712C282dD78152906C7Cfc8E8B7ea",
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "source",
                  type: "address",
                },
              ],
              name: "originalName",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "source",
                  type: "address",
                },
              ],
              name: "originalSymbol",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
          ],
        },
      },
    },
  ],
} as const;
