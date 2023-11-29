# [No code NFT bridge](#new-nft-bridge)
🧪 A trust-less, serverless NFT bridge framework with minimal setup.

**To start quickly, go to the [Getting Started](#getting-started) section.**

It's not production ready, yet. So only available on the Testnets.

# Version 0
The [version 0](https://github.com/ahmetson/nft-bridge/tree/chainlink-function)
was implemented for [Ethglobal 2021 Hackathon](https://ethglobal.com/showcase/nft-bridge-tk299) using chainlink oracles.

For me, Chainlink CCIP was the best candidate to improve the NFT Bridge.
At that time it wasn't launched. So with this hackathon
I finally want to release the more secure NFT Bridge.

> I signed up for the announcements.
> 
> I joined to the early access.
> 
> Within two years I messaged several times Chainlink, 
> about the news regarding CCIP but no response.

--- 
# 🔥New NFT Bridge
A new NFT Bridge solves all the issues of the first version.


| Category        | Version 0                                | New NFT Bridge                                          |
|-----------------|------------------------------------------|---------------------------------------------------------|
| **Development** | Requires to deploy smartcontracts        | :blush: **No setup***                                   |
| **UI**          | Multiple transactions, switching network | :satisfied: **Single transaction**                      |
| **Middleware**  | Custom API in a centralized server       | :evergreen_tree: **Decentralized Oracle Network (DON)** |

:blush: *No setup &ndash; If your NFT has additional parameter besides ERC721 standard, then
there is needed a minimal setup. Otherwise, no code is needed.*

---

# Getting Started

## Pre-requirements
Deploy your NFT on the original chain.

*Recommended to have the smartcontract that's [Ownable](https://docs.openzeppelin.com/contracts/5.x/access-control#ownership-and-ownable).*

> [AccessControl](https://docs.openzeppelin.com/contracts/5.x/access-control#role-based-access-control) not supported YET.
> 
> [AccessManager](https://docs.openzeppelin.com/contracts/5.x/access-control#using_accessmanager) not supported YET.

## Setup
Go to the [nft-bridge/setup](https://nft-bridge.org/setup).

Connect your wallet, switch to the blockchain where your NFT was deployed.

Pass the NFT address.

Then, mark the destination chains where you want to bridge it.

> **Either you must be an owner of the NFT, or you must be the deployer of the NFT.**

## First bridge

Go to the [nft-bridge/bridge](https://nft-bridge.org/bridge)

Connect your wallet. You don't have to be the owner of the smartcontract.

The smartcontract will show the list of NFT types for bridging.
Click any type to see all owned NFTs.
Click on the NFT.
Define the destination chain.

Click Approve. Wait for two/three-phase confirmation.

Done. First, the smartcontract checks the ownership. 
If the NFT is not ownable then, it will verify the deployed transaction.

Then, it will Wrap your NFT into the frozen NFT.

The last phase is triggered by the Wrapped NFT.
The locking process requests an NFT minting on the destination chain via chainlink oracles.

## Unbridge/Cross-chain transfer

Go to [nft-bridge/cross-transfer](https://nft-bridge.org/transfer)

Connect your wallet.

Pick the NFT type you want to transfer.
Pick the NFT in the list.

Click on transfer and select the destination among the options.

If the destination is the original blockchain, then NFT will be unwrapped.
Or, if its other blockchain, then NFT will be minted and burned in the source blockchain.

---
# Structure
The NFT Bridge has only smartcontracts and nothing else.


## Smartcontracts
It has three identical smartcontracts in every supported blockchains.

### Linked NFT
The NFT copy of the original NFT on other blockchains.

### Wrapped NFT
The smartcontract that froze the original NFT.
Then connects the original nft with linked NFTs on other chains.

### Registrar
A platform that creates Linked NFT and Wrapped NFT instances for the NFTs.
This smartcontract makes sure that only owner of the NFT can register NFTs.

## Relationship
The [registrars](#registrar) are able to create the Wrapped NFTs and Linked NFTs.
The registrars also responsible to link the linked nfts across the blockchains.

The [Linked NFTs](#linked-nft) can talk to Wrapped NFTs and Linked NFTs.

The [Wrapped NFTs](#wrapped-nft) can talk to Linked NFTs only.

## API
The list of methods

| Smartcontract | Permission | Method        | Description                                                     | Arguments                                                                     |
|---------------|------------|---------------|-----------------------------------------------------------------|-------------------------------------------------------------------------------|
| Registrar     | NftAdmin   | register      | Registers a new nft.<br/>Creates smartcontracts across networks | Accepts the NFT address, deployment <br/>transaction and list of destinations |
| Registrar     | Admin      | withdraw      | Withdraws the fees collected from the nft minting               | No arguments                                                                  |
| Wrapped NFT   | Anyone     | xTransferTo   | Wraps the NFT as a locked NFT and mints in the destination      | Accepts the destination                                                       |
| Wrapped NFT   | Oracle     | unwrap        | Asks to transfer the NFT to the given address                   | Accepts the address of the owner                                              |
| Linked NFT    | Anyone     | xTransferTo   | Burns the NFT and transfers to the destination                  | Accepts the destination                                                       |
| Wrapped NFT   | Oracle     | xTransferFrom | Mints the NFT and transfers to the given address                | Accepts the address of the new owner                                          |

Permissions
 * NftAdmin &ndash; an owner or the deployer of the nft.
 * Admin &ndash; a deployer of the Nft Bridge
 * Oracle &ndash; a chainlink CCIP oracle
 * Anyone &ndash; owner of the nft.

---
# Supported Blockchains
Since it's core underlying product is CCIP, then it supports the same testnets.

* Sepolia Testnet
* Mumbai Testnet
* Fuji Testnet
* BNB Chain Testnet

---
# Example for a Demo
For example, I will create a simple NFT on remix using the LinkedNFT. After the deployment, let's mint the first NFT.
As you see, the NFT will be visible on various blockchains. Let's transfer the NFT on the second blockchain by selling it on OpenSea.
When another account buys the NFT, he will have it on both chains.

## Version 2.1
A demo without cross-chain availability.

## Version 2.2
A demo with the chainlink CCIP

